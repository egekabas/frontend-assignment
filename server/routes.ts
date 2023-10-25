import { Router, getExpressRouter } from "./framework/router";

import { ObjectId } from "mongodb";
import { Article, Bio, CommentToArticle, CommentToComment, Subscripton, User, Validation, WebSession } from "./app";
import { BadValuesError } from "./concepts/errors";
import { ValidationNotFoundError } from "./concepts/validation";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    checkValid(username, "username");
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    checkValid(username, "username");
    checkValid(password, "password");
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);

    await Bio.deleteVBiosByUser(user);
    await Subscripton.deleteByUser(user);
    await Validation.deleteByUser(user);
    
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    checkValid(username, "username");
    checkValid(password, "password");

    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  //COMMENT

  @Router.get("/comments/toArticle")
  async getCommentsToArticle(author?: string, targetId?: string) {
    const authorId = author ? (await User.getUserByUsername(author))._id : undefined;
    
    if (targetId) {
      await Article.exists(new ObjectId(targetId));
    }
    const comments = await CommentToArticle.getCommentsByAuthorAndTarget(authorId, targetId ? new ObjectId(targetId) : undefined);
    return Responses.populateAuthors(comments);
  }

  @Router.get("/comments/toComment")
  async getCommentsToComment(author?: string, targetId?: string) {
    const authorId = author ? (await User.getUserByUsername(author))._id : undefined;
    if (targetId) {
      try {
        await CommentToArticle.exists(new ObjectId(targetId));
      } catch {
        await CommentToComment.exists(new ObjectId(targetId));
      }
    }
    const comments = await CommentToComment.getCommentsByAuthorAndTarget(authorId, targetId ? new ObjectId(targetId) : undefined);
    return Responses.populateAuthors(comments);
  }

  @Router.post("/comments/toArticle")
  async createCommentToArticle(session: WebSessionDoc, content: string, targetId: string) {
    checkValid(content, "content");
    checkValid(targetId, "targetId");

    const user = WebSession.getUser(session);
    const target = new ObjectId(targetId);
    await Article.exists(target);
    await checkArticleAccess(user, target);

    const created = await CommentToArticle.create(target, user, content);
    return { msg: created.msg, comment: await Responses.populateAuthor(created.comment) };
  }

  @Router.post("/comments/toComment")
  async createCommentToComment(session: WebSessionDoc, content: string, targetId: string) {
    checkValid(content, "content");
    checkValid(targetId, "targetId");

    const user = WebSession.getUser(session);
    try {
      await CommentToArticle.exists(new ObjectId(targetId));
    } catch {
      await CommentToComment.exists(new ObjectId(targetId));
    }

    const created = await CommentToComment.create(new ObjectId(targetId), user, content);
    return { msg: created.msg, comment: await Responses.populateAuthor(created.comment) };
  }

  //BIO

  @Router.post("/bios")
  async createBio(session: WebSessionDoc, content: string) {
    checkValid(content, "content");

    const user = WebSession.getUser(session);
    const created = await Bio.create(user, content);
    return { msg: created.msg, bio: await Responses.populateUser(created.bio) };
  }

  @Router.get("/bios")
  async getBio(user?: string) {
    if (user) {
      const id = (await User.getUserByUsername(user))._id;
      return Responses.populateUser(await Bio.getByUser(id));
    } else {
      return Responses.populateUsers(await Bio.getBios({}));
    }
  }

  @Router.delete("/bios")
  async deleteBio(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    await Bio.hasBio(user);
    try {
      await Validation.removeValidation(user);
    } catch (e) {
      if (!(e instanceof ValidationNotFoundError)) {
        throw e;
      }
    }
    try{
      await Validation.removeRequest(user);
    } catch(e){
      if(!(e instanceof ValidationNotFoundError)){
        throw e;
      }
    }
    return Bio.deleteBio(user);
  }

  //SUBSCRIPTION

  

  @Router.post("/subscribe")
  async subscribe(session: WebSessionDoc, creator: string) {
    checkValid(creator, "creator");

    const user = WebSession.getUser(session);
    const creatorId = (await User.getUserByUsername(creator))._id;
    return Subscripton.subscribe(creatorId, user);
  }
  @Router.post("/unsubscribe")
  async unsubscribe(session: WebSessionDoc, creator: string) {
    checkValid(creator, "creator");

    const user = WebSession.getUser(session);
    const creatorId = (await User.getUserByUsername(creator))._id;
    return Subscripton.unsubscribe(creatorId, user);
  }

  @Router.get("/subscriptions")
  async getSubscriptions(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const subscriptions = await Subscripton.getSubscriptions(user);
    return Responses.populateCreators(await Responses.populateSubscribers(subscriptions));
  }
  @Router.get("/subscribers")
  async getSubscribers(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const subscribers = await Subscripton.getSubscribers(user);
    return Responses.populateCreators(await Responses.populateSubscribers(subscribers));
  }

  @Router.post("/makePaid")
  async makePaid(session: WebSessionDoc, articleId: string) {
    checkValid(articleId, "articleId");

    const user = WebSession.getUser(session);
    await Article.isAuthor(user, new ObjectId(articleId));
    return Subscripton.makePaid(new ObjectId(articleId));
  }
  @Router.post("/makeFree")
  async makeFree(session: WebSessionDoc, articleId: string) {
    checkValid(articleId, "articleId");

    const user = WebSession.getUser(session);
    await Article.isAuthor(user, new ObjectId(articleId));
    return Subscripton.makeFree(new ObjectId(articleId));
  }

  @Router.get("/isSubscribed")
  async isSubscribed(session: WebSessionDoc, creator: string){
    const user = WebSession.getUser(session);
    const creatorId = (await User.getUserByUsername(creator))._id;
    try{
      await Subscripton.checkSubscribed(creatorId, user);
      return true;
    } catch{
      return false;
    }
  }

  //ARTICLE
  
  @Router.get("/articles/isPaid")
  async isPaid(article: string){
    checkValid(article, "article");
    try{
      await Subscripton.checkContentIsNotPaid(new ObjectId(article));
      return false;
    } catch{
      return true;
    }
  }

  @Router.get("/articles/noContent")
  async getArticlesNoContent(author?: string, articleId?: string) {
    if(articleId){
      const article = await Article.getArticlebyId(new ObjectId(articleId));
      return Responses.hideContent(await Responses.populateAuthor(article));
    }
    let articles;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      articles = await Article.getByAuthor(id);
    } else {
      articles = await Article.getArticles({});
    }
    return Responses.hideContents(await Responses.populateAuthors(articles));
  }

  @Router.get("/articles/withContent")
  async getArticleWithContent(session: WebSessionDoc, articleId: string) {
    checkValid(articleId, "articleId");

    const user = WebSession.getUser(session);
    await checkArticleAccess(user, new ObjectId(articleId));

    const article = await Article.getArticlebyId(new ObjectId(articleId));
    return await Responses.populateAuthor(article);
  }

  @Router.post("/articles")
  async createArticle(session: WebSessionDoc, title: string, content: string) {
    checkValid(title, "title");
    checkValid(content, "content");

    const user = WebSession.getUser(session);
    await Validation.getValidation(user);
    const created = await Article.create(user, title, content);
    return { msg: created.msg, article: await Responses.populateAuthor(created.article) };
  }

  // Validation

  @Router.get("/validation")
  async getValidation(user?: string) {
    if (user) {
      const id = (await User.getUserByUsername(user))._id;
      return Responses.populateUser(await Validation.getValidation(id));
    } else {
      return Responses.populateUsers(await Validation.getAllValidations());
    }
  }

  @Router.get("/validation/ownRequest")
  async ownRequest(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Validation.getRequest(user);
  }

  @Router.get("/validation/request")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    await User.checkAdminAccess(user);
    return Responses.populateUsers(await Validation.getAllRequests());
  }

  @Router.post("/validation/request")
  async requestValidation(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return Validation.addRequest(user);
  }

  @Router.post("/validation/approve")
  async approveValidation(session: WebSessionDoc, requestUser: string) {
    checkValid(requestUser, "requestUser");

    const user = WebSession.getUser(session);
    await User.checkAdminAccess(user);
    const requestUserId = (await User.getUserByUsername(requestUser))._id;
    await Bio.hasBio(requestUserId);
    return Validation.approveRequest(requestUserId);
  }

  @Router.post("/validation/reject")
  async rejectValidation(session: WebSessionDoc, requestUser: string) {
    checkValid(requestUser, "requestUser");

    const user = WebSession.getUser(session);
    await User.checkAdminAccess(user);
    const requestUserId = (await User.getUserByUsername(requestUser))._id;
    return Validation.rejectRequest(requestUserId);
  }
}

async function checkArticleAccess(user: ObjectId, articleId: ObjectId) {
  const article = await Article.getArticlebyId(articleId);

  try {
    await Subscripton.checkContentIsNotPaid(article._id);
    return;
  } catch {
    if (article.author.equals(user)) {
      return;
    } else {
      await Subscripton.checkSubscribed(article.author, user);
      return;
    }
  }
}
//eslint-disable-next-line
function checkValid(val: any, name: string) {
  if (typeof val !== "string") {
    throw new BadValuesError(`Need a valid string value for field ${name}`);
  }
}
export default getExpressRouter(new Routes());

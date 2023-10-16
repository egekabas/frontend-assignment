import { ObjectId } from "mongodb";
import { User } from "./app";
import { ArticleAuthorNotMatchError, ArticleDoc } from "./concepts/article";
import { BioAlreadyExistsError, BioNotFoundError } from "./concepts/bio";
import { NotSubscribedError, SubscribedError } from "./concepts/subscription";
import { AlreadyValidatedError, ValidationNotFoundError, ValidationRequestAllreadyExistsError, ValidationRequestNotFoundError } from "./concepts/validation";
import { FormattableError, Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert Docs into more readable format for the frontend by converting the author id into a username.
   */
  static async populateAuthor<T extends { author: ObjectId } | null>(post: T): Promise<T> {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    return { ...post, author: author.username };
  }
  static async populateAuthors<T extends { author: ObjectId }>(posts: T[]) {
    return Promise.all(posts.map((post) => Responses.populateAuthor(post)));
  }

  /**
   * Convert Docs into more readable format for the frontend by converting the subscriber id into a username.
   */
  static async populateSubscriber<T extends { subscriber: ObjectId } | null>(post: T): Promise<T> {
    if (!post) {
      return post;
    }
    const subscriber = await User.getUserById(post.subscriber);
    return { ...post, subscriber: subscriber.username };
  }
  static async populateSubscribers<T extends { subscriber: ObjectId }>(posts: T[]) {
    return Promise.all(posts.map((post) => Responses.populateSubscriber(post)));
  }

  /**
   * Convert Docs into more readable format for the frontend by converting the creator id into a username.
   */
  static async populateCreator<T extends { creator: ObjectId } | null>(post: T): Promise<T> {
    if (!post) {
      return post;
    }
    const creator = await User.getUserById(post.creator);
    return { ...post, creator: creator.username };
  }
  static async populateCreators<T extends { creator: ObjectId }>(posts: T[]) {
    return Promise.all(posts.map((post) => Responses.populateCreator(post)));
  }

  /**
   * Convert Docs into more readable format for the frontend by converting the creator id into a username.
   */
  static async populateUser<T extends { user: ObjectId } | null>(post: T): Promise<T> {
    if (!post) {
      return post;
    }
    const user = await User.getUserById(post.user);
    return { ...post, user: user.username };
  }
  static async populateUsers<T extends { user: ObjectId }>(posts: T[]) {
    return Promise.all(posts.map((post) => Responses.populateUser(post)));
  }

  //Remove the content from article, to be viewed by users that dont have full view access
  static hideContent(article: ArticleDoc) {
    // eslint-disable-next-line
    const { content, ...strippedArticle } = article;
    return strippedArticle;
  }
  static hideContents(articles: ArticleDoc[]) {
    return articles.map((article) => Responses.hideContent(article));
  }
}

Router.registerError(ArticleAuthorNotMatchError, async (e) => {
  const author = await User.getUserById(e.author);
  return e.formatWith(author.username);
});

// Clever function. If e is an error that has the user key, we can use generics to
// replace user id with username string
async function replace_user<T extends FormattableError & { user: ObjectId }>(e: T) {
  const user = await User.getUserById(e.user);
  return e.formatWith(user.username);
}
Router.registerError(BioNotFoundError, replace_user);
Router.registerError(BioAlreadyExistsError, replace_user);
Router.registerError(ValidationRequestNotFoundError, replace_user);
Router.registerError(ValidationRequestAllreadyExistsError, replace_user);
Router.registerError(ValidationNotFoundError, replace_user);
Router.registerError(AlreadyValidatedError, replace_user);

async function replace_creator_subscriber<T extends FormattableError & { creator: ObjectId; subscriber: ObjectId }>(e: T) {
  const [creator, subscriber] = await Promise.all([User.getUserById(e.creator), User.getUserById(e.subscriber)]);
  return e.formatWith(creator.username, subscriber.username);
}
Router.registerError(SubscribedError, replace_creator_subscriber);
Router.registerError(NotSubscribedError, replace_creator_subscriber);

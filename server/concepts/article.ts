import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ArticleDoc extends BaseDoc {
  author: ObjectId;
  title: string;
  content: string;
}

export default class ArticleConcept {
  public readonly articles = new DocCollection<ArticleDoc>("articles");

  async create(author: ObjectId, title: string, content: string) {
    const _id = await this.articles.createOne({ author, title, content });
    return { msg: "Article successfully created!", article: await this.articles.readOne({ _id }) };
  }

  async getArticlebyId(_id: ObjectId) {
    const article = await this.articles.readOne({ _id });
    if (article === null) {
      throw new NotFoundError(`Article ${_id} does not exist!`);
    }
    return article;
  }

  async getArticles(query: Filter<ArticleDoc>) {
    const articles = await this.articles.readMany(query, {
      sort: { dateCreated: -1 },
    });
    return articles;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getArticles({ author });
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const article = await this.articles.readOne({ _id });
    if (!article) {
      throw new NotFoundError(`Article ${_id} does not exist!`);
    }
    if (article.author.toString() !== user.toString()) {
      throw new ArticleAuthorNotMatchError(user, _id);
    }
  }

  async exists(_id: ObjectId) {
    const article = await this.articles.readOne({ _id });
    if (article === null) {
      throw new NotFoundError(`Article ${_id} does not exist!`);
    }
  }
}

export class ArticleAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of article {1}!", author, _id);
  }
}

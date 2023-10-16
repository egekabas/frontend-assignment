import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";

export interface CommentDoc extends BaseDoc {
  target: ObjectId;
  author: ObjectId;
  content: string;
}

export default class CommentConcept {
  public readonly comments;
  constructor(targetConceptName: string) {
    this.comments = new DocCollection<CommentDoc>(`commentsTo${targetConceptName}`);
  }

  async create(target: ObjectId, author: ObjectId, content: string) {
    const _id = await this.comments.createOne({ target, author, content });
    return { msg: "Comment successfully created!", comment: await this.comments.readOne({ _id }) };
  }

  async getCommentsByAuthorAndTarget(author?: ObjectId, target?: ObjectId) {
    let filter = {};
    if (author) {
      filter = { ...filter, author };
    }
    if (target) {
      filter = { ...filter, target };
    }
    return this.getComments(filter);
  }

  async getComments(query: Filter<CommentDoc>) {
    const comments = await this.comments.readMany(query, {
      sort: { dateCreated: -1 },
    });
    return comments;
  }

  async getCommentById(_id: ObjectId): Promise<CommentDoc> {
    const comment = await this.comments.readOne({ _id });
    if (comment === null) {
      throw new NotFoundError(`Comment {id} not Found`);
    } else {
      return comment;
    }
  }

  async exists(_id: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (comment === null) {
      throw new NotFoundError(`Comment {id} not Found`);
    }
  }
}

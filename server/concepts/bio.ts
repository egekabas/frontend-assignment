import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface BioDoc extends BaseDoc {
  user: ObjectId;
  content: string;
}

export default class BioConcept {
  public readonly bios = new DocCollection<BioDoc>("bios");

  async create(user: ObjectId, content: string) {
    await this.hasNoBio(user);
    const _id = await this.bios.createOne({ user, content });
    return { msg: "Bio successfully created!", bio: await this.bios.readOne({ _id }) };
  }

  async getBios(query: Filter<BioDoc>) {
    const bios = await this.bios.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return bios;
  }

  async hasBio(user: ObjectId) {
    const bio = await this.bios.readOne({ user });
    if (bio === null) {
      throw new BioNotFoundError(user);
    }
  }

  async getByUser(user: ObjectId) {
    await this.hasBio(user);
    return await this.bios.readOne({ user });
  }

  async deleteBio(user: ObjectId) {
    await this.hasBio(user);
    await this.bios.deleteOne({ user });
    return { msg: "Bio deleted successfully!" };
  }

  async hasNoBio(user: ObjectId) {
    const bio = await this.bios.readOne({ user });
    if (bio !== null) {
      throw new BioAlreadyExistsError(user);
    }
  }
}

export class BioNotFoundError extends NotFoundError {
  constructor(public readonly user: ObjectId) {
    super("Bio for user {0} not found", user);
  }
}

export class BioAlreadyExistsError extends NotAllowedError {
  constructor(public readonly user: ObjectId) {
    super("Bio for user {0} already exists", user);
  }
}

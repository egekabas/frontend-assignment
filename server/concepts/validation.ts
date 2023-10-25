import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface ValidationDoc extends BaseDoc {
  user: ObjectId;
}

export interface ValidationRequestDoc extends BaseDoc {
  user: ObjectId;
}

export default class ValidationConcept {
  public readonly validations = new DocCollection<ValidationDoc>("validations");
  public readonly requests = new DocCollection<ValidationRequestDoc>("validationRequests");

  async getAllRequests() {
    return this.requests.readMany({});
  }

  async deleteByUser(user: ObjectId) {
    await this.requests.deleteMany({ user });
    await this.validations.deleteMany({ user });
  }

  async getRequest(user: ObjectId) {
    const request = await this.requests.readOne({ user });
    if(request === null) {
      throw new ValidationRequestNotFoundError(user);
    } else{
      return request;
    }
  }

  async addRequest(user: ObjectId) {
    await this.canAddRequest(user);
    await this.requests.createOne({ user });
    return { msg: "Sent validation request!" };
  }

  private async canAddRequest(user: ObjectId) {
    const validation = await this.validations.readOne({ user });
    if (validation !== null) {
      throw new AlreadyValidatedError(user);
    }

    const request = await this.requests.readOne({ user });
    if (request !== null) {
      throw new ValidationRequestAllreadyExistsError(user);
    }
  }

  async approveRequest(user: ObjectId) {
    await this.removeRequest(user);
    await this.addValidation(user);
    return { msg: "Approved validation request!" };
  }

  async rejectRequest(user: ObjectId) {
    await this.removeRequest(user);
    return { msg: "Rejected validation request!" };
  }

  async removeRequest(user: ObjectId) {
    const request = await this.requests.popOne({ user });
    if (request === null) {
      throw new ValidationNotFoundError(user);
    }
  }

  async removeValidation(user: ObjectId) {
    const validation = await this.validations.popOne({ user });
    if (validation === null) {
      throw new ValidationNotFoundError(user);
    }
    return { msg: "Validation removed!" };
  }

  private async addValidation(user: ObjectId) {
    void this.validations.createOne({ user });
  }

  async getValidation(user: ObjectId) {
    const validation = await this.validations.readOne({ user });
    if (validation === null) {
      throw new ValidationNotFoundError(user);
    }
    return validation;
  }
  async getAllValidations() {
    return this.validations.readMany({});
  }
}

export class ValidationRequestNotFoundError extends NotFoundError {
  constructor(public readonly user: ObjectId) {
    super("Validation request for {0} does not exist!", user);
  }
}

export class ValidationRequestAllreadyExistsError extends NotAllowedError {
  constructor(public readonly user: ObjectId) {
    super("Validation request for {0} already exists!", user);
  }
}

export class ValidationNotFoundError extends NotFoundError {
  constructor(public readonly user: ObjectId) {
    super("Validation for {0} does not exist!", user);
  }
}

export class AlreadyValidatedError extends NotAllowedError {
  constructor(public readonly user: ObjectId) {
    super("{0} is already validated!", user);
  }
}

import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface SubscriberDoc extends BaseDoc {
  creator: ObjectId;
  subscriber: ObjectId;
}

export interface PaidContentDoc extends BaseDoc {
  content: ObjectId;
}

export default class SubscriptonConcept {
  public readonly subscribers = new DocCollection<SubscriberDoc>("subscribers");
  public readonly paidContent = new DocCollection<PaidContentDoc>("paidContent");


  async deleteByUser(user: ObjectId) {
    await this.subscribers.deleteMany({ creator: user });
    await this.subscribers.deleteMany({ subscriber: user });
  }

  async getSubscriptions(user: ObjectId) {
    return this.subscribers.readMany({ subscriber: user });
  }
  async getSubscribers(user: ObjectId) {
    return this.subscribers.readMany({ creator: user });
  }

  async makePaid(content: ObjectId) {
    await this.checkContentIsNotPaid(content);
    await this.paidContent.createOne({ content });
    return { msg: "Made content paid!" };
  }
  async checkContentIsNotPaid(content: ObjectId) {
    const isContentPaid = await this.paidContent.readOne({ content });
    if (isContentPaid !== null) {
      throw new NotAllowedError(`Error: Content ${content} is paid!`);
    } else {
      return { msg: "Content is not paid" };
    }
  }

  async makeFree(content: ObjectId) {
    await this.checkContentIsPaid(content);
    await this.paidContent.deleteOne({ content });
    return { msg: "Made content free!" };
  }
  async checkContentIsPaid(content: ObjectId) {
    const isContentPaid = await this.paidContent.readOne({ content });
    if (isContentPaid === null) {
      throw new NotAllowedError(`Error: Content ${content} is not paid!`);
    } else {
      return { msg: "Content is paid" };
    }
  }

  async subscribe(creator: ObjectId, subscriber: ObjectId) {
    if(subscriber.equals(creator)){
      throw new Error("One cant subscribe to themselves");
    }
    await this.checkNotSubscribed(creator, subscriber);
    await this.subscribers.createOne({ creator, subscriber });
    return { msg: "Succesfully subscribed" };
  }
  async checkNotSubscribed(creator: ObjectId, subscriber: ObjectId) {
    const isSubscribed = await this.subscribers.readOne({ creator, subscriber });
    if (isSubscribed !== null) {
      throw new SubscribedError(creator, subscriber);
    }
  }

  async unsubscribe(creator: ObjectId, subscriber: ObjectId) {
    if(subscriber.equals(creator)){
      throw new Error("One cant unsubscribe from themselves");
    }
    await this.checkSubscribed(creator, subscriber);
    await this.subscribers.deleteOne({ creator, subscriber });
    return { msg: "Succesfully unsubscribed" };
  }
  async checkSubscribed(creator: ObjectId, subscriber: ObjectId) {
    const isSubscribed = await this.subscribers.readOne({ creator, subscriber });
    if (isSubscribed === null) {
      throw new NotSubscribedError(creator, subscriber);
    }
  }
}

export class SubscribedError extends NotAllowedError {
  constructor(
    public readonly creator: ObjectId,
    public readonly subscriber: ObjectId,
  ) {
    super("Error: User {1} is subscribed to creator {0}!", creator, subscriber);
  }
}

export class NotSubscribedError extends NotAllowedError {
  constructor(
    public readonly creator: ObjectId,
    public readonly subscriber: ObjectId,
  ) {
    super("Error: User {1} is not subscribed to creator {0}!", creator, subscriber);
  }
}

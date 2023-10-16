import ArticleConcept from "./concepts/article";
import BioConcept from "./concepts/bio";
import CommentConcept from "./concepts/comment";
import SubscriptonConcept from "./concepts/subscription";
import UserConcept from "./concepts/user";
import ValidationConcept from "./concepts/validation";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Article = new ArticleConcept();
export const CommentToArticle = new CommentConcept("Article");
export const CommentToComment = new CommentConcept("Comment");
export const Bio = new BioConcept();
export const Subscripton = new SubscriptonConcept();
export const Validation = new ValidationConcept();

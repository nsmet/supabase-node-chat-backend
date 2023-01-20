export interface TypedRequestBody<T> extends Express.Request {
    body: T
  }
  
  export interface TypedRequestQuery<T> extends Express.Request {
    query: T
  }

  export interface User {
    id: string;
    username: string;
    created_at: string;
  }

  export interface Conversation {
    id: string;
    name: string;
    user_owner_id: string;
    created_at: string;
  }

  export interface Message {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
  }

  export interface UserConversation {
    user_id: string;
    conversation_id: string;
  }
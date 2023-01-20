export interface TypedRequestBody<T> extends Express.Request {
    body: T
  }
  
  export interface TypedRequestQuery<T> extends Express.Request {
    query: T
  }
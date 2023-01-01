export type FeedbackType = 'passed' | 'failed';

export interface ValidationFeedback {
  type: FeedbackType;
  msg: string;
}

export type Validator<T> = (this: { userInput: T }, ...args: any[]) => ValidationFeedback;

export enum Feedback {
  passed = 'passed',
  failed = 'failed',
}
export type FeedbackType = Feedback.passed | Feedback.failed;

export interface ValidationFeedback {
  type: FeedbackType;
  msg: string;
}

export type Validator<T> = (this: { userInput: T }, ...args: any[]) => ValidationFeedback;

export type Answer = 'true' | 'false' | 'NA';

export interface AnswerForm {
    answer: Answer;
    questionId: number;
    formUserId: number;
    id: number;
}
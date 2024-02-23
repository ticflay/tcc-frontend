export interface Question {
    id: number;
    name: string;
    identifier: string,
    description: string;
    categoryId: number;
    required: boolean;
}
export interface Form {
    id: number;
    userId: number;
    finished: boolean;
    createdAt: string;
    updatedAt: string;
    deleted: boolean;
    deletedAt: string | null;
}
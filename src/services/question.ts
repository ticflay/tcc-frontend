import { handleError } from "@/utils/error";
import api from "./config/api"
import { Question } from "@/models/question";

export const fetchQuestionsByCategory = async (categoryId: number) => {
    try {
        const response = await api.get<{questions: Question[]}>(`question/${categoryId}`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}

export const fetchQuestions = async () => {
    try {
        const response = await api.get(`question`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}
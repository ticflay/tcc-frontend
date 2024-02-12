import { handleError } from "@/utils/error";
import api from "./config/api"
import { Answer, AnswerForm } from "@/models/answer";

export const fetchAnswers = async (formId: number) => {
    try {
        const response = await api.get<{answers: AnswerForm[]}>(`answer/${formId}`);
        return response.data;
    }catch(err: any) {
        handleError(err)
    }
}

export const createAnswers = async (questionId: number, answer: Answer) => {
    try {
        const response = await api.post('answer', {questionId, answer});
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}
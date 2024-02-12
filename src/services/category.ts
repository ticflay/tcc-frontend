import { handleError } from "@/utils/error";
import api from "./config/api"

export const fetchCategories = async (criteriaId: number) => {
    try {
        const response = await api.get(`category/${criteriaId}`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}

export const fetchAllCategories = async () => {
    try {
        const response = await api.get(`category`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}

import { handleError } from "@/utils/error";
import api from "./config/api"

export const fetchCriteria = async () => {
    try {
        const response = await api.get('criteria');
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}
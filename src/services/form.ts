import { toast } from "react-toastify";
import api from "./config/api"
import { handleError } from "@/utils/error";
import { Form } from "@/models/form";
import { AnswerForm } from "@/models/answer";

export const getForm = async () => {
    try {
        const response = await api.get('form');
        return response.data;
    }catch(err: any) {
        if(err.response.data.error){
            toast(err.response.data.error, {type: 'error'})
        }   }
}
export const finishForm = async (formId: number) => {
    try {
        const response = await api.patch('form', {formId});
        return response.data;
    }catch(err: any) {
        if(err.response.data.error){
            toast(err.response.data.error, {type: 'error'})
        }   }
}

export const fetchAllForms = async () => {
    try {
        const response = await api.get(`form/all`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}

export const fetchAllDeletedForms = async () => {
    try {
        const response = await api.get(`form/alldeleted`);
        return response.data;
    }catch(err: any) {
        handleError(err);
    }
}

interface CreateFormResponse {
    form: Form,
    formAnswer?: AnswerForm[]
}

interface CreateFormPayload {
    blank: boolean;
}

export const createForm = async ({blank}: CreateFormPayload) => {
    try {
        const response = await api.post<CreateFormResponse>('form', {blank});
        return response.data;
    }catch(err: any) {
        handleError(err)
    }
}

export const deleteForm = async (formId: number) => {
    try {
        const response = await api.delete(`form/${formId}`);
        return response.data;
    }catch(err) {
        handleError(err);
    }
}

export const restoreForm = async (formId: number) => {
    try {
        const response = await api.patch(`form/restore`, {formId: formId});
        return response.data;
    }catch(err) {
        handleError(err);
    }
}
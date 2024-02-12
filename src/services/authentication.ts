import { User } from "@/models/user";
import { toast } from "react-toastify";
import api from "./config/api";

export interface SignUpPayload {
    email: string,
    name: string,
    telephone?: string,
    password: string,
}

interface ResponseRegisterSignin {
    currentUser: User;
    message?: string;
    token: string;
}

export interface SignInPayload {
    email: string;
    password: string;
}

export const signUp = async (values: SignUpPayload) => {
   try {
    const response = await api.post<ResponseRegisterSignin>('register', values);
    if(response.data.message) {
        toast(response.data.message, {type: 'success'})
    }
    return response.data;
   }catch(err: any) {
    if(err.response.data.error){
        toast(err.response.data.error, {type: 'error'})
    }
}
}

export const signIn = async (values: SignInPayload) => {
        try {
            const response = await api.post<ResponseRegisterSignin>('login', values);
            if(response.data.message) {
                toast(response.data.message, {type: 'success'})
            }
            return response.data;
        }catch(err: any) {
            if(err.response.data.error){
                toast(err.response.data.error, {type: 'error'})
            }
        }
}
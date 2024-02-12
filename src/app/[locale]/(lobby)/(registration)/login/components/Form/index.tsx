'use client';
import { SignInPayload, signIn } from "@/services/authentication";
import DefaultTextInput from "../../../components/input";
import FormFoot from "../FormFoot";
import LoginFoot from "../LoginFoot";
import LoginTitle from "../LoginTitle";
import { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/store/UserProvider";
import { toast } from "react-toastify";


export interface LoginFormProps {
    title: string;
    labelEmail: string;
    labelPassword: string;
    noAccountLabel: string;
    registerLabel: string;
    forgotPasswordLabel: string;
    rememberLabel: string;
    loginLabel: string;
    locale: string;

}



export default function Form({ labelEmail, labelPassword, locale, ...rest }: LoginFormProps) {
    let signInPayload: SignInPayload = { email: '', password: '' };
    const setCurrentUser = useUser()!((state) => state.setCurrentUser)
    const setToken = useUser()!((state) => state.setToken)
    const router = useRouter();
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (signInPayload) {
            const response = await signIn(signInPayload);
            if(response) {
                setCurrentUser(response.currentUser);
                setToken(response.token);
                toast(response.message, {type: 'success'});
                router.push('/home')
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        signInPayload = { ...signInPayload, [name]: value };
    };
    return <div className="flex flex-col justify-center py-14  px-7 gap-7 h-full">
        <LoginTitle {...rest} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <DefaultTextInput onChange={handleChange} type="email" id="email" label={labelEmail} name="email" />
            <DefaultTextInput
                onChange={handleChange}
                type="password"
                id="password"
                label={labelPassword}
                name="password" />
            <FormFoot {...rest}  />
        </form>
        <LoginFoot  {...rest} locale={locale} />
    </div>;
}

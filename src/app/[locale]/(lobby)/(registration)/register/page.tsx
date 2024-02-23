'use client'
import Link from "next/link";
import DefaultTextInput from "../components/input";
import { SignUpPayload, signUp } from "@/services/authentication";
import { ChangeEvent, FormEvent, useState } from "react";
import {useTranslations} from 'next-intl';
import { useUser } from "@/app/store/UserProvider";
import { toast } from "react-toastify";

interface RegisterProps {
  params: {
    locale: string;
  }
}


export default function Register({params: {locale}}: RegisterProps) {
  const t = useTranslations();
  const setCurrentUser = useUser()!((state) => state.setCurrentUser)
  const setToken = useUser()!((state) => state.setToken)
  const [signUpPayload, setSignUpPayload] = useState<SignUpPayload>({email: '', name: '', password: ''});
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUpPayload) {
      const response = await signUp(signUpPayload);
      if(response) {
        setCurrentUser(response.currentUser);
        setToken(response.token);
        toast(response.message, {type: 'success'})
    }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSignUpPayload(prev => {
      return {...prev, [name]: value}
    })
  };
  return (
    <div className="flex flex-col justify-center py-14  px-7 gap-7 h-full">
      <div className="items-center justify-center flex">
        <h1 className="text-baseTextColor text-center text-3xl font-bold">
          {t("Cadastro")}
        </h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <DefaultTextInput
          required
          onChange={handleChange}
          id="name"
          label={t("Nome")}
          name="name"
        />
        <DefaultTextInput
          required
          onChange={handleChange}
          type="email"
          id="email"
          label={t("E-mail")}
          name="email"
        />
        <DefaultTextInput
          onChange={handleChange}
          type="tel"
          id="telephone"
          label={t("Telefone")}
          name="telephone"
        />
        <DefaultTextInput
          required
          onChange={handleChange}
          type="password"
          id="password"
          label={t("Senha")}
          name="password"
        />
        <button type="submit" className="bg-focusedColor hover:opacity-80 h-10 flex items-center justify-center text-white font-bold w-full rounded">
          {t("Cadastre-se")}
        </button>
      </form>
      <div className="flex flex-row items-center justify-center gap-1">
        <span>{t("Já tem uma conta?")}</span>
        <Link href={`/login`} className="font-bold underline hover:opacity-80">
          {t("Entre aqui")}.
        </Link>
      </div>
    </div>
  );
}

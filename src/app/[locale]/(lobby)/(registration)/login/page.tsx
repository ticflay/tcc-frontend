/* eslint-disable @next/next/no-async-client-component */
import Form from "./components/Form";
import { useTranslations } from "next-intl";

interface LoginProps {
  params: {
    locale: string;
  }
}

export default  function Login({params: {locale}}: LoginProps) {
  
  const t = useTranslations();
  
  return (
      <Form forgotPasswordLabel={``}
        labelEmail={t("E-mail")}
        labelPassword={t("Senha")}
        locale={locale}
        loginLabel={t("Entrar")}
        noAccountLabel={`${t("Não tem uma conta")}?`}
        registerLabel={t("Cadastre-se")}
        rememberLabel={t("Lembrar")}
        title={t("Entrar")}
        />
  );
}

import {useTranslations} from 'next-intl';

export default function RegisterLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string}
}) {
  const t = useTranslations();

  return (
    <>
      <div className="w-1/2 hidden md:flex bg-focusedColor items-center p-16 flex-col gap-7 justify-center">
        <h1 className="text-secondary-honeydew text-3xl font-bold">{t("Cadastre-se")}</h1>
        <p className="text-secondary-honeyde text-base text-center text-secondary-honeydew">
          {t("Informe seu nome, email, telefone e senha para acessar o ESGrow")}! {t("Após cadastrar-se, você poderá fazer sua avaliação")}.
        </p>
      </div>
      <div className="w-full md:w-1/2">{children}</div>
    </>
  );
}

import {useTranslations} from 'next-intl';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();

  return (
    <div className='flex flex-col md:flex-row w-full'>
      <div className=" w-full md:w-1/2 bg-primary-charcoal md:flex items-center p-4 hidden md:p-16 flex-col gap-7 justify-center">
        <h1 className="text-secondary-honeydew  text-3xl font-bold text-center">{t("Entre na sua conta")}</h1>
        <p className="text-secondary-honeydew text-base text-center">
          Informe o seu e-mail e senha para acessar o ESGrow e fazer sua autoavaliação!
        </p>
      </div>
      <div className="w-full md:w-1/2">{children}</div>
    </div>
  );
}

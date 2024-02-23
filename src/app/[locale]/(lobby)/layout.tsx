import Link from "next/link";
import LinkItem from "./(registration)/components/linkItem";
import {useTranslations} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import LanguageSelector from "@/components/LanguageSelector";
import { Languages } from "@/navigation";


interface LobbyLayoutProps {
  params: {
    locale: Languages;
  };
  children: React.ReactNode
}

export default  function LobbyLayout({
  children,
  params: {locale}
}: LobbyLayoutProps
) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-6 h-full bg-secondary-honeydew">
      <nav className="flex px-5 flex-row bg-primary-charcoal justify-between items-center min-h-[70px]  h-[70px] border-b border-solid fixed left-0 right-0 top-0">
        <div>
         <LanguageSelector color={'white'} locale={locale} />
        </div>
        <div className="gap-12 flex flex-row">
        </div>
        <div className="flex flex-row  gap-10 items-center">
            <Link className="bg-transparent hover:opacity-80 text-primary-burnt_sienna text-sm font-bold" href={`/${locale}/login`}>{t("Entrar")}</Link>
            <Link className="bg-primary-burnt_sienna font-bold hover:opacity-80 text-secondary-berkeley_blue h-10 w-28 flex items-center justify-center rounded" href={`/${locale}/register`}>{t("Cadastre-se")}</Link>
        </div>
      </nav>
      <div className="w-full h-full  bg-secondary-honeydew mt-20">
      {children}
      </div>
    </div>
  );
}

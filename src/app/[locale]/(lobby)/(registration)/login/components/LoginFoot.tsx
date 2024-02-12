import Link from "next/link";

interface LoginFootProps {
    locale: string;
    noAccountLabel: string;
    registerLabel: string;

}

export default function LoginFoot({locale, noAccountLabel, registerLabel}: LoginFootProps) {
    return <div className="flex flex-row items-center justify-center gap-1">
    <span>{noAccountLabel}</span>
    <Link href={`/${locale}/register`} className="font-bold underline text-primary-burnt_sienna">
      {registerLabel}.
    </Link>
  </div>
}
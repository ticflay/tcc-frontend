import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Languages, locales } from "../../navigation";
import UserProvider, { UserState } from "../store/UserProvider";
import { useEffect, useState } from "react";
import FormProvider from "../store/FormProvider";

export const metadata: Metadata = {
  title: "ESG rating",
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Languages;
  };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  if (!locales.includes(locale)) notFound();
  const messages = useMessages();

  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <body className="flex flex-col h-screen bg-white">
          <UserProvider>
            <FormProvider>{children}</FormProvider>
          </UserProvider>
        </body>
        <ToastContainer />
      </NextIntlClientProvider>
    </html>
  );
}

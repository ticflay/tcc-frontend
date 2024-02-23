"use client"
import Link from "next/link";
import {useTranslations} from 'next-intl';
import {unstable_setRequestLocale} from 'next-intl/server';
import LanguageSelector from "@/components/LanguageSelector";
import { Languages } from "@/navigation";
import { useUser } from "@/app/store/UserProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Head from 'next/head'
import MenuBarMobile from "@/components/Sidebar/MobileMenuBar";
import Sidebar from "@/components/Sidebar";


interface AppLayoutProps {
  params: {
    locale: Languages;
  };
  children: React.ReactNode
}

export default  function AppLayout({
  children,
  params: {locale}
}: AppLayoutProps
) {
  const t = useTranslations();

  // Mobile sidebar visibility state
  const [showSidebar, setShowSidebar] = useState(false);
  const resetCurrentUser = useUser()!(state => state.resetCurrentUser);
    const logout = () => {
        resetCurrentUser();
    }

  return (
      <ProtectedRoute>
          <Head>
              <title>teste</title>
          </Head>
          <div className="min-h-screen bg-gray-100 max-w=[100vw] w-screen overflow-x-hidden">
              <div className="flex">
                  <MenuBarMobile setter={setShowSidebar} />
                  <Sidebar locale={locale} logout={logout} show={showSidebar} setter={setShowSidebar} />
                  <div className="flex flex-col flex-grow w-screen md:w-full min-h-[calc(100vh-60px)] bg-gray-100 ">
                      {children}
                  </div>
              </div>
          </div>
      </ProtectedRoute>
  )
}


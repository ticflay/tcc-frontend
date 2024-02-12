"use client"

import { useForm } from "@/app/store/FormProvider";
import { useUser } from "@/app/store/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const currentUser = useUser()!(state => state.currentUser);
    const loading = useUser()!(state => state.loading);
    const getAllForms = useForm()!(state => state.getAllForms);
    const getCriteria = useForm()!(state => state.getCriteria);

  useEffect(() => {
      getCriteria();
  }, [getCriteria]);
    const router = useRouter();
    useEffect(() => {
      getAllForms();
    }, [getAllForms])
    useEffect(() => {
        if(!currentUser && !loading) {
            router.replace('/login')
        }
      }, [currentUser, router, loading]);
      if(!currentUser && !loading) {
        return null;
      }
      return children;

}
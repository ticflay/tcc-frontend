"use client";

import { useForm } from "@/app/store/FormProvider";
import { fetchCriteria } from "@/services/criteria";
import { getForm } from "@/services/form";
import { useCallback, useEffect } from "react";
import { useTranslations } from "use-intl";

export default function HeaderForm() {
    const setCurrentForm = useForm()!(state => state.setCurrentForm);
    const setCriteria = useForm()!(state => state.setCriteria);
    const selectedCriteria = useForm()!(state => state.selectedCriteria);
    const setInstructions = useForm()!(state => state.setInstructions);
    const selectedCategory = useForm()!(state => state.selectedCategory);
    const t = useTranslations();

    const getCurrentForm =  useCallback(() => {
        getForm().then((response) => {
            if(response.form) {
                setCurrentForm(response.form);
            }
        });
    }, [setCurrentForm]);

    const getCriteria = useCallback(() => {
        fetchCriteria().then((response) => {
            setCriteria(response.criteria);
            if(response.criteria.length > 0 && !selectedCriteria) {
                setInstructions();
            }
        })
    }, [setCriteria, setInstructions]);


    useEffect(() => {
        getCurrentForm();
        getCriteria();
    }, [getCurrentForm, getCriteria]);



    return <div className="flex flex-row justify-center items-center">
        <span className="text-lg text-center font-bold">{t(selectedCriteria?.name)} {selectedCategory ? ` - ${t(selectedCategory.name)}` : ''}</span>
    </div>
}

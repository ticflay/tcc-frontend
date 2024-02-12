"use client";

import { useForm } from "@/app/store/FormProvider";
import { useUser } from "@/app/store/UserProvider";
import Report, { ReportToPrint } from "@/components/Report";
import { useRouter } from "next/navigation";
import ReactSelect, { SingleValue } from "react-select";
import dayjs from "dayjs";
import Button from "@/components/Button";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useReactToPrint } from "react-to-print";

export default function Home() {
  const resetCurrentUser = useUser()!((state) => state.resetCurrentUser);
  const router = useRouter();
  const allForms = useForm()!((state) => state.allForms);
  const loadingForms = useForm()!((state) => state.loadingForms);
  const t = useTranslations();
  const finishedForms = allForms?.filter((item) => item.finished);
  const formatDate = (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm");
  const selectedFormState = useForm()!((state) => state.selectedForm);
  const setSelectedFormState = useForm()!((state) => state.setSelectedForm);
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);
  const promiseResolveRef = useRef<any>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  const lastForm =
    finishedForms && finishedForms?.length > 0
      ? finishedForms[finishedForms.length - 1]
      : undefined;
  const [selectedForm, setSelectedForm] = useState(
    lastForm
      ? {
          label: formatDate(lastForm.updatedAt),
          value: lastForm.id,
        }
      : undefined
  );
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  useEffect(() => {
    if (selectedFormState) {
      setSelectedForm({
        label: dayjs(selectedFormState.updatedAt).format("DD/MM/YYYY HH:mm"),
        value: selectedFormState.id,
      });
      setSelectedFormState(undefined);
    }
  }, []);

  useEffect(() => {
    if (lastForm && !selectedForm) {
      setSelectedForm({
        label: formatDate(lastForm.updatedAt),
        value: lastForm.id,
      });
    }
  }, [lastForm, selectedForm]);

  const handleChangeForm = (
    e: SingleValue<{ label: string; value: number }>
  ) => {
    setSelectedForm(e as any);
  };

  return (
    <div className="flex flex-1 flex-col gap-2 mt-10 lg:mt-0">
      <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-3">
          <p className="whitespace-nowrap">{t("Selecione uma avaliação")}</p>
          <ReactSelect
            onChange={handleChangeForm}
            isMulti={false}
            options={allForms
              ?.filter((item) => item.finished)
              .map((item) => ({
                value: item.id,
                label: formatDate(item.updatedAt),
              }))}
            value={selectedForm}
            defaultValue={
              lastForm
                ? {
                    label: formatDate(lastForm.updatedAt),
                    value: lastForm.id,
                  }
                : undefined
            }
          />
        </div>
        {lastForm && (
          <div className="flex flex-row gap-4 items-center">
            <Button
              buttonStyle="secondary"
              onClick={handlePrint}
              text={t("Exportar relatório")}
            />
            <Button
              text={t("Responder avaliação")}
              onClick={() => router.push("/answer")}
            />
          </div>
        )}
      </div>
      <Report
        isPrinting={isPrinting}
        form={allForms?.find((item) => item.id === selectedForm?.value)}
      />
      <div
        style={{
          visibility: "hidden",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <div ref={printRef}>
          <ReportToPrint
            isPrinting={isPrinting}
            form={allForms?.find((item) => item.id === selectedForm?.value)}
          />
        </div>
      </div>
    </div>
  );
}

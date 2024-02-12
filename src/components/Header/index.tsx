"use client";
import { useForm } from "@/app/store/FormProvider";
import { useUser } from "@/app/store/UserProvider";
import { getNameInitiials } from "@/utils/initials";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const currentUser = useUser()!((state) => state.currentUser);
  const allForms = useForm()!((state) => state.allForms);
  const t = useTranslations();

  const finishedForms = allForms?.filter((item) => item.finished);
  const lastForm =
    finishedForms && finishedForms?.length > 0
      ? finishedForms[finishedForms.length - 1]
      : undefined;

  return (
    <div className=" flex flex-row justify-between w-full min-h-[2rem]]">
     {title &&  <span className="font-bold text-xl">{t(title)}</span>}
      <div className="flex flex-row gap-6 items-center">
        {lastForm && title !== "Relatório de desempenho" && (
          <span className="text-xs">
            {t("Última resposta")}:{" "}
            {DateTime.fromJSDate(new Date(lastForm.updatedAt)).toFormat(
              "dd/MM/yyyy"
            )}
          </span>
        )}
      </div>
    </div>
  );
}

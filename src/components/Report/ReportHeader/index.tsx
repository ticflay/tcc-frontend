"use client";

import { useForm } from "@/app/store/FormProvider";
import Button from "@/components/Button";
import { Form } from "@/models/form";
import { DateTime } from "luxon";

export interface ReportHeaderProps {
  form: Form;
}

export default function ReportHeader({ form }: ReportHeaderProps) {
  return (
    <div className="w-full items-center justify-between flex flex-row gap-5">
      <span className="font-bold">Relatório de desempenho</span>
      <div className="flex flex-row gap-5 items-center">
        <span>
          Última resposta:{" "}
          {DateTime.fromJSDate(new Date(form.updatedAt)).toFormat("dd/MM/yyyy")}
        </span>
        <Button text="Responder avaliação" />
      </div>
    </div>
  );
}

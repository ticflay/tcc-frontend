"use client";
import { Form } from "@/models/form";
import ReportHeader from "./ReportHeader";
import Button from "../Button";
import desempenhoImage from "../../assets/desempenho.png";
import Image from "next/image";
import GeneralChart from "./GeneralChart";
import CategoriesChart from "./CategoriesChart";
import { useEffect, useState } from "react";
import EnvironmentChart from "./DetailedChart";
import SocialChart from "./SocialChart";
import GovernanceChart from "./GovernanceChart";
import { AnswerForm } from "@/models/answer";
import { fetchAnswers } from "@/services/answer";
import { useRouter } from "next/navigation";
import GeneralChartToPrint from "./Print/GeneralChartToPrint";
import DetaildChartToPrint from "./Print/DetailedChartToPrint";

export interface ReportProps {
  form?: Form;
  isPrinting: boolean;
}

export type MenuType = "Geral" | "Ambiental" | "Social" | "Governança";

export default function Report({ form, isPrinting }: ReportProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuType>("Geral");
  const [formAnswers, setFormAnswers] = useState<AnswerForm[]>();
  const router = useRouter();

  useEffect(() => {
    if (form) {
      fetchAnswers(form.id).then((result) => {
        setFormAnswers(result?.answers);
      });
    }
  }, [form]);

  return (
    <div className="flex flex-col gap-6 flex-1">
      {form ? (
        <>
          <div className="m-3">
            {selectedMenu === "Geral" && (
              <GeneralChart form={form} setSelectedMenu={setSelectedMenu} />
            )}
            {selectedMenu !== "Geral" && (
              <EnvironmentChart
                selectedMenu={selectedMenu}
                formAnswers={formAnswers}
                form={form}
                setSelectedMenu={setSelectedMenu}
              />
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5 items-center justify-center flex-1">
          <Image src={desempenhoImage} alt="desempenho" />
          <span className="font-bold text-sm">
            Ops, parece que você ainda não respondeu a avaliação!
          </span>
          <Button
            onClick={() => router.push("/answer")}
            text="Iniciar avaliação"
          />
        </div>
      )}
    </div>
  );
}

export function ReportToPrint({ form, isPrinting }: ReportProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuType>("Geral");
  const [formAnswers, setFormAnswers] = useState<AnswerForm[]>();
  const router = useRouter();

  useEffect(() => {
    if (form) {
      fetchAnswers(form.id).then((result) => {
        setFormAnswers(result?.answers);
      });
    }
  }, [form]);

  return form ? (
    <div className="m-3 flex flex-col gap-6">
      <span className="font-bold text-lg text-center">Relatório de Desempenho</span>
      {selectedMenu === "Geral" && (
        <GeneralChartToPrint form={form} setSelectedMenu={setSelectedMenu} />
      )}
        <DetaildChartToPrint
          selectedMenu={'Ambiental'}
          formAnswers={formAnswers}
          form={form}
          setSelectedMenu={setSelectedMenu}
        />
         <DetaildChartToPrint
          selectedMenu={'Social'}
          formAnswers={formAnswers}
          form={form}
          setSelectedMenu={setSelectedMenu}
        />
         <DetaildChartToPrint
          selectedMenu={'Governança'}
          formAnswers={formAnswers}
          form={form}
          setSelectedMenu={setSelectedMenu}
        />
    </div>
  ) : null;
}

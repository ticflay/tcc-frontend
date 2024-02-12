"use client;";
import { useForm } from "@/app/store/FormProvider";
import { Category } from "@/models/category";
import { Criteria } from "@/models/criteria";
import { Form } from "@/models/form";
import { Question } from "@/models/question";
import { fetchAnswers } from "@/services/answer";
import { fetchCategories } from "@/services/category";
import { fetchQuestionsByCategory } from "@/services/question";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { useCallback, useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
export interface CategoriesChartProps {
  form: Form;
}

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface GeneralData extends Criteria {
  nota: number;
  positive: { category: Category; nota: number; questions: Question[] }[];
  negative: { category: Category; nota: number; questions: Question[] }[];
}

export default function CategoriesChart({ form }: CategoriesChartProps) {
  const [data, setData] = useState<{criteria: Criteria, data: ChartData<"radar">}[]>([]);
  const criteria = useForm()!((state) => state.criteria);

  const options: ChartOptions<"radar"> = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const getNotasByCategory = useCallback(
    async (category: Category) => {
      const response = await fetchQuestionsByCategory(category.id);
      const answers = await fetchAnswers(form.id);
      const percent = answers
        ? answers?.answers.filter(
            (item) =>
              item.answer === "true" &&
              response?.questions
                .map((item) => item.id)
                .includes(item.questionId)
          ).length /
          answers?.answers.filter(
            (item) =>
              item.answer !== "NA" &&
              response?.questions
                .map((item) => item.id)
                .includes(item.questionId)
          ).length
        : 0;
      const nota = (percent * 10) / 2;
      return { questions: response?.questions ?? [], nota, category };
    },
    [form.id]
  );


  const getDataByCriteria = useCallback(async (criteria: Criteria) => {
    const categories: Category[] = (await fetchCategories(criteria.id)).categories;
    const labels = categories.map((item: Category) => item.name);
    const dataDataset = await Promise.all(categories.map(async item => {
        const nota = await getNotasByCategory(item);
        return nota.nota;
    }))
    const data: ChartData<"radar"> = {
        labels: labels,
        datasets: [
          {
            label: "Notas",
            data: dataDataset,
            backgroundColor: "#2a9d9085",
            borderColor: "#2A9D8F",
            borderWidth: 3,
          },
        ],
      };
      return data;
  }, [getNotasByCategory])


  const getData = useCallback(async () => {
    const labels = criteria?.map((item) => item.name);
    const finalData = criteria ? await Promise.all(criteria.map(async item => {
        return {
            criteria: item,
            data: await getDataByCriteria(item)
        }
    })) : []
    setData(finalData);
  }, [criteria, getDataByCriteria]);

  useEffect(() => {
    getData();
  }, [getData, form, criteria]);

  return (
    <div className="flex flex-col gap-7">
      <span className="font-bold text-base">Desempenho por critério</span>
     <div className="grid grid-cols-3 gap-2">
     {data.map(item => {
        return ( <div key={item.criteria.id} className="flex flex-col gap-10 items-center">
        <span className="font-bold text-base">{item.criteria.name}</span>
          <div className="w-96">
            <Radar data={item.data} options={options} />
          </div>
          <div className="flex flex-col gap-3">          
          </div>
        </div>)
     })}
     </div>
    </div>
  );
}

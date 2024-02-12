"use client;";
import { useForm } from "@/app/store/FormProvider";
import Button from "@/components/Button";
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
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Radar, Bar} from "react-chartjs-2";
import { CircularProgressbar } from "react-circular-progressbar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FcPositiveDynamic, FcNegativeDynamic } from "react-icons/fc";
import { ThreeDots } from "react-loader-spinner";
import { MenuType } from "..";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { calculateGrade } from "@/utils/grade";

export interface GeneralChartProps {
  form: Form;
  setSelectedMenu: Dispatch<SetStateAction<MenuType>>;
}

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface GeneralData extends Criteria {
  nota: number;
  positive: { category: Category; nota: number; questions: Question[] }[];
  negative: { category: Category; nota: number; questions: Question[] }[];
}

export default function GeneralChart({
  form,
  setSelectedMenu,
}: GeneralChartProps) {
  const [generalData, setGeneralData] = useState<GeneralData[]>([]);
  const [data, setData] = useState<ChartData<"radar">>({
    labels: [],
    datasets: [],
  });
  const [barData, setBarData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });
  const [selectedData, setSelectedData] = useState(generalData?.[0]);
  const criteria = useForm()!((state) => state.criteria);
  const allForms = useForm()!((state) => state.allForms);
  const categories = useForm()!((state) => state.categories);
  const questions = useForm()!((state) => state.questions);

  const t = useTranslations();
  const handleClickNext = () => {
    setSelectedData((prev) => {
      if (prev) {
        if (
          generalData.length > 1 &&
          generalData[generalData.length - 1].id === prev.id
        ) {
          return generalData[0];
        } else {
          const findIndex = generalData.findIndex(
            (item) => item.id === prev.id
          );
          return generalData[findIndex + 1];
        }
      }
      return prev;
    });
  };

  const getBarChartData = useCallback(async () => {
    const labels = allForms?.filter(a => a.finished).map(item => dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")) ?? [];
    const values = allForms ? await Promise.all(allForms?.filter(a => a.finished).map(async form => {
      const ans = await fetchAnswers(form.id);
      const nota = categories ? categories?.map(c => calculateGrade(c, questions, ans?.answers)).reduce((a, b) => a + b)/categories.length : 0;
      return nota;
    })) : [];
    const data: ChartData<"bar"> = {
      labels: labels,
      datasets: [
        {
          label: "Nota",
          data: values,
          backgroundColor: "#2a9d9085",
          borderColor: "#2A9D8F",
        }
      ]
    }
    setBarData(data);
  }, [allForms, categories, questions])

  useEffect(() => {
    getBarChartData();
  }, [getBarChartData]);



  const handleClickBack = () => {
    setSelectedData((prev) => {
      if (prev) {
        if (generalData.length >= 1 && generalData[0].id === prev.id) {
          return generalData[generalData.length - 1];
        } else {
          const findIndex = generalData.findIndex(
            (item) => item.id === prev.id
          );
          return generalData[findIndex - 1];
        }
      }
      return prev;
    });
  };

  const options: ChartOptions<"radar"> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            weight: "bold",
          },
        },
        pointLabels: {
          font: {
            size: 14,
            weight: "bold",
          },
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

  const getNotaByCriteria = useCallback(
    async (criteria: Criteria) => {
      const categories: { categories: Category[] } = await fetchCategories(
        criteria.id
      );
      const questions = await Promise.all(
        categories.categories.map(async (item: Category) => {
          const response = await getNotasByCategory(item);
          return response ?? {};
        })
      );
      const questionsFlat = questions.flatMap((item) => item.questions);
      const answers = await fetchAnswers(form.id);
      const percent = answers
        ? answers?.answers.filter(
            (item) =>
              item.answer === "true" &&
              questionsFlat.map((item) => item.id).includes(item.questionId)
          ).length /
          answers?.answers.filter(
            (item) =>
              item.answer !== "NA" &&
              questionsFlat.map((item) => item.id).includes(item.questionId)
          ).length
        : 0;
      const sortedQuestions = questions.toSorted((a, b) => b.nota - a.nota);
      console.log("sortedQuestions", sortedQuestions);
      return {
        nota: (percent * 10) / 2,
        positive: sortedQuestions.slice(0, 2),
        negative: sortedQuestions.slice(-2),
      };
    },
    [form.id, getNotasByCategory]
  );

  const getData = useCallback(async () => {
    const labels = criteria?.map((item) => t(item.name));
    const dataDataset = criteria
      ? await Promise.all(
          criteria?.map(async (item) => (await getNotaByCriteria(item)).nota)
        )
      : [];
    const criteriaGrade = criteria
      ? await Promise.all(
          criteria.map(async (item) => {
            const grade = await getNotaByCriteria(item);
            return {
              ...item,
              nota: grade.nota,
              positive: grade.positive,
              negative: grade.negative,
            };
          })
        )
      : [];
    setGeneralData(criteriaGrade);
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
    setData(data);
  }, [criteria, getNotaByCriteria]);

  useEffect(() => {
    getData();
  }, [getData, form, criteria]);

  useEffect(() => {
    if (!selectedData && generalData.length > 0) {
      setSelectedData(generalData[0]);
    }
  }, [generalData]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-8 print:flex-col print:items-center">
      {data.labels && data.labels.length > 0 ? (
        <>
         <div className="flex flex-col gap-4">
         <div className="w-[calc(100vw-4rem)] lg:w-[600px] border-gray-200 bg-white border border-solid p-4 rounded-lg flex flex-col gap-12  items-center">
            <span className="font-bold text-base">{t("Desempenho geral")}</span>
            <Radar data={data} options={options} />
          </div>
          <div className="w-[calc(100vw-4rem)] lg:w-[600px] border-gray-200 bg-white border border-solid p-4 rounded-lg flex flex-col gap-12  items-center">
            <span className="font-bold text-base">{t("Evolução geral")}</span>
            <Bar data={barData} />
          </div>
         </div>
          <div className="flex flex-col gap-6 w-[calc(100vw-4rem)] flex-1">
            {generalData.map((data) => {
              return (
                <div
                  key={data.id}
                  className="flex border w-full flex-1  lg:w-auto bg-white border-solid border-gray-200 rounded-lg p-4 items-center flex-col lg:flex-row gap-4"
                >
                  <div className="flex flex-col w-full md:flex-row gap-6 flex-1">
                    <div
                      className="lg:w-96 lg:min-w-[384px]  gap-6 relative flex flex-col justify-between"
                      key={data.id}
                    >
                      <div className="flex flex-row justify-center items-center w-full">
                        <span className="font-medium text-xl text-center">
                          {t(data.name)}
                        </span>
                      </div>
                      <div className="relative h-32 w-[calc(100vw-7rem)] max-w-[360px] lg:w-auto overflow-hidden">
                        <CircularProgressbar
                          value={(data.nota / 5) * 100}
                          circleRatio={0.5}
                          strokeWidth={14}
                          styles={{
                            root: {
                              transform: "rotate(0.75turn)",
                            },

                            path: { stroke: "#2a9d8f", strokeLinecap: "butt" },
                            trail: { stroke: "#C4C4C4", strokeLinecap: "butt" },
                            // trailColor: "grey",
                            // backgroundColor: "red"
                          }}
                        />
                        <span
                          className={`absolute bottom-0 text-4xl font-semibold left-1/3 lg:left-[140px]`}
                        >
                          {data.nota.toFixed(2).replace(".", ",")}/5
                          {/* {((data.nota / 5) * 100).toFixed(0)}% */}
                        </span>
                      </div>
                      {/* <div className="flex flex-row w-full items-center justify-center">
                    <span className="font-semibold text-4xl">
                      {data.nota.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="font-light text-4xl">/5</span>
                  </div> */}
                    </div>
                    <div className="flex flex-col gap-6 flex-1">
                      <div className="flex flex-col border  lg:w-auto bg-gray-100 border-solid border-gray-200 rounded-lg p-4 flex-1">
                        <div className="font flex    items-center flex-row gap-2 font-bold text-lg">
                          {" "}
                          <FcPositiveDynamic />
                          {t("Pontos positivos")}
                        </div>
                        <p className="text-base">
                          {data.positive
                            .map((item) => t(item.category.name))
                            .join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col border   lg:w-auto bg-gray-100 border-solid border-gray-200 rounded-lg p-4 flex-1">
                        <div className="font flex flex-row items-center gap-2 font-bold text-lg">
                          <FcNegativeDynamic /> {t("Pontos de melhoria")}
                        </div>
                        <p className="text-base">
                          {data.negative
                            .map((item) => {
                              const tName = t(item.category.name);
                              console.log("tName", tName);
                              return tName;
                            })
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mx-5">
                    <button
                      title="Ver detalhes"
                      className="w-9 h-9 hover:border hover:border-solid hover:border-black hover:opacity-80 font-bold rounded-full flex items-center justify-center bg-primary-persian_green text-white"
                      onClick={() => setSelectedMenu(data.name as MenuType)}
                    >
                      {" "}
                      <FaChevronRight color="white" />{" "}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center h-full">
          {" "}
          <ThreeDots />{" "}
        </div>
      )}
    </div>
  );
}

import { useForm } from "@/app/store/FormProvider";
import Button from "@/components/Button";
import { Category } from "@/models/category";
import { Criteria } from "@/models/criteria";
import { Form } from "@/models/form";
import { fetchAnswers } from "@/services/answer";
import { fetchCategories } from "@/services/category";
import { fetchQuestions, fetchQuestionsByCategory } from "@/services/question";
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
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Radar } from "react-chartjs-2";
import { MenuType } from "..";
import { AnswerForm } from "@/models/answer";
import { useTranslations } from "next-intl";
import { calculateGrade } from "@/utils/grade";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface EnvironmentChartProps {
  form: Form;
  setSelectedMenu: Dispatch<SetStateAction<MenuType>>;
  formAnswers?: AnswerForm[];
  selectedMenu:MenuType
}

export default function DetaildChartToPrint({
  form,
  setSelectedMenu,
  formAnswers,
  selectedMenu
}: EnvironmentChartProps) {
  const [data, setData] = useState<ChartData<"radar">>();
  const criteria = useForm()!((state) => state.criteria);
  const questions = useForm()!((state) => state.questions);
  const setQuestions = useForm()!((state) => state.setQuestions);

  const getCategories = useForm()!((state) => state.getCategories);
  const categories = useForm()!((state) => state.categories);

  const criterion = criteria?.find((c) => c.name === selectedMenu);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(
    categories
      ? categories.filter((c) => c.criteriaId === criterion?.id)[0]
      : undefined
  );

  const router = useRouter();
  const t = useTranslations();
  const getQuestions = useCallback(() => {
    fetchQuestions().then((response) => {
      setQuestions(response.questions);
    });
  }, [setQuestions]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions, form]);
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

  const getDataByCriteria = useCallback(
    async (criteria: Criteria) => {
      const categories: Category[] = (await fetchCategories(criteria.id))
        .categories;
      const labels = categories.map((item: Category) => t(item.name));
      const dataDataset = await Promise.all(
        categories.map(async (item) => {
          const nota = await getNotasByCategory(item);
          return nota.nota;
        })
      );
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
    },
    [getNotasByCategory]
  );


  const getData = useCallback(async () => {
    const enviromentalCriteria = criteria?.find(
      (item) => item.name === selectedMenu
    );
    const data = enviromentalCriteria
      ? await getDataByCriteria(enviromentalCriteria)
      : undefined;
    setData(data);
  }, [setData, criteria, getDataByCriteria]);

  useEffect(() => {
    getData();
  }, [getData, form, criteria]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  

  useEffect(() => {
    if (
      categories &&
      criteria &&
      categories.length > 0 &&
      formAnswers &&
      questions
    ) {
      const criterion = criteria.find((c) => c.name === selectedMenu);
      if (criterion) {
        setSelectedCategory(
          categories
            ?.filter((item) => {
              const criteriion = criteria?.find((c) => c.name === selectedMenu);
              return item.criteriaId === criteriion?.id;
            })
            .toSorted((a, b) => {
              const notaA = calculateGrade(a, questions, formAnswers);
              const notaB = calculateGrade(b, questions, formAnswers);
              return notaA > notaB ? 1 : -1;
            })[0]
        );
      }
    }
  }, [categories, criteria, questions, formAnswers, selectedMenu]);

  return (
    <div className="flex flex-col gap-8 overflow-hidden break-before-page">
      <div className="flex flex-col gap-7 ">
        <div className="flex flex-row gap-4 items-center w-full">
          <span className="text-lg font-bold text-center w-full">{t(selectedMenu)}</span>
        </div>
        <div className="flex flex-col gap-10 items-center">
          <div className="w-[650px] bg-white items-center flex flex-col gap-2 border border-solid border-gray-200 p-4 rounded-lg ">
            <span className="font-bold  text-base">
              {t("Desempenho por categoria")}
            </span>
            {data && <Radar data={data} options={options} />}
          </div>
          <div className="flex flex-col gap-3"></div>
        </div>
      </div>
      <div className="w-full flex  max-w-full flex-col border border-solid flex-1  rounded-md">
        <div className="flex flex-col  gap-5 bg-white ">
          {categories
            ?.filter((item) => {
              const criteriion = criteria?.find((c) => c.name === selectedMenu);

              return item.criteriaId === criteriion?.id;
            })
            .toSorted((a, b) => {
              const notaA = calculateGrade(a, questions, formAnswers);
              const notaB = calculateGrade(b, questions, formAnswers) ;
              return notaA > notaB ? 1 : -1;
            })
            .map((category) => {
              return (
                <div key={category.id} className="border   border-solid border-gray-300 rounded-md flex flex-col gap-5">
                <span className="font-bold text-center">{t(category.name)}</span>
                <div className="m-3 flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <span className="font font-bold">{t("Recomendações de melhorias")}</span>
              <span>
                {t("Nota da categoria")}:{" "}
                {(calculateGrade(category, questions, formAnswers))
                  .toFixed(2)
                  .replace(".", ",")}
                /5
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <span>
                <b>{t("Sobre a categoria")}:</b> {t(`${category.identifier}-description`)}
              </span>
              <span className="font-bold">
                {t("Algumas recomendações de ações para melhoria baseadas nas suas respostas")}:
              </span>
              {questions &&
              questions?.filter(
                (q) =>
                  q.categoryId === category.id &&
                  formAnswers?.find((ans) => ans.questionId === q.id)
                    ?.answer === "false"
              ).length > 0 ? (
                questions
                  ?.filter(
                    (q) =>
                      q.categoryId === category.id &&
                      formAnswers?.find((ans) => ans.questionId === q.id)
                        ?.answer === "false"
                  )
                  .map((q) => {
                    return (
                      <div className="bg-gray-200 p-6 rounded-md " key={q.id}>
                        <span className="font-semibold">{t(`${q.identifier}-question`)}{" "}</span>
                        <span >{t(`${q.identifier}-direction`)}</span>
                      </div>
                    );
                  })
              ) : (
                <div>
                  {t("Não há recomendações de melhoria para essa categoria")}!
                </div>
              )}
  
<span className="font-bold">
                {t("Perguntas que você respondeu sim")}:
              </span>
              {questions &&
              questions?.filter(
                (q) =>
                  q.categoryId === category.id &&
                  formAnswers?.find((ans) => ans.questionId === q.id)
                    ?.answer === "true"
              ).length > 0 ? (
                questions
                  ?.filter(
                    (q) =>
                      q.categoryId === category.id &&
                      formAnswers?.find((ans) => ans.questionId === q.id)
                        ?.answer === "true"
                  )
                  .map((q) => {
                    return (
                      <div className="bg-green-100 p-6 rounded-md " key={q.id}>
                        <span >{t(`${q.identifier}-question`)}</span>
                      </div>
                    );
                  })
              ) : (
                <div>
                  {t("Não há perguntas para serem mostradas")}!
                </div>
              )}
            </div>
          </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

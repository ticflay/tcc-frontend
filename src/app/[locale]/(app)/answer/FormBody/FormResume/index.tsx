import { useForm } from "@/app/store/FormProvider";
import { Criteria } from "@/models/criteria";
import { calculateGrade } from "@/utils/grade";
import { useTranslations } from "next-intl";

export default function FormResume() {
  const criteria = useForm()!((state) => state.criteria);
  const questions = useForm()!((state) => state.questions);
  const formAnswers = useForm()!((state) => state.formAnswers);
  const categories = useForm()!((state) => state.categories);
  const t = useTranslations();

  const calculateGeneralGrade = () => {
    const sum = categories ? (categories?.map(item => calculateGrade(item, questions, formAnswers)).reduce((a, b) => a + b)/categories?.length) : 0;
    return sum.toFixed(2).replace('.', ',');
  }
  const calculateCriterionGrade= (criterion: Criteria) => {
    const filteredCategories = categories?.filter(item => item.criteriaId === criterion.id);
    const sum = filteredCategories ? (filteredCategories?.filter(item => item.criteriaId === criterion.id).map(item => calculateGrade(item, questions, formAnswers)).reduce((a, b) => a + b)/filteredCategories?.length) : 0;
    return sum.toFixed(2).replace('.', ',');
  }

  return (
<div className="flex flex-col gap-5 p-4">
  <p>Aqui está o resummo da sua avaliação. Após clicar em &quot;Enviar&quot;, a avaliação não poderá mais ser editada!</p>
<span>Nota geral da avaliação: <b>{calculateGeneralGrade()} </b></span>
<span><b>Nota por critério e categoria:</b></span>

    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-16">
      {criteria?.map((criterion) => {
        return (
          <div key={criterion.id}>
            <div className="flex flex-row justify-between">
            <span className="text-center font-semibold">{t(criterion.name)}</span>
            <span>Nota: <b>{calculateCriterionGrade(criterion)}</b> </span>
            </div>
            
            <table className="border border-solid border-black w-full">
              <thead>
                <tr className="border border-solid border-black ">
                  <th className="border border-solid border-black p-3">{t("Categoria")}</th>
                  <th className="border border-solid border-black p-3">{t("Resultado")}</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((category) => {
                  if (category.criteriaId === criterion.id) {
                    const categoryAnswers = formAnswers?.filter((answer) => {
                      const question = questions?.find(
                        (q) => q.id === answer.questionId
                      );
                      return (
                        question?.categoryId === category.id &&
                        answer.answer !== "NA"
                      );
                    });
                    const categoryAnswersTrue = formAnswers?.filter(
                      (answer) => {
                        const question = questions?.find(
                          (q) => q.id === answer.questionId
                        );
                        return (
                          question?.categoryId === category.id &&
                          answer.answer === "true"
                        );
                      }
                    );
                    return (
                      <>
                        <tr
                          className="border border-solid border-black"
                          key={category.id}
                        >
                          <td className="border border-solid border-black p-3">
                            {t(category.name)}
                          </td>
                          <td className={`border border-solid border-black p-3 text-center ${calculateGrade(category, questions, formAnswers) < 3 && 'bg-red-200'}`}>
                                {calculateGrade(category, questions, formAnswers).toFixed(2).replace('.', ',')}
                            </td>
                        </tr>
                      
                      </>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
</div>
  );
}

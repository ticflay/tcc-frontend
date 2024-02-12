import { Answer, AnswerForm } from "@/models/answer";
import { Question } from "@/models/question";
import { useTranslations } from "next-intl";
import { FaCheck, FaTrash, FaTrashRestore } from "react-icons/fa";

interface FormItemProps {
  submitAnswer: (questionId: number, answer: Answer) => void;
  question: Question;
  answer?: AnswerForm;
}

export default function FormItem({
  question,
  submitAnswer,
  answer,
}: FormItemProps) {
  const t = useTranslations();
  return (
    <form
      className={`w-full rounded-md ${
        answer?.answer === "true"
          ? "bg-green-200"
          : "bg-transparent  border border-solid border-primary-persian_green hover:bg-gray-200"
      } min-h-[64px] flex flex-row items-center hover:opacity-80 hover:border-green-700 hover:border hover:border-solid`}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <fieldset
        onClick={(e) => {
          if (answer) {
            submitAnswer(
              question.id,
              answer.answer === "true" ? "false" : "true"
            );
          } else {
            submitAnswer(question.id, "true");
          }
        }}
        className="flex flex-row gap-4 text-sm w-full relative p-4 cursor-pointer"
      >
        {answer?.answer !== "NA" && (
          <>
            <input
              id={question.name}
              name={question.name}
              checked={answer?.answer === "true"}
              type="checkbox"
              className="w-6 h-6 opacity-0 cursor-pointer"
              onChange={(e) => {
                const checked = e.target.checked;
                submitAnswer(question.id, checked ? "true" : "false");
              }}
            />
            <button
              className={`absolute flex items-center justify-center top-[18px] left-4 w-6 h-6 ${
                answer?.answer !== "true"
                  ? "bg-transparent border border-solid border-gray-500"
                  : "bg-white "
              } rounded-md`}
            >
              {answer?.answer === "true" && <FaCheck color={"#bbf7d0"} />}
            </button>
          </>
        )}
        <label
          htmlFor={question.name}
          className={`text-base cursor-pointer w-full ${
            answer?.answer === "NA"
              ? "font-normal text-gray-500"
              : "font-semibold"
          }`}
        >
          {t(question.name)}
        </label>
      </fieldset>
      {!question.required && (
        <button
          className="font-semibold flex flex-row gap-2 items-center mr-4"
          onClick={() =>
            submitAnswer(question.id, answer?.answer === "NA" ? "false" : "NA")
          }
        >
          {answer?.answer === "NA" ? (
            <FaTrashRestore size={16} color='#2a9d8f' title="Restaurar" />
          ) : (
            <FaTrash title="Não se aplica" className={"hover:opacity-80"} size={16} color={"red"} />
          )}
        </button>
      )}
    </form>
  );
}

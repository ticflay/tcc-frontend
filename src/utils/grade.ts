import { AnswerForm } from "@/models/answer";
import { Category } from "@/models/category";
import { Question } from "@/models/question";

export const calculateGrade = (category: Category, questions?: Question[], formAnswers?: AnswerForm[]) => {
    const questionsCategory = questions?.filter(
      (q) => q.categoryId === category.id
    );
    const answers = formAnswers?.filter(
      (ans) =>
        ans.answer !== "NA" &&
        questionsCategory?.map((item) => item.id).includes(ans.questionId)
    );
    const answersPositive = formAnswers?.filter(
      (ans) =>
        ans.answer === "true" &&
        questionsCategory?.map((item) => item.id).includes(ans.questionId)
    );
    const nota =
      answersPositive && answers ? answersPositive.length / answers.length : 0;
    return ((nota*10)/2);
  };
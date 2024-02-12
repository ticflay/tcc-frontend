"use client"
import { useForm } from "@/app/store/FormProvider";
import { Answer } from "@/models/answer";
import { Category } from "@/models/category";
import { Criteria } from "@/models/criteria";
import { createAnswers } from "@/services/answer";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import FormNavButton from "../../FormNavButton";
import { useTranslations } from "next-intl";

interface FormNavCriteriorProps {
    onClick: () => void;
    active: boolean;
    finished: boolean;
    expanded: boolean;
    categories?: Category[];
    index: number;
    criterion: Criteria;
    isLast: boolean;
    finishedCategories?: number[];
    setFinishedCategories?: Dispatch<SetStateAction<number[]>>
}

export default function FormNavCriterion({active, index, expanded, isLast, criterion, finished, onClick, categories, finishedCategories = [],setFinishedCategories = () => {} }: FormNavCriteriorProps) {

    const formAnswers = useForm()!(state => state.formAnswers);
    const setFormAnswers = useForm()!(state => state.setFormAnswers);
    const questions = useForm()!(state => state.questions);
    const t = useTranslations();
   const currentForm = useForm()!(state => state.currentForm);
    const verifyFinishedCategories = useCallback(() => {
      if (categories && questions && formAnswers) {
        categories?.forEach((category) => {
          const categoryQuestions = questions?.filter(
            (question) => question.categoryId === category.id
          );
          const questionWithNoAnswers = categoryQuestions?.filter(
            (question) =>
              !formAnswers?.find((item) => item.questionId === question.id)
          );
          if (
            questionWithNoAnswers?.length === 0 &&
            !finishedCategories.includes(category.id)
          ) {
            setFinishedCategories((prev) => [...prev, category.id]);
          }else if(!finishedCategories.includes(category.id)) {
            setFinishedCategories(prev => prev.filter(item => item !== category.id))
          }
        });
      }
    }, [categories, formAnswers, questions, finishedCategories, setFinishedCategories]);

    useEffect(() => {
      if(formAnswers && formAnswers.length > 0) {

      verifyFinishedCategories();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      formAnswers,
      categories,
      questions
    ]);

    const selectedCategory = useForm()!(state => state.selectedCategory);
    const setSelectedCriteria = useForm()!(state => state.setSelectedCriteria);
    const setSelectedCategory = useForm()!(state => state.setSelectedCategory);
    const categoryQuestions = useForm()!(state => state.categoryQuestions);
    const submitAnswer = (questionId: number, answer: Answer) => {
        createAnswers(questionId, answer).then((response) => {
          if (formAnswers) {
            const index = formAnswers.findIndex(
              (item) => item.questionId === questionId
            );
            if (index >= 0) {
              setFormAnswers(
                formAnswers?.map((item) => {
                  if (item.questionId === questionId) {
                    return response.answer;
                  }
                  return item;
                })
              );
            } else if (formAnswers) {
              setFormAnswers([...formAnswers, response.answer]);
            } else {
              setFormAnswers([response.answer]);
            }
          }
        });
      };
    return  <div className="flex flex-col gap-1 relative pb-2">
    <button
      onClick={onClick}
      className={`flex z-10 flex-row gap-3 items-center hover:opacity-80`}
    >
      <div
        className={`w-5 h-5 hover:opacity-80 flex items-center justify-center border-solid rounded-full ${
          active ||
          finished
            ? "border-primary-burnt_sienna bg-primary-burnt_sienna text-secondary-honeydew font-bold border-2"
            : "border border-black font-semibold bg-secondary-honeydew"
        }`}
      >
        {finished &&
        !active ? (
          <FaCheck color="white" size={10} />
        ) : (
          index + 2
        )}
      </div>
      <span
        className={`text-base hover:opacity-80 ${
          active
            ? "font-bold text-primary-burnt_sienna"
            : "font-semibold"
        }`}
      >
        {t(criterion.name)}
      </span>
    </button>

    <div
      className={`absolute ${
        isLast ? "h-[calc(100%-18px)]" : "h-full"
      } w-[2px] left-[8px] top-1 rounded-full hover:opacity-80 ${
        active ||
        finished
          ? `bg-primary-burnt_sienna`
          : `bg-gray-500`
      }`}
    >
      {" "}
    </div>
    {expanded && categories && (
      <div className="flex flex-col  gap-2 ">
        {categories.map((category) => {
          if (category.criteriaId === criterion.id) {
            return (
              <button
                onClick={() => {
                  if(currentForm) {
                    const noAnswerQuestions = categoryQuestions?.filter(
                      (q) =>
                        !formAnswers?.find((a) => a.questionId === q.id)
                    );
                    noAnswerQuestions?.forEach((q) => {
                      submitAnswer(q.id, "false");
                    });
                    setSelectedCriteria(criterion, false, false);
                    setSelectedCategory(category);
                  }
                }}
                key={category.id}
                className={`flex flex-row items-center ml-[3px] ${currentForm ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
              >
                <FormNavButton
                  active={active || finishedCategories.includes(category.id)}
                  finished={finishedCategories.includes(category.id)}
                />
                <span
                  className={`ml-4 text-start text-sm ${
                    selectedCategory?.id === category.id
                      ? `font-bold`
                      : "font-normal"
                  }`}
                >
                  {t(category.name)}
                </span>
              </button>
            );
          }
        })}
      </div>
    )}
  </div>
}
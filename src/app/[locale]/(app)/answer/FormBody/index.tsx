"use client";

import { useForm } from "@/app/store/FormProvider";
import { useCallback, useEffect, useState } from "react";
import { fetchQuestionsByCategory, fetchQuestions } from "@/services/question";
import { createAnswers, fetchAnswers } from "@/services/answer";
import { Answer } from "@/models/answer";
import FormItem from "./FormItem";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import FormInstructions from "./FormInstructions";
import FormResume from "./FormResume";
import { useTranslations } from "next-intl";

export default function FormBody() {
  const selectedCategory = useForm()!((state) => state.selectedCategory);
  const setSelectedCategory = useForm()!((state) => state.setSelectedCategory);
  const setSelectedCriteria = useForm()!((state) => state.setSelectedCriteria);
  const [firstAccess, setFirstAccess] = useState(true);

  const setCategoryQuestions = useForm()!(
    (state) => state.setCategoryQuestions
  );
  const categoryQuestions = useForm()!((state) => state.categoryQuestions);
  const selectedCriteria = useForm()!((state) => state.selectedCriteria);
  const questions = useForm()!((state) => state.questions);
  const categories = useForm()!((state) => state.categories);
  const criteria = useForm()!((state) => state.criteria);

  const formAnswers = useForm()!((state) => state.formAnswers);
  const setFormAnswers = useForm()!((state) => state.setFormAnswers);
  const currentForm = useForm()!((state) => state.currentForm);
  const setQuestions = useForm()!((state) => state.setQuestions);
  const [expandNA, setExpandNA] = useState(false);
    const t = useTranslations();
  const getAnswers = useCallback(() => {
    if (currentForm) {
      fetchAnswers(currentForm.id).then((response) => {
        if (response) {
          setFormAnswers(response.answers);
        }
      });
    }
  }, [currentForm, setFormAnswers]);

  useEffect(() => {
    console.log('mudança',selectedCategory, selectedCriteria)
  }, [selectedCategory, selectedCriteria])

  useEffect(() => {
    console.log('first access', firstAccess)
    if(formAnswers && firstAccess && questions && categories && criteria && formAnswers.length > 0) {
      setFirstAccess(false);
      const orderedForm = formAnswers.toSorted((a, b) => a.questionId > b.questionId ? -1 : 1);
      if(orderedForm.length > 0) {
        const lastQuestion = questions.find(q => q.id === orderedForm[0].questionId);
        const lastCategory = categories.find(c => c.id === lastQuestion?.categoryId);
        const lastCriterion = criteria.find(c => c.id === lastCategory?.criteriaId);
        console.log('last question', lastQuestion)
        console.log('last lastCategory', lastCategory)
        console.log('last lastCriterion', lastCriterion)

        if(lastCriterion && lastCategory) {
          setSelectedCriteria(lastCriterion, false, false);
          setSelectedCategory(lastCategory)
        }
      }
    }
  }, [formAnswers, questions, categories, criteria, setSelectedCategory, setSelectedCriteria])

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

  const getQuestionsByCategory = useCallback(
    (categoryId: number) => {
      fetchQuestionsByCategory(categoryId).then((response) => {
        if (response) {
          setCategoryQuestions(response.questions);
        }
      });
    },
    [setCategoryQuestions]
  );

  const getQuestions = useCallback(() => {
    fetchQuestions().then((response) => {
      setQuestions(response.questions);
    });
  }, [setQuestions]);

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);
  useEffect(() => {
    if (selectedCategory) {
      getQuestionsByCategory(selectedCategory?.id);
      getAnswers();
    }else if(selectedCriteria?.id === -1 || selectedCriteria?.id  === -2) {
      getAnswers();
    }
  }, [selectedCategory, getQuestionsByCategory, getAnswers, selectedCriteria]);

  const categoryAnswers =
    categoryQuestions && formAnswers
      ? formAnswers.filter((item) =>
          categoryQuestions
            .map((cQuestion) => cQuestion.id)
            .includes(item.questionId)
        )
      : [];
  return (
    <div className="md:w-[calc(100%-384px)] gap-6 flex flex-col flex-1 md:ml-96">
      {selectedCriteria?.id !== -1 && selectedCriteria?.id !== -2 && <div>{t("Para responder, selecione todas as respostas que se aplicam e as perguntas serão salvas automaticamente. Caso a pergunta seja opcional e não se encaixe no contexto da sua empresa, você pode descartá-la clicando no ícone de lixeira ao lado da pergunta. Você sempre pode recuperar as perguntas descartadas")}.</div>}
      {selectedCriteria?.id !== -1 && selectedCriteria?.id !== -2 && <div><b>Sobre a categoria:</b> {t(selectedCategory?.description)}</div>}

      {selectedCriteria?.id !== -1 &&
        selectedCriteria?.id !== -2 &&
        categoryQuestions?.map((question, index) => {
          const NAAnswers = categoryAnswers.filter(
            (answer) => answer.answer === "NA"
          );
          if (
            !NAAnswers?.map((item) => item.questionId).includes(question.id)
          ) {
            return (
              <FormItem
                answer={formAnswers?.find(
                  (item) => item.questionId === question.id
                )}
                question={question}
                submitAnswer={submitAnswer}
                key={question.id}
              />
            );
          }
        })}
      {categoryAnswers.filter((item) => item.answer === "NA").length > 0 && selectedCriteria?.id !== -1 && selectedCriteria?.id !== -2 && (
        <div className="flex flex-col gap-6">
          <button
            onClick={() => setExpandNA((prev) => !prev)}
            className="text-start font-bold flex flex-row gap-2 items-center hover:opacity-80"
          >
            {t("Não se aplica")}
            {expandNA ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandNA &&
            categoryQuestions?.map((question, index) => {
              const NAAnswers = categoryAnswers.filter(
                (answer) => answer.answer === "NA"
              );
              if (
                NAAnswers?.map((item) => item.questionId).includes(question.id)
              ) {
                return (
                  <FormItem
                    answer={formAnswers?.find(
                      (item) => item.questionId === question.id
                    )}
                    question={question}
                    submitAnswer={submitAnswer}
                    key={question.id}
                  />
                );
              }
            })}
        </div>
      )}
      {selectedCriteria?.id === -1 && <FormInstructions />}
      {selectedCriteria?.id === -2 && <FormResume />}
    </div>
  );
}

"use client";

import { useForm } from "@/app/store/FormProvider";
import Button from "@/components/Button";
import { Answer } from "@/models/answer";
import { createAnswers } from "@/services/answer";
import { finishForm } from "@/services/form";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FormFoot() {
  const selectedCategory = useForm()!((state) => state.selectedCategory);
  const setSelectedCategory = useForm()!((state) => state.setSelectedCategory);
  const criteriaCategories = useForm()!((state) => state.criteriaCategories);
  const criteria = useForm()!((state) => state.criteria);
  const selectedCriteria = useForm()!((state) => state.selectedCriteria);
  const setSelectedCriteria = useForm()!((state) => state.setSelectedCriteria);
  const currentForm = useForm()!((state) => state.currentForm);
  const setInstructions = useForm()!((state) => state.setInstructions);
  const setResume = useForm()!((state) => state.setResume);
  const setCurrentForm = useForm()!((state) => state.setCurrentForm);
  const getAllForms = useForm()!((state) => state.getAllForms);
  const t = useTranslations();
  const categoryQuestions = useForm()!((state) => state.categoryQuestions);
  const questions = useForm()!((state) => state.questions);
  const formAnswers = useForm()!((state) => state.formAnswers);
  const setFormAnswers = useForm()!((state) => state.setFormAnswers);
  const createForm = useForm()!((state) => state.createForm);
  const allForms = useForm()!((state) => state.allForms);

  const router = useRouter();


  const [isNextCategory, setIsNextCategory] = useState(
    criteriaCategories &&
      criteriaCategories.length > 1 &&
      selectedCategory &&
      selectedCategory.id !==
        criteriaCategories[criteriaCategories?.length - 1].id
  );
  const [isLastCriteria, setIsLastCriteria] = useState(
    criteria &&
      criteria.length > 1 &&
      selectedCriteria &&
      selectedCriteria.id === criteria[criteria.length - 1].id
  );
  const [isFirstCategory, setIsFirstCategory] = useState(
    criteriaCategories &&
      criteriaCategories.length > 1 &&
      selectedCategory &&
      selectedCategory.id === criteriaCategories[0].id
  );
  const [isFirstCriteria, setIsFirstCriteria] = useState(
    criteria &&
      criteria.length > 1 &&
      selectedCriteria &&
      selectedCriteria.id === criteria[0].id
  );

  useEffect(() => {
    setIsNextCategory(
      criteriaCategories &&
        criteriaCategories.length > 1 &&
        selectedCategory &&
        selectedCategory.id !==
          criteriaCategories[criteriaCategories?.length - 1].id
    );
    setIsFirstCategory(
      criteriaCategories &&
        criteriaCategories.length > 1 &&
        selectedCategory &&
        selectedCategory.id === criteriaCategories[0].id
    );
  }, [criteriaCategories, selectedCategory]);
  useEffect(() => {
    setIsLastCriteria(
      criteria &&
        criteria.length > 1 &&
        selectedCriteria &&
        selectedCriteria.id === criteria[criteria.length - 1].id
    );
    setIsFirstCriteria(
      criteria &&
        criteria.length > 1 &&
        selectedCriteria &&
        selectedCriteria.id === criteria[0].id
    );
  }, [criteria, selectedCriteria]);

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
  const handleNext = async () => {
    const noAnswerQuestions = categoryQuestions?.filter(
      (q) => !formAnswers?.find((a) => a.questionId === q.id)
    );
    noAnswerQuestions?.map((q) => {
       submitAnswer(q.id, "false");
    });
    if (selectedCriteria?.id === -1 && criteria) {
      setSelectedCriteria(criteria[0]);
    }
    if (isNextCategory && criteriaCategories && selectedCategory) {
      const index = criteriaCategories.findIndex(
        (value, index, categories) => value.id === selectedCategory.id
      );
      setSelectedCategory(criteriaCategories[index + 1]);
    } else if (
      !isNextCategory &&
      !isLastCriteria &&
      selectedCriteria &&
      criteria &&
      selectedCriteria.id !== -2
    ) {
      const index = criteria?.findIndex(
        (value) => value.id === selectedCriteria.id
      );
      setSelectedCriteria(criteria[index + 1]);
    } else if (selectedCriteria?.id !== -2) {
      setResume();
    } else {
      if ( questions && formAnswers && (questions?.length <= formAnswers?.length) && currentForm) {
        finishForm(currentForm?.id).then((response) => {
          setCurrentForm(undefined);
          getAllForms();
          setInstructions();
          setFormAnswers(undefined);
          toast("Avaliação enviada com sucesso!", {type: 'success'});
          router.push('home');
        });
      } else {
        toast("Você deve responder todas as perguntas", { type: "error" });
      }
    }
  };

  const handleBack = () => {
    if (!isFirstCategory && criteriaCategories && selectedCategory) {
      const index = criteriaCategories.findIndex(
        (value, index, categories) => value.id === selectedCategory.id
      );
      setSelectedCategory(criteriaCategories[index - 1]);
    } else if (
      isFirstCategory &&
      !isFirstCriteria &&
      criteria &&
      selectedCriteria
    ) {
      const index = criteria.findIndex(
        (value, index, categories) => value.id === selectedCriteria.id
      );
      setSelectedCriteria(criteria[index - 1], true);
    } else if (isFirstCriteria) {
      setInstructions();
    }
  };

  return (
    <div className="flex flex-row gap-9 justify-end">
      {selectedCriteria?.id === -1 && !currentForm ? (
        <>
          <Button onClick={() => createForm(true)} text="Iniciar avaliação em branco" buttonStyle={allForms && allForms?.length > 0 ? "secondary" : 'primary'}/>
          { allForms && allForms?.length > 0 && <Button onClick={() => createForm(false)} text="Iniciar com última resposta" buttonStyle="primary" />}
        </>
      ) : (
        <>
          <Button
            disabled={selectedCriteria?.id === -1}
            onClick={handleBack}
            text={t("Voltar")}
            buttonStyle="secondary"
          />
          <Button
            onClick={handleNext}
            text={t(selectedCriteria?.id !== -2 ? "Próximo" : "Enviar")}
            buttonStyle="primary"
          />
        </>
      )}
    </div>
  );
}

"use client";

import { useForm } from "@/app/store/FormProvider";
import { useCallback, useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import FormNavCriterion from "./FormNavCriterion";
import { useTranslations } from "next-intl";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { deleteForm } from "@/services/form";
import { toast } from "react-toastify";

export default function FormNav() {
  const getCriteria = useForm()!((state) => state.getCriteria);
  const getCategories = useForm()!((state) => state.getCategories);
  const selectedCategory = useForm()!((state) => state.selectedCategory);
  const selectedCriteria = useForm()!((state) => state.selectedCriteria);
  const setInstructions = useForm()!((state) => state.setInstructions);
  const setResume = useForm()!((state) => state.setResume);
  const t = useTranslations();

  const criteria = useForm()!((state) => state.criteria);
  const categories = useForm()!((state) => state.categories);
  const formAnswers = useForm()!((state) => state.formAnswers);
  const currentForm = useForm()!((state) => state.currentForm);
  const setCurrentForm = useForm()!((state) => state.setCurrentForm);
  const setFormAnswers = useForm()!((state) => state.setFormAnswers);

  const questions = useForm()!((state) => state.questions);
  const [finishedCategories, setFinishedCategories] = useState<number[]>([]);
  const [finishedCriteria, setFinishedCriteria] = useState<number[]>([]);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const [expandedCriterion, setExpandedCriterion] = useState(
    selectedCategory ? [selectedCategory.criteriaId] : []
  );

  const getNavData = useCallback(async () => {
    await Promise.all([getCriteria(), getCategories()]);
  }, [getCategories, getCriteria]);

  useEffect(() => {
    getNavData();
  }, [getNavData]);
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCriterion((prev) => [...prev, selectedCategory.criteriaId]);
    }
  }, [selectedCategory]);

  const verifyFinishedCriteria = useCallback(() => {
    criteria?.forEach((criterion) => {
      const criteriaCategory = categories?.filter(
        (category) => category.criteriaId === criterion.id
      );
      const unfinishedCriteriaCategories = criteriaCategory?.filter(
        (category) => !finishedCategories.includes(category.id)
      );
      if (unfinishedCriteriaCategories?.length === 0) {
        setFinishedCriteria((prev) => [...prev, criterion.id]);
      }
    });
  }, [categories, criteria, finishedCategories]);

  useEffect(() => {
    if (!formAnswers || formAnswers.length === 0) {
      setFinishedCriteria([]);
      setFinishedCategories([]);
    } else {
      verifyFinishedCriteria();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAnswers, categories, questions]);

  const onClickExpand = (criterionId: number) => {
    if (expandedCriterion.includes(criterionId)) {
      setExpandedCriterion((prev) =>
        prev.filter((item) => item !== criterionId)
      );
    } else {
      setExpandedCriterion((prev) => [...prev, criterionId]);
    }
  };
  const progress =
    questions && formAnswers ? formAnswers.length / questions?.length : 0;

    const onDescarte = () => {
      if(currentForm) {
        deleteForm(currentForm.id).then((resp: any) => {
          setCurrentForm(resp.form);
          setFormAnswers(resp.formAnswers);
          setInstructions();
          toast(resp.message, {type: 'success'})
        });
      }
    }

    const handleDescartar = () => {
      const r = confirm("Tem certeza que deseja descartar a avaliação? Essa operação não poderá ser desfeita.");
      if(r) {
        onDescarte();
      } 
    }

  return criteria && categories ? (
    <div className="flex flex-col h-full lg:h-[80%] min-h-[80%] lg:max-h-[80%] border bg-gray-50 rounded-md  p-6 max-w-xs w-80  min-w-[320px] shadow-lg   overflow-auto overflow-x-hidden">
      <div className="flex flex-row justify-between items-center gap-1 mb-3">
        <span className="font-bold text-xl text-center">{t("Avaliação")}</span>
        <div className="flex flex-row items-center gap-2 flex-1 relative">
          <ProgressBar value={progress > 1 ? 1 : progress} />
          <BsThreeDotsVertical className="cursor-pointer" onClick={() => setOptionsVisible(prev => !prev)} />
          {optionsVisible && <div className="  bg-white flex flex-col gap-2 border border-solid border-gray-300 rounded-md absolute right-0 top-3 z-20">
            {currentForm && <button className="flex flex-row gap-2 items-center cursor-pointer p-2 flex-nowrap whitespace-nowrap" onClick={handleDescartar}> <FaTrash color={'#9ba0a8'}  /> Descartar avaliação</button>}
          </div>}
        </div>
      </div>
      <FormNavCriterion
        active={selectedCriteria?.id === -1}
        criterion={{
          id: -1,
          name: "Instruções",
        }}
        expanded={false}
        finished={selectedCriteria?.id !== -1}
        index={-1}
        isLast={false}
        onClick={() => setInstructions()}
      />
      {criteria.map((criterion, index) => {
        return (
          <FormNavCriterion
            finishedCategories={finishedCategories}
            setFinishedCategories={setFinishedCategories}
            onClick={() => onClickExpand(criterion.id)}
            active={selectedCategory?.criteriaId === criterion.id}
            finished={finishedCriteria.includes(criterion.id)}
            expanded={expandedCriterion.includes(criterion.id)}
            isLast={false}
            criterion={criterion}
            index={index}
            categories={categories}
            key={criterion.id}
          />
        );
      })}
      <FormNavCriterion
        active={selectedCriteria?.id === -2}
        criterion={{
          id: -2,
          name: "Revisão",
        }}
        expanded={false}
        finished={false}
        index={criteria.length}
        isLast={true}
        onClick={() => {
          if (currentForm) {
            setResume();
          }
        }}
      />
    </div>
  ) : (
    <>loading...</>
  );
}

"use client";
import { useState, createContext, useContext } from "react";
import { Form } from "@/models/form";
import { create } from "zustand";
import { Criteria } from "@/models/criteria";
import { Category } from "@/models/category";
import { Question } from "@/models/question";
import { AnswerForm } from "@/models/answer";
import { fetchAllCategories, fetchCategories } from "@/services/category";
import { fetchQuestionsByCategory } from "@/services/question";
import { createForm, fetchAllDeletedForms, fetchAllForms } from "@/services/form";
import { fetchCriteria } from "@/services/criteria";

export interface FormState {
    currentForm?: Form;
    criteria?: Criteria[];
    categories?: Category[];
    loading: boolean;
    selectedCriteria?: Criteria;
    criteriaCategories?: Category[];
    categoryQuestions?: Question[];
    selectedCategory?: Category;
    selectedQuestion?: Question;
    formAnswers?: AnswerForm[];
    questions?: Question[];
    allForms?: Form[];
    allDeletedForms?: Form[];
    loadingForms: boolean;
    selectedForm?: Form;
}

export interface FormActions {
    setCurrentForm: (form?: Form) => void;
    setCriteria: (criteria: Criteria[]) => void;
    setSelectedCriteria: (criteria: Criteria, back?: boolean, autoCategory?: boolean) => void;
    setCriteriaCategories: (categories: Category[]) => void;
    setCategoryQuestions: (questions: Question[]) => void;
    setSelectedCategory: (category: Category) => void;
    setSelectedQuestion: (question: Question) => void;
    setFormAnswers: (formAnswers?: AnswerForm[]) => void;
    setQuestions: (questions: Question[]) => void;
    getAllForms: () => void;
    getAllDeletedForms: () => void;
    getCriteria: () => void;
    getCategories: () => void;
    setInstructions: () => void;
    setResume: () => void;
    createForm: (blank: boolean) => void;
    setSelectedForm: (form?: Form) => void;
}

export type FormStore = FormActions & FormState;

const initialFormState: FormState = {
    loading: true,
    loadingForms: false
}

export const createStore = ({loading,  allForms, currentForm, criteria, questions, formAnswers, selectedCriteria, categoryQuestions, criteriaCategories, selectedCategory, selectedQuestion}: FormState) => create<FormStore>(
    (set, get) => {
        return {
            ...initialFormState,
            currentForm,
            loading,
            criteria,
            selectedCriteria,
            categoryQuestions,
            criteriaCategories,
            selectedCategory,
            selectedQuestion,
            formAnswers,
            questions,
            allForms,
            getAllDeletedForms: () => {
                fetchAllDeletedForms().then(res => {
                    set({allDeletedForms: res.deletedForms})
                })
            },
            setSelectedForm: (form) => {
                set({selectedForm: form})
            },
            setCurrentForm: (form) => {
                set({currentForm: form})
            },
            setCriteria: (criteria) => {
                set({criteria})
            },
            setInstructions: () => {
                set({selectedCriteria: {id: -1, name: "Instruções"}, criteriaCategories: [], selectedCategory: undefined})
            },
            setResume: () => {
                set({selectedCriteria: {id: -2, name: "Resumo"}, criteriaCategories: [], selectedCategory: undefined})
            },
            setSelectedCriteria: (selectedCriteria, back = false, autoCategory = true) => {
                fetchCategories(selectedCriteria.id).then(response => {
                    set({selectedCriteria: selectedCriteria, criteriaCategories: response.categories});
                    if(autoCategory) {
                        get().setSelectedCategory(back ? response.categories[response.categories.length - 1]  :response.categories[0])
                    }

                })
            },
            setCategoryQuestions: (questions) => {
                set({categoryQuestions: questions});
            },
            setCriteriaCategories: (categories) => {
                set({criteriaCategories: categories});
            },
            setSelectedCategory: (category) => {
                set({selectedCategory: category});
                fetchQuestionsByCategory(category.id).then(response => {
                    if(response) {
                        set({categoryQuestions: response.questions});
                    }
                })
            },
            setSelectedQuestion: (question) => {
                set({selectedQuestion: question})
            },
            setFormAnswers: (formAanswers) => {
                set({formAnswers: formAanswers})
            },
            setQuestions: (questions) => {
                set({questions: questions})
            },
            getAllForms: () => {
                set({loadingForms: true})
                fetchAllForms().then(response => {
                    set({allForms: response.forms, loadingForms: false})
                })
            },
            getCriteria: () => {
                fetchCriteria().then((response) => {
                    set({criteria: response.criteria});
                    if(!get().selectedCriteria) {
                        set({ selectedCriteria: {id: -1, name: "Instruções"}});
                    }
                    
                })
            },
            getCategories: () => {
                fetchAllCategories().then((response) => {
                    set({categories: response.categories})
                })
            },
            createForm: (blank) => {
                createForm({blank}).then((response) => {
                    set({currentForm: response?.form});
                    if(response?.formAnswer) {
                        set({formAnswers: response.formAnswer});
                    }
                    const criteria = get().criteria;
                    if(criteria) {
                        get().setSelectedCriteria(criteria[0]);
                        
                    }
                })
            }
        }
    }
)

const FormContext = createContext<ReturnType<typeof createStore> | null>(null);

export const useForm = () => {
    return useContext(FormContext);
}

interface FormProviderProps  {
    children: React.ReactNode;
}

const FormProvider = ({children}: FormProviderProps) => {
    const [store] = useState(() => createStore({loading: false, loadingForms: false}));
    return <FormContext.Provider value={store}>{children}</FormContext.Provider>
}

export default FormProvider;
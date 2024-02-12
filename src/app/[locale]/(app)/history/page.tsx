"use client";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "@/app/store/FormProvider";
import { DateTime } from "luxon";
import { FaChevronDown, FaChevronRight, FaChevronUp, FaTrash, FaTrashRestore } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { deleteForm, restoreForm } from "@/services/form";
import { toast } from "react-toastify";
import { Form } from "@/models/form";
import { useEffect, useState } from "react";
export default function History() {
  const allForms = useForm()!((state) => state.allForms);
  const setSelectedForm = useForm()!((state) => state.setSelectedForm);
  const getAllForms = useForm()!((state) => state.getAllForms);
  const getAllDeletedForms = useForm()!((state) => state.getAllDeletedForms);
  const allDeletedForms = useForm()!((state) => state.allDeletedForms);
  const [expandDeleted, setExpanDeleted] = useState(false);

  const route = useRouter();
  const t = useTranslations();

  useEffect(() => {
    getAllDeletedForms();
  }, [getAllDeletedForms])

  const onDescarte = (formId: number) => {
    deleteForm(formId).then((resp: any) => {
      getAllForms();
      getAllDeletedForms();
      toast(resp.message, { type: "success" });
    });
  };

  const handleDescartar = (formId: number) => {
    const r = confirm(
      "Tem certeza que deseja deletar a avaliação? Você poderá recuperar a avaliação posteriormente."
    );
    if (r) {
      onDescarte(formId);
    }
  };

  const onRestore = (formId: number) => {
    restoreForm(formId).then((resp: any) => {
      getAllForms();
      getAllDeletedForms();
      toast(resp.message, { type: "success" });
    });
  };

  const handleRestore = (formId: number) => {
      onRestore(formId);
  };
  const handleClick = (item: Form) => {
    if (item.finished) {
      setSelectedForm(item);
      route.push("home");
    } else {
      route.push("answer");
    }
  };
  return (
    <div className="flex flex-col gap-4 ">
      <div className=" flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl: grid-cols-5 gap-5">
      {allForms && allForms.length > 0 ? (
        allForms
          ?.toSorted((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .map((item) => {
            return (
              <button
                key={item.id}
                className="border border-solid border-gray-100 bg-white p-4 w-72 rounded-md gap-5 hover:opacity-80"
              >
                <div className="flex flex-row justify-between items-center">
                  <span
                    className=" text-[#6E7787FF] text-xs flex-1 text-start"
                    onClick={() => handleClick(item)}
                  >
                    {t("Avaliação")}
                  </span>
                  <div className="flex flex-row gap-2 items-center relative">
                    <span
                      className={`text-[11px]  ${
                        item.finished
                          ? "bg-primary-burnt_sienna mr-6 text-white"
                          : "bg-transparent text-black font-semibold border border-solid border-primary-burnt_sienna"
                      }  rounded-xl px-2 py-1`}
                    >
                      {t(!item.finished ? "Em andamento" : "Finalizado")}
                    </span>
                    {item.finished && (
                      <FaTrash
                        onClick={() => handleDescartar(item.id)}
                        color={"gray"}
                        className={
                          "z-20 right-0 absolute hover:opacity-60 cursor-pointer"
                        }
                      />
                    )}
                  </div>
                </div>
                <div
                  onClick={() => handleClick(item)}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="flex flex-col font-bold">
                    <span className="text-base">
                      {DateTime.fromJSDate(new Date(item.updatedAt)).toFormat(
                        "dd/MM/yyyy"
                      )}
                    </span>
                    <span className="text-sm">
                      {DateTime.fromJSDate(new Date(item.updatedAt)).toFormat(
                        "hh:mm"
                      )}
                    </span>
                  </div>
                  <FaChevronRight />
                </div>
              </button>
            );
          })
      ) : (
        <span className="w-full text-center font-bold p-4">
          {t("Você ainda não respondeu nenhuma avaliação")}.
        </span>
      )}
    </div>
    <div className="flex flex-col gap-6">
          <button
            onClick={() => setExpanDeleted((prev) => !prev)}
            className="text-start font-bold flex flex-row gap-2 items-center hover:opacity-80"
          >
            {t("Avaliações deletadas")}
            {expandDeleted ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {expandDeleted &&
      <div className=" flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl: grid-cols-5 gap-5">
      {allDeletedForms && allDeletedForms.length > 0 ? (
               allDeletedForms
                 ?.toSorted((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                 .map((item) => {
                   return (
                     <button
                       key={item.id}
                       className="border border-solid border-gray-100 bg-white p-4 w-72 rounded-md gap-5 cursor-default"
                     >
                       <div className="flex flex-row justify-between items-center">
                         <span
                           className=" text-[#6E7787FF] text-xs flex-1 text-start"
                         >
                           {t("Avaliação")}
                         </span>
                         <div className="flex flex-row gap-2 items-center relative">
                           <span
                             className={`text-[11px]  ${
                               item.finished
                                 ? "bg-primary-burnt_sienna mr-6 text-white"
                                 : "bg-transparent text-black font-semibold border border-solid border-primary-burnt_sienna"
                             }  rounded-xl px-2 py-1`}
                           >
                             {t(!item.finished ? "Em andamento" : "Finalizado")}
                           </span>
                           {item.finished && (
                             <FaTrashRestore
                               onClick={() => handleRestore(item.id)}
                               color={"gray"}
                               className={
                                 "z-20 right-0 absolute hover:opacity-60 cursor-pointer"
                               }
                             />
                           )}
                         </div>
                       </div>
                       <div
                         className="flex flex-row justify-between items-center"
                       >
                         <div className="flex flex-col font-bold">
                           <span className="text-base">
                             {DateTime.fromJSDate(new Date(item.updatedAt)).toFormat(
                               "dd/MM/yyyy"
                             )}
                           </span>
                           <span className="text-sm">
                             {DateTime.fromJSDate(new Date(item.updatedAt)).toFormat(
                               "hh:mm"
                             )}
                           </span>
                         </div>
                         <FaChevronRight />
                       </div>
                     </button>
                   );
                 })
             ) : (
               <span className="w-full text-center font-bold p-4">
                 {t("Nenhuma avaliação descartada")}.
               </span>
             )}
           </div>}
        </div>
   
    </div>
  );
}

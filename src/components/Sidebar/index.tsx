import Link from "next/link";
import { MenuItem } from "./MenuItem";
import { BsInfoSquare, BsEnvelopeAt } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { TbReportAnalytics } from "react-icons/tb";
import { RiFileHistoryLine } from "react-icons/ri";
import { MdFormatListNumbered } from "react-icons/md";
import LanguageSelector from "../LanguageSelector";
import { Languages } from "@/navigation";
import { useTranslations } from "next-intl";

interface ModalOverlayProps {
  setter: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalOverlay = ({ setter }: ModalOverlayProps) => (
  <div
    className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
    onClick={() => {
      setter((oldVal) => !oldVal);
    }}
  />
);

interface SidebarProps {
  show: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  locale: Languages;
}

export default function Sidebar({
  show,
  setter,
  logout,
  locale,
}: SidebarProps) {
  // Define our base class
  const className = `bg-white  shadow-md flex-col lg:flex-row gap-4  h-[60px] w-full transition-[margin-left] ease-in-out duration-500 fixed top-0 right-0 left-0 z-40  `;
  // Append class based on state of sidebar visiblity
  const appendClass = show
    ? " ml-0 flex"
    : " ml-[-250px] md:ml-0 hidden lg:flex";
  const t = useTranslations();
  // Clickable menu items

  const handleLogOut = () => {
    const r = confirm("Deseja sair da sua conta?");
    if (r) {
      logout();
    }
  };
  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-2 flex-row flex">
          <Link href="/">
            {/*eslint-disable-next-line*/}
            <span className="font-extrabold text-lg text-secondary-berkeley_blue">
              ESGrow
            </span>
            {/* <img src={""} alt="Company Logo" width={200} height={40} /> */}
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row  flex-1 justify-between">
          <div className="flex flex-col lg:flex-row bg-white w-full  h-full">
            <MenuItem
              locale={locale}
              name={t("Relatório de desempenho")}
              route="/home"
              icon={<TbReportAnalytics />}
              setter={setter}
            />
            <MenuItem
              locale={locale}
              name={t("Histórico de avaliações")}
              route="/history"
              icon={<RiFileHistoryLine />}
              setter={setter}
            />
            <MenuItem
              locale={locale}
              name={t("Responder avaliação")}
              route="/answer"
              setter={setter}
              icon={<MdFormatListNumbered />}
            />
          </div>
          <div className="flex flex-col bg-white lg:bg-inherit lg:flex-row gap-4 p-3">
            <button
              className="flex flex-row lg:border  border-solid border-gray-200 border-b  lg:justify-normal justify-center  lg:bg-gray-100 rounded-md items-center gap-2 hover:opacity-80 p-2"
              onClick={handleLogOut}
            >
              <CiLogout />
              {t("Sair")}
            </button>
            <div>
            <div className="flex justify-center items-center">
            <LanguageSelector locale={locale} />
            </div>
            </div>
          </div>
        </div>
      </div>
      {show ? <ModalOverlay setter={setter} /> : <></>}
    </>
  );
}

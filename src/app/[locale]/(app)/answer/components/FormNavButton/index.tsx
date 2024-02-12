import { FaCheck } from "react-icons/fa";
interface FormNavButtonProps {
  active: boolean;
  finished: boolean;
}

export default function FormNavButton({
  active,
  finished,
}: FormNavButtonProps) {
  return (
    <div
      className={`${
        active
          ? `${
              finished
                ? `bg-secondary-honeydew  border-primary-burnt_sienna`
                : `bg-primary-burnt_sienna`
            }`
          : `${
              finished
                ? `bg-secondary-honeydew  border-gray-500`
                : `bg-gray-500 border-secondary-honeydew`
            }`
      } w-3 h-3 hover:opacity-80 rounded-full border-2 border-solid z-10 flex items-center justify-center`}
    >
      {finished && <FaCheck color={active ? "#e76f51" : "#6b7280"} size={6} />}
    </div>
  );
}

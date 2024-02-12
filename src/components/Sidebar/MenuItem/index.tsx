import { Languages } from "@/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
    icon: React.ReactNode;
    name: string;
    route: string;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    logout?: () => void;
    locale: Languages;
}

export const MenuItem = ({ icon, name, route, setter, logout, locale}: MenuItemProps) => {
    // Highlight menu item based on currently displayed route
    const pathname = usePathname();
    const className = pathname === route || pathname === `/${locale}${route}`  ? "font-bold text-secondary-berkeley_blue border-b-[2px] border-b-secondary-berkeley_blue" : "secondary-berkeley_blue hover:secondary-berkeley_blue/80";
    return (
        <Link
            href={route}
            onClick={() => {
                setter(oldVal => !oldVal);
                if(logout) {
                    logout()
                }
            }}
            className={`flex h-10 lg:h-full border-b border-solid border-gray-200 lg:border-0 gap-1 [&>*]:my-auto text-md  px-2 text-center items-center justify-center hover:opacity-80 ${className}`}
        >
            <div>{name}</div>
        </Link>
    )
}
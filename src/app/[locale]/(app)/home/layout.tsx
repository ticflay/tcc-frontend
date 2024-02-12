import Header from "@/components/Header";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return <div className="flex flex-col flex-1 gap-4 p-6 bg-gray-100 ">
        {children}
    </div>
}
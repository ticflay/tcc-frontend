import Header from "@/components/Header";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({children}: LayoutProps) {
    return <div className="flex flex-col gap-4 flex-1 p-6 mt-10 lg:mt-0">
    <Header title="Histórico de avaliações" />
    {children}
</div>
}
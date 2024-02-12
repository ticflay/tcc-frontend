import Header from "@/components/Header";
import FormNav from "./components/FormNav";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col md:flex-row flex-1 relative m-4 items-center mt-20">
     <div className="h-full flex items-center  md:ml-10 md:absolute left-0 top-0">
     <FormNav />
     </div>
      <div className="flex flex-col gap-2 flex-1 p-6  max-w-[100vw]">
        {/* <Header /> */}
        {children}
      </div>
    </div>
  );
}

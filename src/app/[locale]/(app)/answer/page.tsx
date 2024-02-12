import HeaderForm from "./HeaderForm";
import FormBody from "./FormBody";
import FormFoot from "./FormFoot";

export default function Home() {

    return <div className="w-full gap-7 flex flex-col flex-1">
        <HeaderForm  />
        <FormBody />
        <FormFoot />
    </div>
}

interface FormFootProps {
    rememberLabel: string;
    forgotPasswordLabel: string;
    loginLabel: string;

}

export default function FormFoot({forgotPasswordLabel, loginLabel, rememberLabel}: FormFootProps) {
    return <>
    <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-3">
            <input type="checkbox" name="rememberme" id="rememberme" />
            <label className="hover:opacity-80 cursor-pointer" htmlFor="rememberme">{rememberLabel}</label>
          </div>
          <span>{forgotPasswordLabel}</span>
        </div>
        <button className="bg-focusedColor h-10 hover:opacity-80 flex items-center justify-center text-secondary-honeydew font-bold w-full rounded">
          {loginLabel}
        </button>
    </>
}
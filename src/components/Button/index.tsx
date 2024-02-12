import { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    buttonStyle?: 'primary' | 'secondary',
    text: string;
}

export default function Button({buttonStyle = 'primary',  text, ...rest}: ButtonProps) {
    return <button {...rest} className={`flex px-2 hover:opacity-80 items-center justify-center min-w-[148px] h-10 ${buttonStyle === 'primary' ? 'text-white bg-primary-persian_green' : 'bg-transparent text-gray-600 border border-gray-600 border-solid'} font-bold text-sm rounded`}>
        {text}
    </button>
}
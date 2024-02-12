import {  HTMLProps } from "react";

interface DefaultTextInputProps extends HTMLProps<HTMLInputElement>{
  name: string;
  id: string;
  label: string;
}

export default function DefaultTextInput({
  id,
  label,
  name,
  type = 'text',
  ...rest
}: DefaultTextInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm text-primary-charcoal font-bold">
        {label}
      </label>
      <input
        {...rest}
        type={type}
        id={id}
        name={name}
        className="h-10 w-full border border-solid border-primary-charcoal rounded focus:outline-none p-3"
      />
    </div>
  );
}

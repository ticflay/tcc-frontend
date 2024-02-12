
interface LoginTitleProps {
    title: string;
}

export default function LoginTitle({title}: LoginTitleProps) {
    return <div className="items-center justify-center flex">
    <h1 className="text-primary-charcoal text-center text-3xl font-bold">
      {title}
    </h1>
  </div>
}
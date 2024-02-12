export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full items-center justify-center flex bg-secondary-honeydew">
      <div className="min-h-[50%]  w-[calc(100%-3rem)] md:w-2/3 max-w-[900px] rounded-lg border border-solid border-primary-charcoal flex flex-row">
        {children}
      </div>
    </div>
  );
}

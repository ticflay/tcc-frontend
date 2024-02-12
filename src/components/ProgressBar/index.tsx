interface ProgressBarProps {
  value: number; //number between 0 and 1
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="flex flex-row gap-1 justify-end w-full items-center">
      
      <div className="bg-white w-[40%] h-2 rounded border border-solid border-gray-300">
        <div
          style={{ width: `${(value * 100).toFixed(2)}%` }}
          className={`bg-primary-persian_green rounded h-2`}
        ></div>
      </div>
      <div className="text-xs text-end">
        {(value * 100).toFixed(2)}%
      </div>
    </div>
  );
}

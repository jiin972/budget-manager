type inputProps = {
  name: string;
  errors?: string[];
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function AuthInput({ name, errors = [], ...rest }: inputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        name={name}
        {...rest}
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
      />
      {errors?.map((error, index) => (
        <span key={index} className="text-rose-400 text-sm">
          {error}
        </span>
      ))}
    </div>
  );
}

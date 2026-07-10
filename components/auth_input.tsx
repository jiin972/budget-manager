type inputProps = {
  name: string;
  errors: string[];
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function AuthInput({ name, errors = [], ...rest }: inputProps) {
  return (
    <div>
      <input name={name} {...rest} />
      {errors?.map((error, index) => (
        <span key={index}>{error}</span>
      ))}
    </div>
  );
}

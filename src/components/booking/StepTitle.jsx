export default function StepTitle({ title, subTitle }) {
  return (
    <div className="my-5">
      <h1 className="mb-2 text-center text-3xl">{title}</h1>
      <p className="text-muted-foreground text-center">{subTitle}</p>
    </div>
  );
}

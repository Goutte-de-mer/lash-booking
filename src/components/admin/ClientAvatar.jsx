export default function ClientAvatar({ name }) {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold">
      {initial}
    </div>
  );
}
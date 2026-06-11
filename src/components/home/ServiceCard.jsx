import DurationBadge from "./DurationBadge";

export default function ServiceCard({
  title,
  description,
  duration,
  price,
  deposit,
}) {
  return (
    <div className="text-card-foreground group border-border/50 bg-card/80 mx-auto h-full max-w-md overflow-hidden rounded-xl border shadow backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex h-full flex-col p-8">
        <div className="bg-primary/10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
          <span className="text-2xl">✨</span>
        </div>
        <h3 className="font-heading mb-3 text-xl">{title}</h3>
        <p className="text-muted-foreground mb-10 flex-1 text-sm leading-relaxed">
          {description}
        </p>
        <div className="border-border/50 flex items-center justify-between border-t pt-4">
          <DurationBadge duration={duration} />
          <div className="text-right">
            <p className="font-heading text-primary text-2xl font-bold">
              {price}€
            </p>
            <p className="text-muted-foreground text-xs">Acompte {deposit}€</p>
          </div>
        </div>
      </div>
    </div>
  );
}

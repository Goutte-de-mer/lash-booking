import { HugeiconsIcon } from "@hugeicons/react";
import { Clock03Icon } from "@hugeicons/core-free-icons";

export default function DurationBadge({ duration }) {
  return (
    <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md border border-transparent px-2.5 py-1 text-xs font-normal">
      <HugeiconsIcon icon={Clock03Icon} size={15} />
      {duration}min
    </div>
  );
}

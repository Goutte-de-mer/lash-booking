import { Badge } from "@/components/ui/badge";

const APPOINTMENT_STATUS_MAP = {
  pending: {
    label: "En attente",
    className: "border-amber-200 bg-amber-100 text-amber-800",
  },
  confirmed: {
    label: "Confirmé",
    className: "border-green-200 bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Annulé",
    className: "border-red-200 bg-red-100 text-red-800",
  },
};

export default function AppointmentStatusBadge({ status }) {
  const { label, className } = APPOINTMENT_STATUS_MAP[status] ?? {
    label: status,
    className: "",
  };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

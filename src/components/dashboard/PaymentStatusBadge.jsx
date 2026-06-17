import { Badge } from "@/components/ui/badge";

const PAYMENT_STATUS_MAP = {
  paid: {
    label: "Payé",
    className: "border-green-200 bg-green-100 text-green-800",
  },
  partial: {
    label: "Acompte versé",
    className: "border-amber-200 bg-amber-100 text-amber-800",
  },
  unpaid: {
    label: "Non payé",
    className: "border-red-200 bg-red-100 text-red-800",
  },
};

export default function PaymentStatusBadge({ status }) {
  const { label, className } = PAYMENT_STATUS_MAP[status] ?? {
    label: status,
    className: "",
  };

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

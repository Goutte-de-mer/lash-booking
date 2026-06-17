import Greeting from "@/components/dashboard/Greeting";
import Appointments from "@/components/dashboard/Appointments";

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Greeting />
      <Appointments />
    </div>
  );
}

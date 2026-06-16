import BookingTunnel from "@/components/booking/BookingTunnel";
import { getWorkingHours } from "@/lib/workingHours";

export default async function BookingPage() {
  const workingHours = await getWorkingHours();
  // console.log(workingHours);
  return <BookingTunnel workingHours={workingHours} />;
}

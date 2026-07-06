import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  UserMultiple03Icon,
  TimeSetting01Icon,
} from "@hugeicons/core-free-icons";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminClients from "@/components/admin/AdminClients";

export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-5">
        <h1>Administration</h1>
        <p className="text-muted-foreground">
          Gérez votre salon et vos rendez-vous
        </p>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList className="bg-secondary-bis/50 h-auto gap-3.5 rounded-full p-1.5">
          <TabsTrigger
            value="bookings"
            className={"gap-2 rounded-full font-semibold"}
          >
            <HugeiconsIcon icon={Calendar03Icon} size={20} />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className={"gap-2 rounded-full font-semibold"}
          >
            <HugeiconsIcon icon={UserMultiple03Icon} size={20} />
            Clientes
          </TabsTrigger>
          <TabsTrigger
            value="hours"
            className={"gap-2 rounded-full font-semibold"}
          >
            <HugeiconsIcon icon={TimeSetting01Icon} size={20} />
            Horaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <AdminBookings />
        </TabsContent>
        <TabsContent value="clients">
          <AdminClients />
        </TabsContent>
        <TabsContent value="hours">Hours</TabsContent>
      </Tabs>
    </div>
  );
}
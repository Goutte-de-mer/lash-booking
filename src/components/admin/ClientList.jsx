"use client";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { motion } from "motion/react";
import ClientAvatar from "./ClientAvatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export default function ClientList({ clients, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="my-8 space-y-3">
      <InputGroup className={"max-w-md rounded-lg"}>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={Search01Icon}
            size={20}
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Rechercher une cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {/* <Input
        placeholder="Rechercher une cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      /> */}
      <div className="space-y-3 pt-1">
        {filtered.map((client, i) => (
          <motion.button
            key={client._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.07 }}
            onClick={() => onSelect(client._id)}
            className="flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white px-6 py-4 shadow transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <ClientAvatar name={client.name} />
              <div className="text-left">
                {/* VULN-03 — Stored XSS : dangerouslySetInnerHTML désactive
                    l'échappement React. Un payload injecté dans `name` au register
                    (ex: <img src=x onerror="alert(1)">) s'exécute ici. */}
                <p
                  className="font-semibold"
                  dangerouslySetInnerHTML={{ __html: client.name }}
                />
                <p className="text-muted-foreground text-sm">{client.email}</p>
              </div>
            </div>
            <span className="text-muted-foreground rounded-full border px-3 py-1 text-sm">
              {client.bookingCount} RDV
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

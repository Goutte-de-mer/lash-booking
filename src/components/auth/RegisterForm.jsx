"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let isValid = name && email && password;

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      alert("Erreur lors de l'inscription");
      return;
    }
    setName("");
    setEmail("");
    setPassword("");
    router.push("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Nom complet</FieldLabel>
        <FieldContent>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom complet"
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldContent>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Mot de passe</FieldLabel>
        <FieldContent>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
          />
        </FieldContent>
      </Field>
      <Button size="lg" variant="default" type="submit" disabled={!isValid}>
        S'inscrire{" "}
        <HugeiconsIcon icon={SentIcon} size={24} absoluteStrokeWidth={true} />
      </Button>
    </form>
  );
}

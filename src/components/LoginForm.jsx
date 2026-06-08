"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Login01Icon } from "@hugeicons/core-free-icons";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let isValid = email && password;

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Erreur lors de la connexion");
      return;
    }
    setEmail("");
    setPassword("");
    // vulnérable : stockage dans localStorage
    localStorage.setItem("token", data.token);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        Se connecter{" "}
        <HugeiconsIcon
          icon={Login01Icon}
          size={24}
          absoluteStrokeWidth={true}
        />
      </Button>
    </form>
  );
}

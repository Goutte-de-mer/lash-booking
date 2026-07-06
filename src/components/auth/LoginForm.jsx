"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Login01Icon,
  MailAtSign01Icon,
  LockPasswordIcon,
} from "@hugeicons/core-free-icons";

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
    localStorage.setItem(
      "user",
      JSON.stringify({ email: data.email, role: data.role, name: data.name }),
    );
    window.dispatchEvent(new CustomEvent("auth-change"));
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="email"
            type="email"
            placeholder="moi@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <HugeiconsIcon icon={MailAtSign01Icon} size={20} />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel>Mot de passe</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <HugeiconsIcon icon={LockPasswordIcon} size={20} />
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Button
        size="lg"
        variant="default"
        type="submit"
        disabled={!isValid}
        className="w-full rounded-md text-white"
      >
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

"use client";
import { useEffect, useState } from "react";

export default function Greeting() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <div>
      <h1>Bonjour {user?.name}</h1>
      <p className="text-muted-foreground">Retrouvez vos rendez-vous ici</p>
    </div>
  );
}

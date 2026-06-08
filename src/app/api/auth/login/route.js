import bcrypt from "bcrypt";
import connect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  const { email, password } = await req.json();
  await connect();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Missing email or password" }),
      { status: 400 },
    );
  }

  // Vulnérable : pas de validation stricte sur body.email / body.password
  // Vulnérable (intentionnel) : utilisation directe des champs fournis
  // dans la requête MongoDB sans vérification / hashing. Ceci rend
  // possible l'exploitation par NoSQL injection, par ex. {"$ne": ""}.
  const user = await User.findOne({ email, password });
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 },
    );
  }
  const token = signToken({
    id: user._id,
    role: user.role,
  });
  return new Response(
    JSON.stringify({ token, role: user.role, email: user.email }),
    { status: 200 },
  );
}

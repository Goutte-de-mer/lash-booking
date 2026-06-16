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

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 401 },
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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
    JSON.stringify({
      token,
      role: user.role,
      email: user.email,
      name: user.name,
    }),
    { status: 200 },
  );
}

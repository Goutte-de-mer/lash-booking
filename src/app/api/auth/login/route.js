import bcrypt from "bcrypt";
import { z } from "zod";
import connect from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req) {
  let email, password;

  try {
    ({ email, password } = schema.parse(await req.json()));
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid email or password" }),
      { status: 400 },
    );
  }

  await connect();

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

  const token = signToken({ id: user._id, role: user.role });

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

import bcrypt from "bcrypt";
import connect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  const { name, email, password, role } = await req.json();
  await connect();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "Email already in use" }), {
      status: 400,
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
  return new Response(
    JSON.stringify({
      message: "User registered successfully",
      id: user._id,
      email: user.email,
      name: user.name,
    }),
    { status: 201 },
  );
}

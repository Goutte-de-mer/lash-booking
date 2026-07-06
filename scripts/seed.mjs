import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import Service from "../src/models/Service.js";
import WorkingHours from "../src/models/WorkingHours.js";

// Charge .env.local (dotenv n'est pas installé)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envFile = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf-8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI manquant dans .env.local");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connecté à MongoDB");

  await User.deleteMany({});
  await Service.deleteMany({});
  await WorkingHours.deleteMany({});
  console.log("Collections vidées");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const hashedAdmin = await bcrypt.hash("admin123", 10);

  await User.insertMany([
    {
      name: "Alice Dupont",
      email: "user1@test.local",
      password: hashedPassword,
      role: "user",
    },
    {
      name: "Béatrice Martin",
      email: "user2@test.local",
      password: hashedPassword,
      role: "user",
    },
    // VULN-03 — payload XSS stocké dans le champ name, s'exécute dans le dashboard admin
    {
      name: "<img src=x onerror=\"alert('XSS VULN-03')\">",
      email: "xss@test.local",
      password: hashedPassword,
      role: "user",
    },
    {
      name: "Admin",
      email: "admin@test.local",
      password: hashedAdmin,
      role: "admin",
    },
  ]);
  console.log("Utilisateurs créés");

  await Service.insertMany([
    {
      name: "Retouche",
      description: "Retouche sur pose existante",
      duration: 45,
      price: 45,
      depositAmount: 20,
    },
    {
      name: "Pose complète naturelle",
      description: "Pose complète cils naturels un à un",
      duration: 60,
      price: 65,
      depositAmount: 30,
    },
    {
      name: "Pose complète volume russe",
      description: "Pose complète effet volume russe",
      duration: 75,
      price: 85,
      depositAmount: 40,
    },
  ]);
  console.log("Prestations créées");

  await WorkingHours.insertMany([
    { dayOfWeek: 1, startTime: "10:00", endTime: "19:30", isActive: true },
    { dayOfWeek: 2, startTime: "10:00", endTime: "19:30", isActive: true },
    { dayOfWeek: 3, startTime: "10:00", endTime: "19:30", isActive: true },
    { dayOfWeek: 4, startTime: "10:00", endTime: "19:30", isActive: true },
    { dayOfWeek: 5, startTime: "10:00", endTime: "13:30", isActive: true },
    { dayOfWeek: 6, isActive: false },
    { dayOfWeek: 0, isActive: false },
  ]);
  console.log("Plages horaires créées");

  await mongoose.disconnect();
  console.log("Seed terminé ✓");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

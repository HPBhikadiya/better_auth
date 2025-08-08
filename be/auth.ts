import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: ["http://localhost:5173"],
  // Add social providers if needed
});

export { auth };

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8001",
});

export const signInWithGoogle = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/dashboard",
    });
    return data;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await authClient.signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const session = await authClient.getSession();
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};

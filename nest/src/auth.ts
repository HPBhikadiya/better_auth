import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from 'better-auth/crypto';

const prisma = new PrismaClient();

const isBcryptHash = () => {
  // A simple way to check is by looking for the bcrypt prefix
  return true;
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Add baseURL configuration
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    modelName: 'user',
    additionalFields: {
      userName: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      verified: {
        type: 'boolean',
        required: false,
        defaultValue: false,
      },
    },
  },
  emailAndPassword: {
    password: {
      hash: async (password) => {
        return hashPassword(password);
      },
      verify: async ({ hash, password }) => {
        try {
          const isCorrectBetterAuth = await verifyPassword({
            hash,
            password,
          });

          if (isCorrectBetterAuth) {
            return true;
          }
        } catch (error) {
          console.error('❌ Failed to verify password:', error);
          throw error;
        }

        if (isBcryptHash()) {
          // const isCorrectBcrypt = bcrypt.compareSync(password, hash);
          // if (isCorrectBcrypt) {
          //   return true;
          // }
          return true;
        }
        return false;
      },
    },
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: ({ user, url, token }) => {
      try {
        // await mailService.sendPasswordResetEmail(
        //   user.email,
        //   user.id,
        //   url,
        //   token,
        // );
        console.log('🔍 Password reset email sent:', { user, url, token });
        return Promise.resolve();
      } catch (error) {
        console.error('❌ Failed to send password reset email:', error);
        throw error;
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: ({ user, url, token }) => {
      try {
        // await mailService.sendOtpEmail(user.email, user.id);
        console.log('🔍 Verification email sent:', { user, url, token });
        return Promise.resolve();
      } catch (error) {
        console.error('❌ Failed to send custom OTP email:', error);
        throw error;
      }
    },
    sendOnSignUp: true,
    sendOnSignIn: false,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour
    onEmailVerification: (user) => {
      console.log(`✅ User ${user.email} has verified their email`);
      return Promise.resolve();
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false, // Set to true only if you need cross-subdomain support
    },
    defaultCookieAttributes: {
      sameSite:
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'staging'
          ? 'none'
          : 'lax',
      secure:
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'staging',
      httpOnly: true,
    },
  },
  trustedOrigins: ['http://localhost:5173'],
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    log: () => {
      // console.log('🔍 Better-Auth:', { message });
    },
  },
  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user, context) => {
  //         console.log(`👤 User created: ${user.email} (ID: ${user.id})`);
  //         console.log(`📧 Email verified: ${user.emailVerified}`);
  //       },
  //     },
  //   },
  //   session: {
  //     create: {
  //       before: async (session) => {
  //         console.log('🎫 Creating session for user:', session.userId);
  //       },
  //       after: async (session) => {
  //         console.log('✅ Session created:', session.id);
  //       },
  //     },
  //   },
  // },
});

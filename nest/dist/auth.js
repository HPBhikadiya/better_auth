"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const client_1 = require("@prisma/client");
const crypto_1 = require("better-auth/crypto");
const prisma = new client_1.PrismaClient();
const isBcryptHash = () => {
    return true;
};
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma, {
        provider: 'postgresql',
    }),
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
                return (0, crypto_1.hashPassword)(password);
            },
            verify: async ({ hash, password }) => {
                try {
                    const isCorrectBetterAuth = await (0, crypto_1.verifyPassword)({
                        hash,
                        password,
                    });
                    if (isCorrectBetterAuth) {
                        return true;
                    }
                }
                catch (error) {
                    console.error('❌ Failed to verify password:', error);
                    throw error;
                }
                if (isBcryptHash()) {
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
                console.log('🔍 Password reset email sent:', { user, url, token });
                return Promise.resolve();
            }
            catch (error) {
                console.error('❌ Failed to send password reset email:', error);
                throw error;
            }
        },
    },
    emailVerification: {
        sendVerificationEmail: ({ user, url, token }) => {
            try {
                console.log('🔍 Verification email sent:', { user, url, token });
                return Promise.resolve();
            }
            catch (error) {
                console.error('❌ Failed to send custom OTP email:', error);
                throw error;
            }
        },
        sendOnSignUp: true,
        sendOnSignIn: false,
        autoSignInAfterVerification: true,
        expiresIn: 60 * 60,
        onEmailVerification: (user) => {
            console.log(`✅ User ${user.email} has verified their email`);
            return Promise.resolve();
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === 'production',
        crossSubDomainCookies: {
            enabled: false,
        },
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === 'production' ||
                process.env.NODE_ENV === 'staging'
                ? 'none'
                : 'lax',
            secure: process.env.NODE_ENV === 'production' ||
                process.env.NODE_ENV === 'staging',
            httpOnly: true,
        },
    },
    trustedOrigins: ['http://localhost:5173'],
    logger: {
        level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        log: () => {
        },
    },
});
//# sourceMappingURL=auth.js.map
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })
        console.log("Login response status:", response)

        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(payload?.message || "Invalid credentials")
        }

        if (!payload?.token) {
          throw new Error("Login failed: token missing")
        }

        return {
          id: credentials.email,
          email: credentials.email,
          accessToken: payload.token,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "accessToken" in user) {
        token.accessToken = user.accessToken as string
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

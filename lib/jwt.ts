import { SignJWT, jwtVerify } from "jose"
import { env } from "@/lib/env-config"

const secret = new TextEncoder().encode(env.jwt.secretKey)

export async function signJWT(payload: any) {
  if (!env.jwt.secretKey) {
    throw new Error("JWT secret key not configured")
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${env.jwt.expireMinutes}m`)
    .sign(secret)
}

export async function verifyJWT(token: string) {
  if (!env.jwt.secretKey) {
    throw new Error("JWT secret key not configured")
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export function getJWTFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }
  return null
}

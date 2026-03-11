import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret-in-production-min-32-chars!!"
);

const ALGORITHM = "HS256";
const EXPIRY = "8h";

export interface JWTPayload {
  sub: string; // username
  iat: number;
  exp: number;
}

export async function signToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: [ALGORITHM],
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
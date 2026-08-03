import { dbPool } from "../db/pool";
import * as schema from "../schema/schema";
import * as jose from 'jose';  // Import jose for JWT handling
import bcrypt from 'bcrypt';


export async function createUser(User: schema.User) {
          return await dbPool.query(
                `INSERT INTO users 
                        (email,
                        name,
                        password_hash,
                        role)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (email) DO NOTHING
                 RETURNING email, name, role`, [User.email, User.name, User.passwordHash, "user"]
            );
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust as needed for security/performance
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function findUser(User: schema.User) {
  return await dbPool.query(
    `SELECT * FROM
        users
        WHERE email = $1`,
        [User.email]
  );
}

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? '1c64d36d4ff13de3986edd74b645313644a6f3cdb589f2630300ae2cb07248bb'  // Use a strong secret key in production
)

export async function generateJWT(User: schema.User) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? '1c64d36d4ff13de3986edd74b645313644a6f3cdb589f2630300ae2cb07248bb'  // Use a strong secret key in production
  )
  const alg = 'HS256'

  const jwt = await new jose.SignJWT(User)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(process.env.JWT_ISSUER ?? 'http://localhost:3000')
    .setSubject('api')
    .setAudience(process.env.JWT_AUDIENCE ?? 'userOfTasksAPI')
    .setExpirationTime('2h')
    .sign(secret);

  return jwt;
}

export async function verifyJWT(jwt: string) {
  
  const verificationData = await jose.jwtVerify(jwt, secret, {
    issuer: process.env.JWT_ISSUER ?? 'http://localhost:3000',
    audience: process.env.JWT_AUDIENCE ?? 'userOfTasksAPI',
  });

  return verificationData.payload;
}
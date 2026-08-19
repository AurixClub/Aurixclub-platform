import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordService {
  /**
   * Hashes a password with a unique salt
   */
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString("hex")}`;
  }

  /**
   * Compares a plaintext password with a hashed password
   */
  async compare(password: string, hash: string): Promise<boolean> {
    try {
      const [salt, key] = hash.split(":");
      if (!salt || !key) return false;

      const keyBuffer = Buffer.from(key, "hex");
      const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

      return timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }
}

export const passwordService = new PasswordService();

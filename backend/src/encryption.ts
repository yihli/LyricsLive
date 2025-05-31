import crypto from 'crypto';
import 'dotenv/config'
import { z } from 'zod';

const key = z.string().parse(process.env.CRYPTO_KEY); // Store this securely (e.g. in env)
const iv = crypto.randomBytes(12);  // 12 bytes for GCM

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return [iv.toString('hex'), cipher.getAuthTag().toString('hex'), enc.toString('hex')].join('.');
};

const decrypt = (data: string) => {
  const [ivHex, tagHex, encHex] = data.split('.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8');
};

export default {
    encrypt, decrypt
}
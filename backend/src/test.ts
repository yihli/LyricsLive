import crypto from './encryption';

const token = '1234';

const encrypted = crypto.encrypt(token);
console.log('Encrypted token:', crypto.encrypt(encrypted));
console.log('Decrypted token:', crypto.decrypt(encrypted));
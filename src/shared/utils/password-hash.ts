import * as bcrypt from 'bcrypt';

export async function createCodeHash(code) {
  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  return bcrypt.hash(code, salt);
}

export async function verifyCode(code, hash) {
  return bcrypt.compare(code, hash);
}

import * as bcrypt from 'bcrypt';

export async function createHashPassword(password) {
  // Generate a salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

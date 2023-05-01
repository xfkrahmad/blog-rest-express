import bcrypt from 'bcrypt';

export const hashPassword = async (plainTextPassword) => {
  const hash = await bcrypt.hash(plainTextPassword, 10);
  return hash;
};

export const comparePassword = async (plainTextPassword, hash) => {
  const result = await bcrypt.compare(plainTextPassword, hash);
  return result;
};

import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export const verifyPassword = (userPassword: string, hashPassword: string) => {
  return bcrypt.compare(userPassword, hashPassword);
};

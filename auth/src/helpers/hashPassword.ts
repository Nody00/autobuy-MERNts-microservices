import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = 14;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPasword = await bcrypt.hash(password, salt);

  return `${hashedPasword}${salt}`;
};

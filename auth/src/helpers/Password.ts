import bcrypt from "bcrypt";
export class Password {
  static async hashPassword(password: string) {
    const saltRounds = 14;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPasword = await bcrypt.hash(password, salt);

    return hashedPasword;
  }

  static async comparePasswords(
    providedPassword: string,
    hashedPassword: string
  ) {
    const result = await bcrypt.compare(providedPassword, hashedPassword);

    return result;
  }
}

import bcrypt from "bcryptjs";

const plainPassword = "admin678@lex";

const hashedPassword = await bcrypt.hash(
  plainPassword,
  10
);

console.log(hashedPassword);
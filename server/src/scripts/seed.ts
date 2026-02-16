import { envVars } from "../app/config/env";
import { User } from "../app/modules/user/user.model";
import { Role } from "../app/modules/user/user.interface";
import bcryptjs from "bcryptjs";

export const seedAdminUser = async () => {
  try {
    const adminEmail = "admin@example.com";
    const userEmail = "user@example.com";
    const password = "123456";
    const hashedPassword = await bcryptjs.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    // Check if Admin exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: "Demo Admin",
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        auths: [{ provider: "credentials", providerId: adminEmail }],
      });
      console.log("Admin created: admin@example.com / 123456");
    }

    // Check if User exists
    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      await User.create({
        name: "Demo User",
        email: userEmail,
        password: hashedPassword,
        role: Role.USER,
        auths: [{ provider: "credentials", providerId: userEmail }],
      });
      console.log("User created: user@example.com / 123456");
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};

import { UserModel } from "../db/users";

export const seedUsers = async () => {
  const users = [
    {
      email: "johndoe@mail.com",
      username: "johndoe",
      password: "pass",
    },
    {
      email: "janedoe@mail.com",
      username: "janedoe",
      password: "pass",
    },
  ];

  try {
    await UserModel.deleteMany({});
    await UserModel.insertMany(users);
    console.log("Users seeded");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};

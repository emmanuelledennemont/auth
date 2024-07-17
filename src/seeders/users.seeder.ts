import { ClientModel } from "@/db/models/client.model";
import { TechnicianModel } from "@/db/models/technician.model";
import { UserModel } from "@/db/models/user.model";
import { authentication, random } from "@/helpers/index";
import { faker } from "@faker-js/faker";

export const seedUsers = async () => {
  const clients: any[] = [];
  const technicians: any[] = [];

  for (let i = 0; i < 10; i++) {
    const salt = random();
    const password = faker.internet.password();

    clients.push({
      _id: undefined,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: password,
      role: "Client",
      favorites: [],
      repairList: [],
      saving: [],
      authentication: {
        salt: salt,
        password: authentication(salt, password),
      },
    });
  }

  // Générer 10 techniciens
  for (let i = 0; i < 10; i++) {
    const salt = random();
    const password = faker.internet.password();

    technicians.push({
      _id: undefined,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: password,
      role: "Technician",
      bio: faker.lorem.paragraph(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      },
      openingHours: [
        { day: "Monday", open: "09:00", close: "17:00" },
        { day: "Tuesday", open: "09:00", close: "17:00" },
        { day: "Wednesday", open: "09:00", close: "17:00" },
        { day: "Thursday", open: "09:00", close: "17:00" },
        { day: "Friday", open: "09:00", close: "17:00" },
      ],
      repairingCategories: [
        faker.commerce.department(),
        faker.commerce.department(),
      ],
      rating: {
        score: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        reviews: faker.number.int({ min: 1, max: 100 }),
      },
      authentication: {
        salt: salt,
        password: authentication(salt, password),
      },
    });
  }

  try {
    await UserModel.deleteMany({});
    await ClientModel.deleteMany({});
    await TechnicianModel.deleteMany({});

    await ClientModel.insertMany(clients);
    await TechnicianModel.insertMany(technicians);

    console.log("Clients and Technicians seeded");
  } catch (error) {
    console.error("Error seeding clients and technicians:", error);
  }
};

import { ClientModel } from "@/db/models/client.model";
import { TechnicianModel } from "@/db/models/technician.model";
import { UserModel } from "@/db/models/user.model";
import { authentication, random } from "@/helpers/index";
import { faker } from "@faker-js/faker";

export const seedUsers = async () => {
  const clientCount = await ClientModel.countDocuments();
  const technicianCount = await TechnicianModel.countDocuments();

  if (clientCount > 0 || technicianCount > 0) {
    console.log("Clients and/or Technicians already exist, skipping seeding.");
    return;
  }

  const clients: any[] = [];
  const technicians: any[] = [];

  for (let i = 0; i < 10; i++) {
    const salt = random();
    const password = faker.internet.password();

    clients.push({
      _id: undefined,
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      profileImage: faker.image.url(),
      phone: faker.phone.number(),
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

  // Liste des catégories restreintes
  const categories = [
    "Grand Electromenager",
    "Petit Electromenager",
    "Devices",
    "Mobilité",
  ];

  // Générer 10 techniciens
  for (let i = 0; i < 10; i++) {
    const salt = random();
    const password = faker.internet.password();

    technicians.push({
      _id: undefined,
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      phone: faker.phone.number(),
      username: faker.internet.userName(),
      password: password,
      role: "Technician",
      bio: faker.lorem.paragraph(),
      sirene: faker.string.alphanumeric(9),
      profileImage: faker.image.url(),
      address: {
        addressLine: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        coordinates: {
          type: "Point",
          coordinates: [faker.location.longitude(), faker.location.latitude()],
        },
      },
      categories: categories
        .slice(0, faker.number.int({ min: 1, max: categories.length }))
        .map((name) => ({
          name,
          image: faker.image.url(),
          slug: name.toLowerCase().replace(/ /g, "-"),
        })),
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
      authentication: {
        salt: salt,
        password: authentication(salt, password),
      },
    });
  }

  try {
    await UserModel.deleteMany({});
    await ClientModel.insertMany(clients);
    await TechnicianModel.insertMany(technicians);

    console.log("Clients and Technicians seeded");
  } catch (error) {
    console.error("Error seeding clients and technicians:", error);
  }
};

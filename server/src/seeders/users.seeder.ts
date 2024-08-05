import { ClientModel } from "@/db/models/client.model";
import { TechnicianModel } from "@/db/models/technician.model";
import { UserModel } from "@/db/models/user.model";
import { authentication, random } from "@/helpers/index";
import { faker } from "@faker-js/faker";

export const seedUsers = async (force = false) => {
  const clientCount = await ClientModel.countDocuments();
  const technicianCount = await TechnicianModel.countDocuments();

  if ((clientCount > 0 || technicianCount > 0) && !force) {
    console.log(
      "👥 Clients and/or Technicians already exist. Use force option to reseed."
    );
    return;
  }

  // Définition des catégories
  const categories = [
    {
      _id: "66b114926397e0eb47e720d1",
      name: "Grand Electromenager",
      image: "https://example.com/images/grand-electromenager.jpg",
      slug: "grand-electromenager",
    },
    {
      _id: "66b1159a2aafbdcb004391e2",
      name: "Petit 'Electroménager",
      image: "https://example.com/images/petit-electromenager.jpg",
      slug: "petit-electromenager",
    },
    {
      _id: "66b115a02aafbdcb004391e6",
      name: "Devices",
      image: "https://example.com/images/devices.jpg",
      slug: "devices",
    },
    {
      _id: "66b115a62aafbdcb004391ea",
      name: "E-Mobilité",
      image: "https://example.com/images/e-mobilite.jpg",
      slug: "e-mobilite",
    },
  ];

  const clients: any[] = [];
  const technicians: any[] = [];

  // Le code pour créer les clients reste inchangé
  for (let i = 0; i < 10; i++) {
    // ... (code pour créer les clients)
  }

  // Générer 10 techniciens
  for (let i = 0; i < 10; i++) {
    const salt = random();
    const password = faker.internet.password();

    // Sélectionner un nombre aléatoire de catégories pour ce technicien
    const selectedCategories = faker.helpers.arrayElements(
      categories,
      faker.number.int({ min: 1, max: categories.length })
    );

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
      categories: selectedCategories.map((cat) => cat._id), // Utiliser seulement les IDs des catégories
      openingHours: [
        { day: "Monday", open: "09:00", close: "17:00" },
        { day: "Tuesday", open: "09:00", close: "17:00" },
        { day: "Wednesday", open: "09:00", close: "17:00" },
        { day: "Thursday", open: "09:00", close: "17:00" },
        { day: "Friday", open: "09:00", close: "17:00" },
      ],
      authentication: {
        salt: salt,
        password: authentication(salt, password),
      },
    });
  }

  try {
    if (force) {
      await UserModel.deleteMany({});
      await ClientModel.deleteMany({});
      await TechnicianModel.deleteMany({});
      console.log("Existing data cleared.");
    }
    await ClientModel.insertMany(clients);
    await TechnicianModel.insertMany(technicians);

    console.log("Clients and Technicians seeded successfully.");
  } catch (error) {
    console.error("Error seeding clients and technicians:", error);
  }
};

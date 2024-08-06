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
      subCategories: [
        {
          _id: "66b11b9a0b8e5a5d51d08f47",
          name: "Lave-Linge",
          slug: "lave-linge",
        },
        {
          _id: "66b2555695a5d33cd2a899bf",
          name: "Lave-Vaisselle",
          slug: "lave-vaisselle",
        },
        { _id: "66b2556495a5d33cd2a899c8", name: "Frigo", slug: "frigo" },
        {
          _id: "66b2556f95a5d33cd2a899d2",
          name: "Congélateur",
          slug: "congelateur",
        },
      ],
    },
    {
      _id: "66b1159a2aafbdcb004391e2",
      name: "Petit Electroménager",
      image: "https://example.com/images/petit-electromenager.jpg",
      slug: "petit-electromenager",
      subCategories: [],
    },
    {
      _id: "66b115a02aafbdcb004391e6",
      name: "Devices",
      image: "https://example.com/images/devices.jpg",
      slug: "devices",
      subCategories: [],
    },
    {
      _id: "66b115a62aafbdcb004391ea",
      name: "E-Mobilité",
      image: "https://example.com/images/e-mobilite.jpg",
      slug: "e-mobilite",
      subCategories: [],
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

    // Créer la structure de catégories pour le technicien avec des sous-catégories aléatoires
    const technicianCategories = selectedCategories.map((category) => {
      const selectedSubCategories =
        category.subCategories.length > 0
          ? faker.helpers.arrayElements(
              category.subCategories,
              faker.number.int({ min: 0, max: category.subCategories.length })
            )
          : [];

      return {
        _id: category._id,
        name: category.name,
        image: category.image,
        slug: category.slug,
        subCategories: selectedSubCategories.map((subCat) => ({
          _id: subCat._id,
          name: subCat.name,
          slug: subCat.slug,
        })),
      };
    });

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
      categories: technicianCategories,
      openingHours: [
        {
          day: "Monday",
          slots: [
            {
              start: "2024-08-05T09:00:00+02:00",
              end: "2024-08-05T12:00:00+02:00",
            },
            {
              start: "2024-08-05T14:00:00+02:00",
              end: "2024-08-05T18:00:00+02:00",
            },
          ],
        },
        {
          day: "Tuesday",
          slots: [
            {
              start: "2024-08-06T09:00:00+02:00",
              end: "2024-08-06T12:00:00+02:00",
            },
            {
              start: "2024-08-06T14:00:00+02:00",
              end: "2024-08-06T18:00:00+02:00",
            },
          ],
        },
        {
          day: "Wednesday",
          slots: [
            {
              start: "2024-08-07T09:00:00+02:00",
              end: "2024-08-07T12:00:00+02:00",
            },
            {
              start: "2024-08-07T14:00:00+02:00",
              end: "2024-08-07T18:00:00+02:00",
            },
          ],
        },
        {
          day: "Thursday",
          slots: [
            {
              start: "2024-08-08T09:00:00+02:00",
              end: "2024-08-08T12:00:00+02:00",
            },
            {
              start: "2024-08-08T14:00:00+02:00",
              end: "2024-08-08T18:00:00+02:00",
            },
          ],
        },
        {
          day: "Friday",
          slots: [
            {
              start: "2024-08-09T09:00:00+02:00",
              end: "2024-08-09T12:00:00+02:00",
            },
            {
              start: "2024-08-09T14:00:00+02:00",
              end: "2024-08-09T18:00:00+02:00",
            },
          ],
        },
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

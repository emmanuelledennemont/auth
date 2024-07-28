import { ClientModel } from "../db/models/client.model";

export const getAllClients = () => {
  return ClientModel.find()
    .select("-authentication -__v -__t")
    .then((clients) => clients.map((client) => client.toObject()));
};

export const getClient = (id: string) => {
  return ClientModel.findById(id)
    .select("-authentication -__v -__t")
    .then((client) => client?.toObject());
};

export const createUserWithClientRole = (values: Record<string, any>) => {
  return new ClientModel(values).save().then((client) => client.toObject());
};

export const updateClient = (id: string, values: Record<string, any>) => {
  return ClientModel.findByIdAndUpdate(id, values, { new: true })
    .select("-authentication -__v -__t")
    .then((client) => client?.toObject());
};

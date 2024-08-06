import { ClientModel } from "../db/models/client.model";

const getAll = () => {
  return ClientModel.find()
    .select("-authentication -__v -__t")
    .then((clients) => clients.map((client) => client.toObject()));
};

const get = (id: string) => {
  return ClientModel.findById(id)
    .select("-authentication -__v -__t")
    .then((client) => client?.toObject());
};

const createUserWithClientRole = (values: Record<string, any>) => {
  return new ClientModel(values).save().then((client) => client.toObject());
};

const update = (id: string, values: Record<string, any>) => {
  return ClientModel.findByIdAndUpdate(id, values, { new: true })
    .select("-authentication -__v -__t")
    .then((client) => client?.toObject());
};

export default {
  getAll,
  get,
  createUserWithClientRole,
  update,
};

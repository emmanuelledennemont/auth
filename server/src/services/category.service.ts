import { CategoryModel } from "@/db/models/category.model";

const getAll = () => {
  return CategoryModel.find()
    .select("-__v")
    .then((categories) => categories.map((category) => category.toObject()));
};

const get = (id: string) => {
  return CategoryModel.findById(id)
    .select("-__v")
    .then((category) => category?.toObject());
};

const create = (values: Record<string, any>) => {
  return new CategoryModel(values)
    .save()
    .then((category) => category.toObject());
};

const update = (id: string, values: Record<string, any>) => {
  return CategoryModel.findByIdAndUpdate(id, values, { new: true })
    .select("-__v")
    .then((category) => category?.toObject());
};

const remove = (id: string) => {
  return CategoryModel.findByIdAndDelete(id)
    .select("-__v")
    .then((category) => category?.toObject());
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
};

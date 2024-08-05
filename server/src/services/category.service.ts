import { CategoryModel } from "@/db/models/category.model";

export const getAllCategories = () => {
  return CategoryModel.find()
    .select("-__v")
    .then((categories) => categories.map((category) => category.toObject()));
};

export const getCategory = (id: string) => {
  return CategoryModel.findById(id)
    .select("-__v")
    .then((category) => category?.toObject());
};

export const createCategory = (values: Record<string, any>) => {
  return new CategoryModel(values)
    .save()
    .then((category) => category.toObject());
};

export const updateCategory = (id: string, values: Record<string, any>) => {
  return CategoryModel.findByIdAndUpdate(id, values, { new: true })
    .select("-__v")
    .then((category) => category?.toObject());
};

export const deleteCategory = (id: string) => {
  return CategoryModel.findByIdAndDelete(id)
    .select("-__v")
    .then((category) => category?.toObject());
};

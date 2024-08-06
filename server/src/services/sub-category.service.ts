import { CategoryModel } from "@/db/models/category.model";
import { SubCategoryModel } from "@/db/models/sub-category.model";

export const getAllSubCategories = () => {
  return SubCategoryModel.find()
    .select("-__v")
    .then((subcategories) =>
      subcategories.map((subcategories) => subcategories.toObject())
    );
};

export const getSubCategory = (id: string) => {
  return SubCategoryModel.findById(id)
    .select("-__v")
    .then((subcategories) => subcategories?.toObject());
};

export const createSubCategory = async (
  parentId: string,
  values: Record<string, any>
) => {
  const parentCategory = await CategoryModel.findById(parentId);
  if (!parentCategory) {
    throw new Error("Parent category not found");
  }

  const subCategory = new SubCategoryModel({
    ...values,
    parentCategory: parentId,
  });

  const savedSubCategory = await subCategory.save();

  // Update parent category to include the new subcategory
  parentCategory.sub_categories.push(savedSubCategory.toObject());
  await parentCategory.save();

  return savedSubCategory.toObject();
};

export const updateSubCategory = (id: string, values: Record<string, any>) => {
  return SubCategoryModel.findByIdAndUpdate(id, values, { new: true })
    .select("-__v")
    .then((subcategories) => subcategories?.toObject());
};

export const deleteSubCategory = (id: string) => {
  return SubCategoryModel.findByIdAndDelete(id)
    .select("-__v")
    .then((subcategories) => subcategories?.toObject());
};

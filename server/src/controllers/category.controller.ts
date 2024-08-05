import { Request, Response } from "express";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "@/services/category.service";

import { createSubCategory } from "@/services/sub-category.service";

export const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await getCategory(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found." });
    }
  } catch (error) {
    console.error("Error getting category by id:", error);
    res.status(500).json({ message: "Failed to retrieve category." });
  }
};

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await createCategory(req.body);
    res.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category." });
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found." });
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category." });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await deleteCategory(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Category not found." });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category." });
  }
};

export const createSubCategoryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { parentId } = req.params;
    const subCategory = await createSubCategory(parentId, req.body);
    res.status(201).json(subCategory);
  } catch (error: any) {
    console.error("Error creating subcategory:", error);
    if (error.message === "Parent category not found") {
      res.status(404).json({ message: "Parent category not found." });
    } else {
      res.status(500).json({ message: "Failed to create subcategory." });
    }
  }
};

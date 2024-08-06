import { Request, Response } from "express";

import { Category, SubCategory } from "@/services";

const getCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ message: "Failed to retrieve categories." });
  }
};

const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const category = await Category.get(req.params.id);
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

const createCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category." });
  }
};

const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await Category.update(req.params.id, req.body);
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

const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const category = await Category.remove(req.params.id);
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

const createSubCategoryController = async (req: Request, res: Response) => {
  try {
    const { parentId } = req.params;
    const subCategory = await SubCategory.create(parentId, req.body);
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

export default {
  createCategoryController,
  createSubCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
};

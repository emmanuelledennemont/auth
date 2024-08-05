import {
  createCategoryController,
  deleteCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "@/controllers/category.controller";
import express from "express";

export default (router: express.Router) => {
  router.get("/categories", getCategoriesController);
  router.post("/categories", createCategoryController);
  router.get("/categories/:id", getCategoryByIdController);
  router.patch("/categories/:id", updateCategoryController);
  router.delete("/categories/:id", deleteCategoryController);

  return router;
};

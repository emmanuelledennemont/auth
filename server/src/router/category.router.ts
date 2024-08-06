import { Category } from "@/controllers";

import express from "express";

export default (router: express.Router) => {
  router.get("/categories", Category.getCategoriesController);
  router.post("/categories", Category.createCategoryController);
  router.get("/categories/:id", Category.getCategoryByIdController);
  router.patch("/categories/:id", Category.updateCategoryController);
  router.delete("/categories/:id", Category.deleteCategoryController);

  router.post(
    "/categories/:parentId/subcategories",
    Category.createSubCategoryController
  );

  return router;
};

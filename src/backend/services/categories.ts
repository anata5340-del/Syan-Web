import { CategoryPayload } from "@/backend/types";
import { models } from "@/backend/mongo/models";

export const getCategory = (id: string) => models.Categories.findById(id);

export const getCategories = () => models.Categories.find();

export const createCategory = (data: CategoryPayload) => {
  return models.Categories.create(data);
};

export const updateCategory = (id: string, data: CategoryPayload) =>
  models.Categories.findByIdAndUpdate(id, data, { new: true });

export const deleteCategory = (id: string) =>
  models.Categories.findByIdAndDelete(id);

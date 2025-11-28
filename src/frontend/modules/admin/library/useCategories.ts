import { Category } from "@/backend/types";
import axios from "axios";
import { useState, useEffect } from "react";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = () => {
    axios
      .get(`/api/categories`)
      .then(({ data }) => {
        const { categories } = data;
        setCategories(categories);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteCategory = (id: string) => {
    axios
      .delete(`/api/categories/${id}`)
      .then(getCategories)
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeleteCategory = (id: string) => deleteCategory(id);

  useEffect(() => getCategories(), []);

  return { categories, handleDeleteCategory, refetchCategories: getCategories };
};

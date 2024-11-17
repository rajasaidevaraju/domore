'use client';

import React, { useState } from "react";
import Card from "./CommonCard";
import { Category } from "./types";

const CategoriesCard = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Category1" },
    { id: 2, name: "Category2" },
    { id: 3, name: "Category3" },
  ]);

  const handleAddCategories = (newCategories: Category[]) => {
    setCategories((prev) => [...prev, ...newCategories]);
  };

  const handleDeleteCategories = (selectedIds: Set<number>) => {
    setCategories((prev) =>
      prev.filter((category) => !selectedIds.has(category.id))
    );
  };

  return (
    <Card
      items={categories}
      onAdd={handleAddCategories}
      onDelete={handleDeleteCategories}
      label="Categories"
    />
  );
};

export default CategoriesCard;

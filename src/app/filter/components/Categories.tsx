'use client';

import React, { useState } from "react";
import Card from "./CommonCard";
import { Category,CardProps } from "@/app/types/Types";

const CategoriesCard: React.FC<CardProps> = ({ isLoggedIn })=>{
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "category1" },
    { id: 2, name: "category2" },
    { id: 3, name: "category3" },
  ]);

  const handleAddCategories = (names: string[]) => {
   // TODO: Add new categories to the list
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
      isLoggedIn={isLoggedIn}
      loading={false}
    />
  );
};

export default CategoriesCard;

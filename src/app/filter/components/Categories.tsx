'use client';

import React, { useState } from "react";
import Card from "./CommonCard";
import { ItemWithCount, CardProps } from "@/app/types/Types";

const CategoriesCard: React.FC<CardProps> = ({ }) => {
  const [categories, setCategories] = useState<ItemWithCount[]>([
    { id: 1, name: "category1", count: 0 },
    { id: 2, name: "category2", count: 0 },
    { id: 3, name: "category3", count: 0 },
  ]);

  const handleAddCategories = async (names: string[]) => {
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
      loading={false}
      shouldAnimate={false}
    />
  );
};

export default CategoriesCard;

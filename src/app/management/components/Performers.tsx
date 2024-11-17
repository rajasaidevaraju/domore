'use client';

import React, { useState } from "react";
import { Performer } from "./types";
import Card from "./CommonCard";

const PerformersCard = () => {
  const [performers, setPerformers] = useState<Performer[]>([
    { id: 1, name: "TestName1" },
    { id: 2, name: "TestName2" },
    { id: 3, name: "TestName3" },
  ]);

  const handleAddPerformers = (newPerformers: Performer[]) => {
    setPerformers((prev) => [...prev, ...newPerformers]);
  };

  const handleDeletePerformers = (selectedIds: Set<number>) => {
    setPerformers((prev) =>
      prev.filter((performer) => !selectedIds.has(performer.id))
    );
  };

  return (
    <Card
      items={performers}
      onAdd={handleAddPerformers}
      onDelete={handleDeletePerformers}
      label="Performers"
    />
  );
};

export default PerformersCard;

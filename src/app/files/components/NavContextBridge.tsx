"use client";

import { useEffect } from "react";
import { useNavStore } from "@/app/store/navigation";
import { FileFilters } from "@/app/files/filterParams";

export default function NavContextBridge({ filters }: { filters: FileFilters }) {
  const setFilters = useNavStore((state) => state.setFilters);

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useNavStore } from "@/app/store/navigation";

interface Props {
  page: number;
  performerId: number | null;
  sortBy:string|undefined
  unassignedOnly: boolean;
}

export default function NavContextBridge({ page, performerId, sortBy, unassignedOnly }: Props) {
  const setNavContext = useNavStore((state) => state.setNavContext);

  useEffect(() => {
    setNavContext(page, performerId, sortBy, unassignedOnly);
  }, [page, performerId, sortBy, unassignedOnly, setNavContext]);

  return null;
}

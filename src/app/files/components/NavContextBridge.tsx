"use client";

import { useEffect } from "react";
import { useNavStore } from "@/app/store/navigation";

interface Props {
  page: number;
  performerId: number | null;
  sortBy:string|undefined
}

export default function NavContextBridge({ page, performerId, sortBy }: Props) {
  const setNavContext = useNavStore((state) => state.setNavContext);

  useEffect(() => {
    setNavContext(page, performerId, sortBy);
  }, [page, performerId, sortBy, setNavContext]);

  return null;
}

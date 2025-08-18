"use client";

import { useEffect } from "react";
import { useNavStore } from "@/app/store/navigation";

interface Props {
  page: number;
  performerId: number | null;
}

export default function NavContextBridge({ page, performerId }: Props) {
  const setNavContext = useNavStore((state) => state.setNavContext);

  useEffect(() => {
    setNavContext(page, performerId);
  }, [page, performerId, setNavContext]);

  return null;
}

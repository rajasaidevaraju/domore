"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Files.module.css";

export default function UnassignedFilterToggle({ active }: { active: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggle() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (active) {
      params.delete("unassigned");
    } else {
      params.set("unassigned", "true");
      // a performer filter would contradict this one
      params.delete("performerId");
    }
    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  }

  return (
    <button
      type="button"
      className={`${styles.filterToggle} ${active ? styles.filterToggleActive : ""}`}
      onClick={toggle}
      aria-pressed={active}
    >
      No performer
    </button>
  );
}

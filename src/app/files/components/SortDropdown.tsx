"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "../Files.module.css";

export default function SortDropdown({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSort = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className={styles.controlDiv}>
      <select
        className={styles.sortSelect}
        value={selected}
        onChange={onSortChange}
      >
        <optgroup label="Date">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </optgroup>

        <optgroup label="File Size">
          <option value="size-asc">Smallest</option>
          <option value="size-desc">Largest</option>
        </optgroup>

        <optgroup label="Name">
          <option value="name-asc">A to Z</option>
          <option value="name-desc">Z to A</option>
        </optgroup>
      </select>
    </div>
  );
}

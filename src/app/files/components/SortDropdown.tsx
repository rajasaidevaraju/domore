"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "../Files.module.css";

const SORT_OPTIONS = [
  {
    group: "Date", options: [
      { label: "Latest", value: "latest" },
      { label: "Oldest", value: "oldest" }
    ]
  },
  {
    group: "File Size", options: [
      { label: "Smallest", value: "size-asc" },
      { label: "Largest", value: "size-desc" }
    ]
  },
  {
    group: "Name", options: [
      { label: "A to Z", value: "name-asc" },
      { label: "Z to A", value: "name-desc" }
    ]
  }
];

export default function SortDropdown({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.flatMap(g => g.options).find(o => o.value === selected) || { label: "Latest", value: "latest" };

  function onSortChange(newSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    params.delete("page");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.controlDiv}>
      <span className={styles.sortLabel}>Sort by:</span>
      <div className={styles.customDropdown} ref={dropdownRef}>
        <div
          className={`${styles.dropdownTrigger} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption.label}</span>
          <img
            src="/svg/right.svg"
            className={styles.dropdownIcon}
            alt=""
            style={{ transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
          />
        </div>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            {SORT_OPTIONS.map((group) => (
              <div key={group.group}>
                <div className={styles.dropdownGroupLabel}>{group.group}</div>
                {group.options.map((option) => (
                  <div
                    key={option.value}
                    className={`${styles.dropdownItem} ${selected === option.value ? styles.selected : ""}`}
                    onClick={() => onSortChange(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

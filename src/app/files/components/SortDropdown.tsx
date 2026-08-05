"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "../Files.module.css";
import { FileFilters, filesUrl } from "../filterParams";

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

export default function SortDropdown({ filters }: { filters: FileFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = filters.sortBy ?? "latest";
  const selectedOption = SORT_OPTIONS.flatMap(g => g.options).find(o => o.value === selected) || { label: "Latest", value: "latest" };

  function onSortChange(newSort: string) {
    // a new ordering invalidates the current page offset
    router.push(filesUrl(pathname, { ...filters, sortBy: newSort, page: 1 }));
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
    <div className={styles.sortControl}>
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

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import styles from "../Files.module.css";
import { FileFilters, filesUrl } from "../filterParams";
import { Item } from "@/app/types/Types";

interface PerformerFilterProps {
  filters: FileFilters;
  performers: Item[];
}

export default function PerformerFilter({ filters, performers }: PerformerFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { performerId, unassignedOnly } = filters;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectFilter(next: Partial<FileFilters>) {
    // any filter change invalidates the current page offset
    router.push(filesUrl(pathname, { ...filters, ...next, page: 1 }));
    setIsOpen(false);
  }

  let triggerLabel = "All";
  if (unassignedOnly) {
    triggerLabel = "No performer";
  } else if (performerId != null) {
    const match = performers.find((performer) => performer.id === performerId);
    triggerLabel = match ? match.name : `#${performerId}`;
  }

  return (
    <div className={styles.sortControl}>
      <span className={styles.sortLabel}>Performer:</span>
      <div className={styles.customDropdown} ref={dropdownRef}>
        <div
          className={`${styles.dropdownTrigger} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.triggerLabel} title={triggerLabel}>{triggerLabel}</span>
          <img
            src="/svg/right.svg"
            className={styles.dropdownIcon}
            alt=""
            style={{ transform: isOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }}
          />
        </div>

        {isOpen && (
          <div className={`${styles.dropdownMenu} ${styles.dropdownMenuScroll}`}>
            <div
              className={`${styles.dropdownItem} ${performerId == null && !unassignedOnly ? styles.selected : ""}`}
              onClick={() => selectFilter({ performerId: null, unassignedOnly: false })}
            >
              All
            </div>
            <div
              className={`${styles.dropdownItem} ${unassignedOnly ? styles.selected : ""}`}
              onClick={() => selectFilter({ performerId: null, unassignedOnly: true })}
            >
              No performer
            </div>

            {performers.length > 0 ? (
              <>
                <div className={styles.dropdownGroupLabel}>Performers</div>
                {performers.map((performer) => (
                  <div
                    key={performer.id}
                    className={`${styles.dropdownItem} ${performerId === performer.id ? styles.selected : ""}`}
                    onClick={() => selectFilter({ performerId: performer.id, unassignedOnly: false })}
                  >
                    {performer.name}
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.dropdownEmpty}>No performers yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState , useEffect, useRef} from "react";
import styles from "./AddPanel.module.css";

interface AddPanelProps<T extends { id: number; name: string }> {
  onClose: () => void;
  onSave: (names: string [])  => void;
  label: string;
}

const AddPanel = <T extends { id: number; name: string }>({
  onClose,
  onSave,
  label,
}: AddPanelProps<T>) => {

  const [entries, setEntries] = useState<string[]>([""]); // Initial entry input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose(); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = value;
    setEntries(updatedEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, ""]);
  };

  const handleSave = () => {
    const validEntries = entries.filter((entry) => entry.trim() !== "");
    if (validEntries.length === 0) {
      alert("Please add at least one valid entry.");
      return;
    }

    onSave(validEntries);
    onClose();
  };

  const placeholder=`New ${label === 'Categories' ? 'Category' : label.slice(0, -1)}`

  return (
      <div className={styles.panel}>
        <h2 className={styles.row}>{`Add ${label}`}</h2>
        <div className={styles.row}>
          {entries.map((entry, index) => (
            <input
              key={index}
              ref={index === 0 ? firstInputRef : null}
              type="text"
              value={entry}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`} // Dynamic placeholder
              className={styles.input}
            />
          ))}
        </div>
        <div className={styles.actions}>
        <button className={styles.commonButton} onClick={handleAddEntry}>
          + Add
        </button>
          <button className={styles.commonButton} onClick={handleSave}>
            Save
          </button>
          <button className={`${styles.commonButton} ${styles.cancelButton}`} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
  );
};

export default AddPanel;

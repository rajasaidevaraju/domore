'use client';

import React, { useState } from "react";
import styles from "./AddPanel.module.css";

interface AddPanelProps<T extends { id: number; name: string }> {
  onClose: () => void;
  onSave: (newEntries: { id: number; name: string }[])  => void; // Accepts T[], where T is any type extending { id: number; name: string }
  label: string;
}

const AddPanel = <T extends { id: number; name: string }>({
  onClose,
  onSave,
  label,
}: AddPanelProps<T>) => {
  const [entries, setEntries] = useState<string[]>([""]); // Initial entry input

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

    const newEntries = validEntries.map((name, index) => ({
      id: Date.now() + index, // Generate a unique ID (you can use another method if needed)
      name,
    }));
    onSave(newEntries); // Pass the new entries to the parent component
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2>{`Add ${label}`}</h2>
        <div className={styles.entries}>
          {entries.map((entry, index) => (
            <input
              key={index}
              type="text"
              value={entry}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`New ${label.slice(0, -1)} ${index + 1}`} // Dynamic placeholder
              className={styles.input}
            />
          ))}
        </div>
        <button className={styles.addEntryButton} onClick={handleAddEntry}>
          + Add Another
        </button>
        <div className={styles.actions}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPanel;

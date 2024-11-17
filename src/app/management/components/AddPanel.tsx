'use client';

import React, { useState } from "react";
import styles from "./AddPanel.module.css";

interface AddPanelProps {
  onClose: () => void;
  onSave: (newEntries: { id: number; name: string }[]) => void;
  label:String
}

const AddPanel: React.FC<AddPanelProps> = ({ onClose, onSave, label }) => {
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
      id: Date.now() + index, // Generate a unique ID
      name,
    }));
    onSave(newEntries);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h2>{label}</h2>
        <div className={styles.entries}>
          {entries.map((entry, index) => (
            <input
              key={index}
              type="text"
              value={entry}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`new entry ${index + 1}`}
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

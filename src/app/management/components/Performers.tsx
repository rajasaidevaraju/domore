'use client';

import React, { useState } from "react";
import styles from "./Card.module.css";
import AddPanel from "./AddPanel";

interface Performer {
  id: number;
  name: string;
}

const PerformersCard = () => {
  const [performers, setPerformers] = useState<Performer[]>([
    { id: 1, name: "TestName1" },
    { id: 2, name: "TestName2" },
    { id: 3, name: "TestName3" },
  ]);
  const [isSelecting, setIsSelecting] = useState(false); // Toggle selection mode
  const [selectedPerformers, setSelectedPerformers] = useState<Set<number>>(new Set()); // Track selected performer IDs
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Add performer logic
  const handleAddPerformers = (newPerformers: Performer[]) => {
    setPerformers((prevPerformers) => [...prevPerformers, ...newPerformers]);
    setShowAddPanel(false);
  };

  const handleSelect = (performerId: number) => {
    if(isSelecting){
      setSelectedPerformers((prev) => {
        const updated = new Set(prev);
        if (updated.has(performerId)) {
          updated.delete(performerId);
        } else {
          updated.add(performerId);
        }
        return updated;
      });
    }
  };

  const handleDeleteMode = () => {
    setIsSelecting(true);
  };

  const handleCancelSelection = () => {
    setIsSelecting(false);
    setSelectedPerformers(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedPerformers.size === 0) {
      alert("No performers selected.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the selected performers?");
    if (confirmed) {
      setPerformers((prevPerformers) =>
        prevPerformers.filter((performer) => !selectedPerformers.has(performer.id))
      );
      setSelectedPerformers(new Set());
      setIsSelecting(false);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p>Performers</p>
        <div className={styles.buttons}>
          {!isSelecting ? (
            <>
              <button
                className={`${styles.addButton} ${styles.button}`}
                onClick={() => setShowAddPanel(true)}
              >
                <img src="/svg/add.svg" alt="Add" />
              </button>
              <button
                className={`${styles.editButton} ${styles.button}`}
                onClick={() => console.log("Edit functionality here")}
              >
                <img src="/svg/edit.svg" alt="Edit" />
              </button>
              <button
                className={`${styles.removeButton} ${styles.button}`}
                onClick={handleDeleteMode}
              >
                <img src="/svg/delete.svg" alt="Delete" />
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.confirmButton} ${styles.button}`}
                onClick={handleDeleteSelected}
              >
                Confirm Delete
              </button>
              <button
                className={`${styles.cancelButton} ${styles.button}`}
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.cardList}>
        {performers.map((performer) => (
          <div
          key={performer.id}
          className={`${styles.card} ${selectedPerformers.has(performer.id) ? styles.selected : ""}`}
          onClick={() => handleSelect(performer.id)}
        >
          {isSelecting && (
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedPerformers.has(performer.id)}
                className={styles.checkbox}
              />
            </label>
          )}
          <p className={styles.text}>{performer.name}</p>
        </div>
        
        ))}
      </div>

      {/* Add Performer Panel */}
      {showAddPanel && (
        <AddPanel
          onClose={() => setShowAddPanel(false)}
          onSave={handleAddPerformers}
          label="performers"
        />
      )}
    </div>
  );
};

export { PerformersCard, type Performer };

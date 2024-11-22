'use client';

import React, { useState } from "react";
import styles from "./Card.module.css";
import AddPanel from "./AddPanel";

// Generic types for items like Performer or Category
interface CardProps<T> {
  items: T[];
  onAdd: (newEntries: { id: number; name: string }[])=>void;
  onDelete: (selectedIds: Set<number>) => void;
  onEdit?: () => void;
  label: string;
}

const Card = <T extends { id: number; name: string }>({
  items,
  onAdd,
  onDelete,
  onEdit,
  label,
}: CardProps<T>) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showAddPanel, setShowAddPanel] = useState(false);

  const handleSelect = (itemId: number) => {
    if (isSelecting) {
      setSelectedItems((prev) => {
        const updated = new Set(prev);
        if (updated.has(itemId)) {
          updated.delete(itemId);
        } else {
          updated.add(itemId);
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
    setSelectedItems(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) {
      alert(`No ${label} selected.`);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete the selected ${label}?`);
    if (confirmed) {
      onDelete(selectedItems);
      setSelectedItems(new Set());
      setIsSelecting(false);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p>{label}</p>
        <div className={styles.buttons}>
          {!isSelecting ? (
            <>
              <button
                className={`${styles.addButton} ${styles.button}`}
                onClick={() => setShowAddPanel(true)}
              >
                <img src="/svg/add.svg" alt="Add" />
              </button>
              {onEdit && (
                <button
                  className={`${styles.editButton} ${styles.button}`}
                  onClick={onEdit}
                >
                  <img src="/svg/edit.svg" alt="Edit" />
                </button>
              )}
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
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${selectedItems.has(item.id) ? styles.selected : ""}`}
            onClick={() => handleSelect(item.id)}
          >
            {isSelecting && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  className={styles.checkbox}
                />
              </label>
            )}
            <p className={styles.text}>{item.name}</p>
          </div>
        ))}
      </div>

      {showAddPanel && (
        <AddPanel
          onClose={() => setShowAddPanel(false)}
          onSave={onAdd}
          label={label}
        />
      )}
    </div>
  );
};

export default Card;

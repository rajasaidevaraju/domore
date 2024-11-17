'use client';

import React,{useState} from "react";
import styles from "./Card.module.css";
import AddPanel from "./AddPanel";

interface Category {
  id: number;
  name: string;
}

const CategoriesCard = () => {
  const [categories, setcategories] = useState<Category[]>([
    { id: 1, name: "Category1" },
    { id: 2, name: "Category2" },
    { id: 3, name: "Category3" },
  ]);

  const [isSelecting, setIsSelecting] = useState(false); // Toggle selection mode
  const [selectedCategories, setselectedCategories] = useState<Set<number>>(new Set()); // Track selected performer IDs
  const [showAddPanel, setShowAddPanel] = useState(false);

  const handleEdit = () => {
    // Logic to edit a category
    console.log("Editing a category");
  };

  const handleRemove = () => {
    // Logic to remove a category
    console.log("Removing a category");
  };

  const handleAddCategories = (newCategories: Category[]) => {
    setcategories((prevcategories) => [...prevcategories, ...newCategories]);
    setShowAddPanel(false);
  };

  const handleSelect = (categoryId: number) => {
    if(isSelecting){
      setselectedCategories((prev) => {
        const updated = new Set(prev);
        if (updated.has(categoryId)) {
          updated.delete(categoryId);
        } else {
          updated.add(categoryId);
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
    setselectedCategories(new Set());
  };

  const handleDeleteSelected = () => {
    if (selectedCategories.size === 0) {
      alert("No Categories selected.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the selected Categories?");
    if (confirmed) {
      setcategories((prevPerformers) =>
        prevPerformers.filter((performer) => !selectedCategories.has(performer.id))
      );
      setselectedCategories(new Set());
      setIsSelecting(false);
    }
  };
  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <p>Categories</p>
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
        {categories.map((category) => (
          <div
          key={category.id}
          className={`${styles.card} ${selectedCategories.has(category.id) ? styles.selected : ""}`}
          onClick={() => handleSelect(category.id)}
        >
          {isSelecting && (
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCategories.has(category.id)}
                className={styles.checkbox}
              />
            </label>
          )}
          <p className={styles.text}>{category.name}</p>
        </div>
        
        ))}
      </div>

      {/* Add Performer Panel */}
      {showAddPanel && (
        <AddPanel
          onClose={() => setShowAddPanel(false)}
          onSave={handleAddCategories} label="categories"/>
      )}
    </div>
  );
};

export { CategoriesCard, type Category };

'use client';

import React, { useState , useEffect} from "react";
import styles from "./filter.module.css";
import AddPanel from "./AddPanel";
import {Item} from "@/app/types/Types";
import Loading from "@/app/loading";
import RippleButtonLink from "@/app/types/RippleButtonLink";

// Generic types for items like Performer or Category
interface CardProps<T> {
  items: T[];
  onAdd: (name: string[])=>void;
  onDelete: (selectedIds: Set<number>) => void;
  onEdit?: () => void;
  label: string;
  isLoggedIn: boolean;
  loading: boolean;
}

const Card = <T extends Item>({
  items,
  onAdd,
  onDelete,
  onEdit,
  label,
  isLoggedIn,
  loading
}: CardProps<T>) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const openPanel = () => {
    setShowAddPanel(true);
    setIsAnimating(true);
  };

  const closePanel = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setShowAddPanel(false);
    }, 300);
  };

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
        <h1>{label}</h1>
        {isLoggedIn && 
          <div className={styles.buttons}>
          {!isSelecting ? (
            <>
              <button className={`${styles.commonButton}`} onClick={openPanel}><img src="/svg/add.svg" alt="Add" /></button>
              {onEdit && (
                <button
                  className={`${styles.editButton} ${styles.commonButton}`}
                  onClick={onEdit}
                >
                  <img src="/svg/edit.svg" alt="Edit" />
                </button>
              )}
              <button className={`${styles.removeButton} ${styles.commonButton}`} onClick={handleDeleteMode}><img src="/svg/delete.svg" alt="Delete" /></button>
            </>
          ) : (
            <>
              <button
                className={`${styles.removeButton} ${styles.commonButton}`}
                onClick={handleDeleteSelected}
              >
                Confirm Delete
              </button>
              <button
                className={`${styles.commonButton}`}
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
            </>
          )}
          </div>
        
        }
      </div>
      {loading ? (
        <Loading text={"Requesting "+label}/>
      ) : items.length === 0 ? (
        <p className={styles.noItems}>No {label} found.</p>
      ) : null}
      <div className={styles.cardList}>
        {items.map((item) => (
          
          isSelecting ? (
            <div key={item.id}
              className={`${styles.card} ${selectedItems.has(item.id) ? styles.selected : ""}`}
              onClick={()=>handleSelect(item.id)}>
              
                <label className={styles.checkboxLabel}>
                  <input id={`checkbox-${item.id}`} type="checkbox" checked={selectedItems.has(item.id)} onChange={()=>{}} className={styles.checkbox}/>
                </label>
            
              <p className={styles.text}>{item.name}</p>
            </div>
        ):(
          <RippleButtonLink key={item.id} className={styles.card} href={`/files?performerId=${item.id}`}> {item.name}</RippleButtonLink>
        )


        ))}
      </div>
      
      {showAddPanel && (
        <div>
          <div className={`${styles.overlay} ${isAnimating ? styles.enter : styles.exit}`}></div>
          <div
            className={`${styles.addPanel} ${isAnimating ? styles.enter : styles.exit}`}
            onAnimationEnd={() => !showAddPanel && setIsAnimating(false)}
          >
            <AddPanel
              onClose={closePanel}
              onSave={onAdd}
              label={label}
            />
          </div>
        </div>
      )}

    </div>
  );
};


export default Card;

'use client';

import React from "react";
import styles from "./PerformersCard.module.css";

interface Performers {
    id: number;
    name: string;
}


const PerformersCard = () => {
  const performers:Performers[] = [{id:1, name:'TestName1'},{id:2, name:'TestName2'},{id:3, name:'TestName3'}]; 

  const handleEdit = (performerId:number) => {
    // Logic to edit performer based on performerId
    console.log(`Editing performer with ID ${performerId}`);
  };

  const handleRemove = (performerId:number) => {
    // Logic to remove performer based on performerId
    console.log(`Removing performer with ID ${performerId}`);
  };

  const handleAdd = () => {
    console.log("Adding a new performer");
    // Add logic to handle adding a new performer
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.header}>
        <h2>Performers</h2>
        
        <button 
        className={`${styles.addButton} ${styles.button}`}
        onClick={handleAdd}>
          <img src="/add.svg" alt="Add" />
        </button>
        
        
      </div>
      <div className={styles.cardList}>
        {performers.map((performer) => (
          <div key={performer.id} className={styles.card}>
            <p className={styles.text}>{performer.name}</p>
            <div className={styles.buttons}>
              <button 
              className={`${styles.editButton} ${styles.button}`}
              onClick={() => handleEdit(performer.id)}>
                <img src="/edit.svg" alt="Edit" />
                </button>

              <button className={`${styles.removeButton} ${styles.button}`}
              onClick={() => handleRemove(performer.id)}>
                <img src="/delete.svg" alt="Delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export  {PerformersCard, type Performers};

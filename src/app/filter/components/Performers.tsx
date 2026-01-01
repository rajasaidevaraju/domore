'use client';

import React from "react";
import { CardProps, MessageType } from "../../types/Types";
import Card from "./CommonCard";
import { useAuthStore } from '@/app/store/auth';
import { usePerformersStore } from '@/app/store/performersStore';


const PerformersCard: React.FC<CardProps> = ({ showToast }) => {
  const { token } = useAuthStore();
  const {
    performersWithCount,
    isFetchingWithCount,
    fetchPerformersWithCountIfNeeded,
    addPerformers,
    deletePerformers
  } = usePerformersStore();

  fetchPerformersWithCountIfNeeded();

  const handleAddPerformers = async (newPerformers: string[]) => {
    try {
      const data = await addPerformers(newPerformers, token!!);
      showToast({ type: MessageType.SUCCESS, message: data.message });
    } catch (err) {
      let message = "Failed to add performers";
      if (err instanceof Error) {
        message = err.message;
      }
      showToast({ type: MessageType.DANGER, message: message });
    }
  };

  const handleDeletePerformers = async (selectedIds: Set<number>) => {
    try {
      const data = await deletePerformers([...selectedIds], token!!);
      showToast({ type: MessageType.SUCCESS, message: data.message });
    } catch (err) {
      let message = "Failed to delete performers";
      if (err instanceof Error) {
        message = err.message;
      }
      showToast({ type: MessageType.DANGER, message: message });
    }
  };


  return (
    <Card
      items={performersWithCount}
      onAdd={handleAddPerformers}
      onDelete={handleDeletePerformers}
      label="Performers"
      loading={isFetchingWithCount}
    />
  );
};

export default PerformersCard;

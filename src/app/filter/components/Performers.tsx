'use client';

import { useRef } from "react";
import { CardProps, MessageType } from "../../types/Types";
import Card from "./CommonCard";
import { useAuthStore } from '@/app/store/auth';
import { usePerformersStore } from '@/app/store/performersStore';


const PerformersCard: React.FC<CardProps> = ({ showToast }) => {
  const { token } = useAuthStore();
  const {
    performersWithCount,
    isFetchingWithCount,
    hasFetchedWithCount,
    fetchPerformersWithCountIfNeeded,
    addPerformers,
    deletePerformers
  } = usePerformersStore();

  const wasFetchedOnMount = useRef(hasFetchedWithCount);

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
      throw err; // Re-throw to keep AddPanel in loading state or prevent it from closing
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
      shouldAnimate={!wasFetchedOnMount.current}
    />
  );
};

export default PerformersCard;

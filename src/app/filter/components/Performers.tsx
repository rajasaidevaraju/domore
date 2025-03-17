'use client';

import React, { useEffect, useState } from "react";
import { Item,CardProps,EntityType, MessageType } from "../../types/Types";
import {FilterRequests}  from "@/app/service/FilterRequests";
import Card from "./CommonCard";

const PerformersCard: React.FC<CardProps> = ({ isLoggedIn,showToast }) => {
  const [performers, setPerformers] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddPerformers = async (newPerformers: string[]) => {
    try{
      const data=await FilterRequests.addItems(EntityType.Performer,newPerformers,localStorage.getItem('token') ?? "");
      showToast({ type: MessageType.SUCCESS, message:data.message})
    }catch(err){
      let message="Failed to add performers"
      if(err instanceof Error){
        message=err.message;
      }
      showToast({ type: MessageType.DANGER, message:message})
    }
    finally{
      fetchPerformers();
    }
  };

  const handleDeletePerformers = async(selectedIds: Set<number>) => {
    try{
      const data=await FilterRequests.deleteItems(EntityType.Performer,[...selectedIds],localStorage.getItem('token') ?? "");
      showToast({ type: MessageType.SUCCESS, message:data.message})
    }catch(err){
      let message="Failed to delete performers"
      if(err instanceof Error){
        message=err.message;
      }
      showToast({ type: MessageType.DANGER, message:message})
    }
    finally{
      fetchPerformers();
    }
  };

  const fetchPerformers = async () => {
    try {
      setLoading(true);
      const data = await FilterRequests.fetchItems(EntityType.Performer);
      setPerformers(data);
    } catch (err) {
      let message="Failed to fetch performers"
      if(err instanceof Error){
        message=err.message;
      }
      showToast({ type: MessageType.DANGER, message:message});
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformers();
  }, []);

  return (
    <Card
      items={performers}
      onAdd={handleAddPerformers}
      onDelete={handleDeletePerformers}
      label="Performers"
      isLoggedIn={isLoggedIn}
      loading={loading}
    />
  );
};

export default PerformersCard;

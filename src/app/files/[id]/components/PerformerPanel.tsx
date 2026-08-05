import { useEffect, useState, useRef } from "react";
import styles from "../File.module.css";
import RippleButton from "@/app/types/RippleButton";
import { FilterRequests } from "@/app/service/FilterRequests";
import { EntityType, Item, MessageType } from "@/app/types/Types";
import { usePerformersStore } from "@/app/store/performersStore";

interface PerformerPanelProps {
  fileId: string;
  token: string | null;
  currentPerformers: Item[];
  onClose: (updatedPerformers: Item[]) => void;
  showToast: (message: string, type: MessageType) => void;
}

function PerformerPanel({ fileId, token, currentPerformers, onClose, showToast }: PerformerPanelProps) {
  const [name, setName] = useState<string>("");
  const [assignedPerformers, setAssignedPerformers] = useState<Item[]>(currentPerformers);
  const [filteredPerformers, setFilteredPerformers] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { performers: allPerformers, fetchPerformers } = usePerformersStore();



  useEffect(() => {
    fetchPerformers();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (allPerformers.length > 0) {
      const assignedIds = new Set(assignedPerformers.map((p) => p.id));
      const filtered = allPerformers.filter(
        (performer) =>
          performer.name.toLowerCase().includes(name.toLowerCase()) &&
          !assignedIds.has(performer.id)
      );
      setFilteredPerformers(filtered);
    }
  }, [name, allPerformers, assignedPerformers]);

  const handleAdd = async (performer: Item) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await FilterRequests.addItemToFile(
        Number(fileId),
        performer.id,
        EntityType.Performer,
        token
      );
      if (response.message) {
        setAssignedPerformers((prev) => [...prev, performer]);
        showToast("Performer added", MessageType.SUCCESS);
        setName("");
      }
    } catch (error) {
      let message = "Failed to add performer";
      if (error instanceof Error) message = error.message;
      showToast(message, MessageType.DANGER);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (performerId: number) => {
    if (!token) return;
    setLoading(true);
    try {
      await FilterRequests.removeItemFromFile(
        Number(fileId),
        performerId,
        EntityType.Performer,
        token
      );
      setAssignedPerformers((prev) => prev.filter((p) => p.id !== performerId));
      showToast("Performer removed", MessageType.SUCCESS);
    } catch (error) {
      let message = "Failed to remove performer";
      if (error instanceof Error) message = error.message;
      showToast(message, MessageType.DANGER);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Manage Performers</h2>
        </div>

        <div className={styles.body}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search to add..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              ref={inputRef}
              disabled={loading}
            />

            {name.length > 0 && filteredPerformers.length > 0 && (
              <div className={styles.suggestions}>
                {filteredPerformers.map((performer) => (
                  <div
                    key={performer.id}
                    className={styles.suggestionItem}
                    onClick={() => handleAdd(performer)}
                  >
                    <div className={styles.suggestionText}>
                      <span>{performer.name}</span>
                      <img src="/svg/add.svg" alt="Add" className={styles.icon} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.assignedList}>
            <h4>Assigned Performers</h4>
            {assignedPerformers.length === 0 ? (
              <p className={styles.noAssign}>No performers assigned.</p>
            ) : (
              <div className={styles.assignedWrapper}>
                {assignedPerformers.map((p) => (
                  <div key={p.id} className={styles.assignedItem}>
                    <span>{p.name}</span>
                    <button onClick={() => handleRemove(p.id)} disabled={loading} className={styles.removeBtn}>
                      <img src="/svg/cancel.svg" alt="Remove" className={styles.icon} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <RippleButton className={styles.scbutton} onClick={() => onClose(assignedPerformers)}>
            <img src="/svg/yes.svg" alt="Done" className={styles.icon} />
            <p>&nbsp;Done</p>
          </RippleButton>
        </div>
      </div>
    </div>
  );
}

export default PerformerPanel;
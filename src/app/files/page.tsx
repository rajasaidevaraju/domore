import { HomeSearchParams } from '../types/Types';
import NavContextBridge from "@/app/files/components/NavContextBridge";
import styles from './Files.module.css';
import { notFound } from 'next/navigation';
import VideoList from './components/VideoList';
import SortDropdown from './components/SortDropdown';
import PerformerFilterLoader from './components/PerformerFilterLoader';
import { parseFilters } from './filterParams';


export default async function AltHomePage({ searchParams }: { searchParams: HomeSearchParams }) {
  const params = await searchParams;
  const filters = parseFilters(params);

  if (filters === null) {
    return notFound();
  }

  return (
    <main className={styles.mainContainer}>
      <NavContextBridge filters={filters} />
      <div className={styles.controlDiv}>
        <PerformerFilterLoader filters={filters} />
        <SortDropdown filters={filters} />
      </div>
      <VideoList filters={filters} />
    </main>
  );

}

import { FilterRequests } from "@/app/service/FilterRequests";
import { EntityType, Item } from "@/app/types/Types";
import { FileFilters } from "../filterParams";
import PerformerFilter from "./PerformerFilter";

/**
 * Sibling of VideoList rather than an await in the page itself: as siblings the
 * two fetches run concurrently, so the list costs max(files, performers) instead
 * of stacking on top of the files request.
 */
export default async function PerformerFilterLoader({ filters }: { filters: FileFilters }) {
    let performers: Item[] = [];

    try {
        performers = await FilterRequests.fetchItems(EntityType.Performer);
    } catch (error) {
        // the filter degrades to All / No performer; the file list still renders
        console.error("Failed to load performers for the filter:", error);
    }

    return <PerformerFilter filters={filters} performers={performers} />;
}

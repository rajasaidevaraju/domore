/**
 * Single source of truth for the file-list query string.
 *
 * Every control that navigates the list (pagination, sort, performer filter)
 * and every redirect back into it (e.g. after a delete) goes through here, so
 * the params stay consistent and the mutual-exclusion rule lives in one place.
 */

export interface FileFilters {
  page: number;
  performerId: number | null;
  sortBy: string | undefined;
  unassignedOnly: boolean;
}

export interface RawFileFilters {
  page?: string;
  performerId?: string;
  sortBy?: string;
  unassigned?: string;
}

export const DEFAULT_FILTERS: FileFilters = {
  page: 1,
  performerId: null,
  sortBy: undefined,
  unassignedOnly: false,
};

/**
 * `unassigned` and `performerId` filter the same dimension and can never both
 * hold: a file without performers cannot belong to the requested performer.
 * `unassigned` wins.
 */
function applyExclusivity(filters: FileFilters): FileFilters {
  return filters.unassignedOnly ? { ...filters, performerId: null } : filters;
}

/**
 * Returns null when a param is malformed, so the caller can render notFound().
 */
export function parseFilters(params: RawFileFilters): FileFilters | null {
  let page = 1;
  if (params.page) {
    const parsed = Number(params.page);
    if (isNaN(parsed)) {
      return null;
    }
    page = Math.max(1, Math.floor(parsed));
  }

  let performerId: number | null = null;
  if (params.performerId) {
    const parsed = Number(params.performerId);
    if (isNaN(parsed)) {
      return null;
    }
    performerId = parsed;
  }

  return applyExclusivity({
    page,
    performerId,
    sortBy: params.sortBy,
    unassignedOnly: isTruthyParam(params.unassigned),
  });
}

export function filesQuery(filters: FileFilters): string {
  const { page, performerId, sortBy, unassignedOnly } = applyExclusivity(filters);
  const params = new URLSearchParams();

  if (page > 1) {
    params.set("page", page.toString());
  }
  if (performerId != null) {
    params.set("performerId", performerId.toString());
  }
  if (sortBy) {
    params.set("sortBy", sortBy);
  }
  if (unassignedOnly) {
    params.set("unassigned", "true");
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Pass the current pathname for in-page controls so they keep you on whichever
 * route is rendering the list; pass an explicit one to navigate into it.
 */
export function filesUrl(pathname: string, filters: FileFilters): string {
  return `${pathname}${filesQuery(filters)}`;
}

function isTruthyParam(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return ["1", "true", "yes"].includes(value.toLowerCase());
}

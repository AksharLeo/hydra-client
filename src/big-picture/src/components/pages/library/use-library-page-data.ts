import type { LibraryGame } from "@types";
import { useDeferredValue, useMemo } from "react";
import {
  getFirstLibraryFocusGridItemId,
  getFirstLibraryFocusListItemId,
} from "./navigation";
import {
  filterLibraryByTab,
  filterLibraryBySecondaryFilter,
  getLastPlayedGames,
  getLibraryFilterCounts,
  matchesSearchQuery,
  sortByLastPlayed,
  sortLibraryGames,
  type LibraryFilterTab,
  type LibrarySecondaryFilter,
  type LibrarySortOption,
} from "./library-data";
import { useLibrarySettingsStore } from "../../../stores";

export function useLibraryPageData(
  library: LibraryGame[],
  selectedTab: LibraryFilterTab,
  search: string,
  sortBy: LibrarySortOption,
  secondaryFilter: LibrarySecondaryFilter
) {
  const deferredSearch = useDeferredValue(search);
  const showHiddenGames = useLibrarySettingsStore(
    (state) => state.showHiddenGames
  );

  const lastPlayedSortedLibrary = useMemo(() => {
    return library
      .filter((g) => showHiddenGames || !g.isHidden)
      .sort(sortByLastPlayed);
  }, [library, showHiddenGames]);

  const filteredLibrary = useMemo(() => {
    const tabFilteredLibrary = filterLibraryByTab(library, selectedTab);
    const secondaryFilteredLibrary = filterLibraryBySecondaryFilter(
      tabFilteredLibrary,
      secondaryFilter
    );
    const searchFilteredLibrary = secondaryFilteredLibrary.filter(
      (game) =>
        (showHiddenGames || !game.isHidden) &&
        matchesSearchQuery(game, deferredSearch)
    );

    return sortLibraryGames(searchFilteredLibrary, sortBy);
  }, [
    deferredSearch,
    library,
    secondaryFilter,
    selectedTab,
    sortBy,
    showHiddenGames,
  ]);

  const filterCounts = useMemo(() => {
    return getLibraryFilterCounts(library, showHiddenGames);
  }, [library, showHiddenGames]);

  const lastPlayedGames = useMemo(() => {
    return getLastPlayedGames(lastPlayedSortedLibrary);
  }, [lastPlayedSortedLibrary]);

  const firstGridItemId = useMemo(() => {
    return getFirstLibraryFocusGridItemId(filteredLibrary[0]?.id);
  }, [filteredLibrary]);

  const firstListItemId = useMemo(() => {
    return getFirstLibraryFocusListItemId(filteredLibrary[0]?.id);
  }, [filteredLibrary]);

  return {
    filteredLibrary,
    filterCounts,
    firstGridItemId,
    firstListItemId,
    lastPlayedGames,
  };
}

import { useState, useEffect } from 'react';

export const useSearch = (openTabs, closedTabs, bookmarks, includeClosed, includeBookmarks) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    let searchPool = [...openTabs];
    if (includeClosed) searchPool.push(...closedTabs);
    if (includeBookmarks) searchPool.push(...bookmarks);

    const query = searchQuery.toLowerCase().trim();
    const results = query
      ? searchPool.filter(item =>
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.url && item.url.toLowerCase().includes(query))
        )
      : searchPool;

    setFilteredItems(results);
  }, [searchQuery, openTabs, closedTabs, bookmarks, includeClosed, includeBookmarks]);

  return { searchQuery, setSearchQuery, filteredItems };
};

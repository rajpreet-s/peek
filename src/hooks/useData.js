/*global chrome*/
import { useState, useEffect, useCallback } from 'react';

export const useData = () => {
  const [openTabs, setOpenTabs] = useState([]);
  const [closedTabs, setClosedTabs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [includeBookmarks, setIncludeBookmarks] = useState(false);

  const fetchData = useCallback(async () => {
    // Fetch Open Tabs
    try {
      const tabs = await chrome.tabs.query({});
      setOpenTabs(tabs);
    } catch (e) { console.error("Error fetching open tabs:", e); }

    // Fetch Recently Closed Tabs
    try {
      const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 25 });
      const recentTabs = sessions
        .filter(s => s.tab && !s.window)
        .map(s => ({ ...s.tab, isClosed: true, sessionId: s.tab.sessionId }));
      setClosedTabs(recentTabs);
    } catch (e) { console.error("Error fetching closed tabs:", e); }
    
    // Fetch Bookmarks
    try {
        const results = [];
        const tree = await chrome.bookmarks.getTree();
        function traverse(nodes) {
            for (const node of nodes) {
            if (node.url) {
                results.push({ title: node.title, url: node.url, isBookmark: true, id: node.id });
            }
            if (node.children) {
                traverse(node.children);
            }
            }
        }
        traverse(tree);
        setBookmarks(results);
    } catch (e) { console.error("Error fetching bookmarks:", e); }
  }, []);

  useEffect(() => {
    fetchData();
    // Restore toggle states
    const restoreToggleStates = async () => {
        const data = await chrome.storage.local.get(['closedTabsToggle', 'bookmarksToggle']);
        setIncludeClosed(data.closedTabsToggle || false);
        setIncludeBookmarks(data.bookmarksToggle || false);
    };
    restoreToggleStates();
  }, [fetchData]);

  const handleToggleClosed = (checked) => {
    setIncludeClosed(checked);
    chrome.storage.local.set({ 'closedTabsToggle': checked });
  };

  const handleToggleBookmarks = (checked) => {
    setIncludeBookmarks(checked);
    chrome.storage.local.set({ 'bookmarksToggle': checked });
  };

  return { openTabs, closedTabs, bookmarks, includeClosed, includeBookmarks, handleToggleClosed, handleToggleBookmarks, fetchData };
};

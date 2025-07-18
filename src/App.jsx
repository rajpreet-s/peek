/*global chrome*/
import { useCallback } from "react";
import "@/styles/App.scss";
import Header from "@/components/Header.jsx";
import Search from "@/components/Search.jsx";
import Filter from "@/components/Filter.jsx";
import Results from "@/components/Results.jsx";
import { useTheme } from "@/hooks/useTheme";
import { useData } from "@/hooks/useData";
import { useSearch } from "@/hooks/useSearch";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    openTabs,
    closedTabs,
    bookmarks,
    includeClosed,
    includeBookmarks,
    handleToggleClosed,
    handleToggleBookmarks,
    fetchData,
  } = useData();
  const { searchQuery, setSearchQuery, filteredItems } = useSearch(
    openTabs,
    closedTabs,
    bookmarks,
    includeClosed,
    includeBookmarks
  );

  const filters = [
    {
      id: 'closed-tabs-toggle',
      isChecked: includeClosed,
      onChange: handleToggleClosed,
      label: 'Search closed tabs',
    },
    {
      id: 'bookmarks-toggle',
      isChecked: includeBookmarks,
      onChange: handleToggleBookmarks,
      label: 'Search bookmarks',
    },
  ];

  const handleItemClick = useCallback((item) => {
    if (item.isClosed) {
      chrome.sessions.restore(item.sessionId);
    } else if (item.isBookmark) {
      chrome.tabs.create({ url: item.url });
    } else {
      chrome.windows.update(item.windowId, { focused: true });
      chrome.tabs.update(item.id, { active: true });
    }
    window.close(); // Close popup after action
  }, []);

  const { selectedIndex } = useKeyboardNavigation(filteredItems, handleItemClick);

  const handleCloseTab = async (e, tabId) => {
    e.stopPropagation(); // Prevent item click
    await chrome.tabs.remove(tabId);
    fetchData(); // Refresh list
  };

  return (
    <div className="App">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Filter filters={filters} />
      <Results
        filteredItems={filteredItems}
        selectedIndex={selectedIndex}
        handleItemClick={handleItemClick}
        handleCloseTab={handleCloseTab}
      />
    </div>
  );
};

export default App;

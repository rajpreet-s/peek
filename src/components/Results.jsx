import React from 'react';

// Helper to get favicon URL
const getFaviconUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`;
  } catch (e) {
    return "images/favicon-placeholder16.png"; // Default icon
  }
};

const ResultItem = ({ item, index, selectedIndex, handleItemClick, handleCloseTab }) => {
  return (
    <li
      key={item.id || item.sessionId || item.url}
      className={`result-item ${index === selectedIndex ? 'selected' : ''} ${item.isClosed ? 'is-closed' : ''} ${item.isBookmark ? 'is-bookmark' : ''}`}
      onClick={() => handleItemClick(item)}
    >
      <img src={item.favIconUrl || getFaviconUrl(item.url)} onError={(e) => { e.target.onerror = null; e.target.src='images/icon16.png'; }} alt="" />
      <div className="info">
        <div className="title">{item.title || 'Untitled'}</div>
        <div className="url">{item.url || ''}</div>
      </div>
      {item.isClosed && <span className="action-indicator">Reopen</span>}
      {item.isBookmark && <span className="action-indicator">Bookmark</span>}
      {!item.isClosed && !item.isBookmark && (
        <button className="close-btn" title="Close Tab" onClick={(e) => handleCloseTab(e, item.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      )}
    </li>
  );
};

const Results = ({ filteredItems, selectedIndex, handleItemClick, handleCloseTab }) => {
  return (
    <ul id="results-list">
      {filteredItems.length > 0 ? (
        filteredItems.map((item, index) => (
          <ResultItem
            key={item.id || item.sessionId || item.url}
            item={item}
            index={index}
            selectedIndex={selectedIndex}
            handleItemClick={handleItemClick}
            handleCloseTab={handleCloseTab}
          />
        ))
      ) : (
        <li className="no-results">No matching items found.</li>
      )}
    </ul>
  );
};

export default Results;

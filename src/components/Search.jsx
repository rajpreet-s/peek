import React from 'react';

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div id="search-container">
      <input
        type="text"
        id="search-input"
        placeholder="Search tabs, bookmarks..."
        autoFocus
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;

import { useState, useEffect } from 'react';

export const useKeyboardNavigation = (filteredItems, handleItemClick) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredItems.length === 0) return;

      let newIndex = selectedIndex;
      if (e.key === 'ArrowDown') {
        newIndex = (selectedIndex + 1) % filteredItems.length;
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        newIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
        e.preventDefault();
      } else if (e.key === 'Enter') {
        handleItemClick(filteredItems[selectedIndex]);
      }
      setSelectedIndex(newIndex);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredItems, handleItemClick]);

  // Scroll to selected item
  useEffect(() => {
    const selectedItem = document.querySelector('.result-item.selected');
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return { selectedIndex };
};

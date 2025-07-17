// DOM Elements
const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');
const lightModeBtn = document.getElementById('light-mode-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const closedTabsToggle = document.getElementById('closed-tabs-toggle');
const bookmarksToggle = document.getElementById('bookmarks-toggle');

// State
let allTabs = [];
let recentlyClosedTabs = [];
let bookmarks = [];
let combinedItems = [];
let selectedIndex = 0;

// --- Theme Management ---
async function initializeTheme() {
  const data = await chrome.storage.local.get('theme');
  const theme = data?.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  lightModeBtn.classList.toggle('active', theme === 'light');
  darkModeBtn.classList.toggle('active', theme === 'dark');
}

function handleThemeChange(newTheme) {
  applyTheme(newTheme);
  chrome.storage.local.set({ theme: newTheme });
}

// --- Data Fetching ---
async function fetchAllTabs() {
  try {
    allTabs = await chrome.tabs.query({});
  } catch (e) { console.error("Error fetching open tabs:", e); allTabs = []; }
}

async function fetchRecentlyClosedTabs() {
  try {
    const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: 25 });
    recentlyClosedTabs = sessions
      .filter(s => s.tab && !s.window)
      .map(s => ({ ...s.tab, isClosed: true, sessionId: s.tab.sessionId }));
  } catch (e) { console.error("Error fetching closed tabs:", e); recentlyClosedTabs = []; }
}

async function fetchBookmarks() {
  const results = [];
  const tree = await chrome.bookmarks.getTree();
  
  function traverse(nodes) {
    for (const node of nodes) {
      if (node.url) { // It's a bookmark
        results.push({
          title: node.title,
          url: node.url,
          isBookmark: true,
          id: node.id
        });
      }
      if (node.children) { // It's a folder
        traverse(node.children);
      }
    }
  }
  
  try {
    traverse(tree);
    bookmarks = results;
  } catch(e) { console.error("Error fetching bookmarks:", e); bookmarks = []; }
}

// --- Core Logic ---
function filterAndRender() {
  const query = searchInput.value.toLowerCase().trim();
  const includeClosed = closedTabsToggle.checked;
  const includeBookmarks = bookmarksToggle.checked;

  let searchPool = [...allTabs];
  if (includeClosed) searchPool.push(...recentlyClosedTabs);
  if (includeBookmarks) searchPool.push(...bookmarks);

  combinedItems = query
    ? searchPool.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.url && item.url.toLowerCase().includes(query))
      )
    : searchPool;

  selectedIndex = 0;
  renderResults();
}

function renderResults() {
  resultsList.innerHTML = '';

  if (combinedItems.length === 0) {
    resultsList.innerHTML = '<li class="result-item">No matching items found.</li>';
    return;
  }

  combinedItems.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'result-item';
    listItem.dataset.index = index;

    const favicon = document.createElement('img');
    favicon.onerror = () => { favicon.src = 'images/icon16.png'; };
    favicon.src = item.isBookmark ? `chrome-extension://${chrome.runtime.id}/images/icon16.png` : (item.favIconUrl || 'images/icon16.png');
    listItem.appendChild(favicon);

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML = `
      <div class="title">${item.title || 'Untitled'}</div>
      <div class="url">${item.url || ''}</div>
    `;
    listItem.appendChild(info);

    if (item.isClosed) {
      listItem.classList.add('is-closed');
      listItem.innerHTML += '<span class="action-indicator">Reopen</span>';
    } else if (item.isBookmark) {
      listItem.classList.add('is-bookmark');
      listItem.innerHTML += '<span class="action-indicator">Bookmark</span>';
    } else {
      listItem.appendChild(createCloseButton(item.id));
    }

    listItem.addEventListener('click', () => handleItemClick(item));
    resultsList.appendChild(listItem);
  });

  updateSelection();
}

function handleItemClick(item) {
  if (item.isClosed) reopenTab(item.sessionId);
  else if (item.isBookmark) openBookmark(item.url);
  else switchToTab(item.id, item.windowId);
}

// --- Actions ---
async function switchToTab(tabId, windowId) {
  await chrome.windows.update(windowId, { focused: true });
  await chrome.tabs.update(tabId, { active: true });
  window.close();
}

async function reopenTab(sessionId) {
  await chrome.sessions.restore(sessionId);
  window.close();
}

async function openBookmark(url) {
  await chrome.tabs.create({ url });
  window.close();
}

function createCloseButton(tabId) {
  const btn = document.createElement('button');
  btn.className = 'close-btn';
  btn.title = 'Close Tab';
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  btn.addEventListener('click', e => {
    e.stopPropagation();
    closeTab(tabId);
  });
  return btn;
}

async function closeTab(tabId) {
  await chrome.tabs.remove(tabId);
  await fetchAllTabs();
  filterAndRender();
}

// --- Keyboard & Selection ---
function handleKeyboardNavigation(e) {
  if (combinedItems.length === 0) return;
  let newIndex = selectedIndex;

  if (e.key === 'ArrowDown') newIndex = (selectedIndex + 1) % combinedItems.length;
  else if (e.key === 'ArrowUp') newIndex = (selectedIndex - 1 + combinedItems.length) % combinedItems.length;
  else if (e.key === 'Enter') return handleItemClick(combinedItems[selectedIndex]);
  else return;

  e.preventDefault();
  selectedIndex = newIndex;
  updateSelection();
}

function updateSelection() {
  resultsList.querySelectorAll('.result-item').forEach((item, index) => {
    item.classList.toggle('selected', index === selectedIndex);
    if (index === selectedIndex) item.scrollIntoView({ block: 'nearest' });
  });
}

// --- Initialization ---
async function initialize() {
  await initializeTheme();
  await Promise.all([fetchAllTabs(), fetchRecentlyClosedTabs(), fetchBookmarks()]);
  filterAndRender();
  searchInput.focus();

  // Event Listeners
  searchInput.addEventListener('input', filterAndRender);
  closedTabsToggle.addEventListener('change', filterAndRender);
  bookmarksToggle.addEventListener('change', filterAndRender);
  document.addEventListener('keydown', handleKeyboardNavigation);
  lightModeBtn.addEventListener('click', () => handleThemeChange('light'));
  darkModeBtn.addEventListener('click', () => handleThemeChange('dark'));
}

initialize().catch(console.error);
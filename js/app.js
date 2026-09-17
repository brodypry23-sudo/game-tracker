// TODO: replace with your own free key from https://rawg.io/apidocs
const API_KEY = '66abf4abcebd4f11a78d80ba8f0415f0';
const API_BASE = 'https://api.rawg.io/api';

const watchlist = new Watchlist('watchlist');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results');
const checkUpdatesBtn = document.getElementById('check-updates-btn');
const statusMsg = document.getElementById('status-msg');

searchForm.addEventListener('submit', handleSearch);
checkUpdatesBtn.addEventListener('click', handleCheckUpdates);

/**
 * Searches the RAWG API for games matching the entered text and
 * displays the results with an "Add" button on each.
 * @param {Event} e
 */
async function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    statusMsg.textContent = 'Please enter a game title to search.';
    return;
  }

  statusMsg.textContent = 'Searching...';
  resultsList.innerHTML = '';

  try {
    const response = await fetch(
      `${API_BASE}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=8`
    );
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    displayResults(data.results);
    statusMsg.textContent = '';
  } catch (err) {
    console.error(err);
    statusMsg.textContent = 'Something went wrong searching. Please try again.';
  }
}

/**
 * Renders search results with an Add button on each.
 * @param {Array} games
 */
function displayResults(games) {
  resultsList.innerHTML = '';

  if (games.length === 0) {
    resultsList.innerHTML = '<li>No games found.</li>';
    return;
  }

  games.forEach((game) => {
    const li = document.createElement('li');
    li.classList.add('row');

    // Cover image - fall back to a placeholder if RAWG has none for this game
    const img = document.createElement('img');
    img.src = game.background_image || 'https://placehold.co/80x60?text=No+Image';
    img.alt = `${game.name} cover art`;
    img.classList.add('cover-thumb');

    const text = document.createElement('span');
    text.textContent = `${game.name} - Rating: ${game.rating}`;

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Watchlist';
    addBtn.addEventListener('click', () => {
      watchlist.add(game);
      statusMsg.textContent = `${game.name} added to your watchlist.`;
    });

    li.appendChild(img);
    li.appendChild(text);
    li.appendChild(addBtn);
    resultsList.appendChild(li);
  });
}

/**
 * Fetches a single game's current data by id from the RAWG API.
 * Used by the Watchlist class to check for rating changes.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function getGameById(id) {
  try {
    const response = await fetch(`${API_BASE}/games/${id}?key=${API_KEY}`);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/**
 * Checks every watched game for a rating change and shows a summary.
 */
async function handleCheckUpdates() {
  checkUpdatesBtn.disabled = true;
  checkUpdatesBtn.textContent = 'Checking...';
  statusMsg.textContent = '';

  const changedCount = await watchlist.checkForUpdates();

  checkUpdatesBtn.disabled = false;
  checkUpdatesBtn.textContent = 'Check for Updates';
  statusMsg.textContent =
    changedCount > 0 ? `${changedCount} game(s) have a new rating!` : 'No changes found.';
}

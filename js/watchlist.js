/**
 * @file watchlist.js
 * @description Simplest version of a game-tracking class. Keeps a list of
 * watched games in localStorage and can check the RAWG API to see if a
 * game's rating has changed since it was added.
 * @version 1.0.0
 */

/**
 * Watchlist Class
 * @class
 * @property {string} rootId - the id of the html element to display the list in
 * @property {Array} games - the array of watched games
 */
class Watchlist {
  constructor(rootId) {
    this.rootId = rootId;
    this.games = this.load();
    this.refresh();
  }

  /**
   * Loads the saved watchlist from localStorage, if any.
   * @returns {Array}
   */
  load() {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Saves the current watchlist to localStorage.
   */
  save() {
    localStorage.setItem('watchlist', JSON.stringify(this.games));
  }

  /**
   * Adds a game to the watchlist if it isn't already on it.
   * @param {object} game - a game object from the RAWG API search results
   */
  add(game) {
    const alreadyAdded = this.games.some((g) => g.id === game.id);
    if (alreadyAdded) return;

    this.games.push({
      id: game.id,
      title: game.name,
      cover: game.background_image,
      rating: game.rating,
      slug: game.slug,
      updated: false,
    });
    this.save();
    this.refresh();
  }

  /**
   * Removes a game from the watchlist by id.
   * @param {number} id
   */
  remove(id) {
    this.games = this.games.filter((g) => g.id !== id);
    this.save();
    this.refresh();
  }

  /**
   * Re-fetches every watched game from the API and compares its rating
   * to the saved value. Flags any game whose rating has changed.
   * @returns {Promise<number>} how many games changed
   */
  async checkForUpdates() {
    let changedCount = 0;
    for (const game of this.games) {
      const fresh = await getGameById(game.id);
      if (fresh && fresh.rating !== game.rating) {
        game.rating = fresh.rating;
        game.updated = true;
        changedCount++;
      }
    }
    this.save();
    this.refresh();
    return changedCount;
  }

  /**
   * Redraws the watchlist in the DOM.
   */
  refresh() {
    const root = document.getElementById(this.rootId);
    root.innerHTML = '';

    if (this.games.length === 0) {
      root.innerHTML = '<li>Your watchlist is empty. Search for a game above.</li>';
      return;
    }

    this.games.forEach((game) => {
      const li = document.createElement('li');
      li.classList.add('row');

      const img = document.createElement('img');
      img.src = game.cover || 'https://placehold.co/80x60?text=No+Image';
      img.alt = `${game.title} cover art`;
      img.classList.add('cover-thumb');

      const badge = game.updated ? ' 🔔 Rating updated!' : '';
      const text = document.createElement('span');
      text.textContent = `${game.title} - Rating: ${game.rating}${badge}`;

      const link = document.createElement('a');
      link.href = `https://rawg.io/games/${game.slug}`;
      link.textContent = 'View Updates / Patch Info';
      link.target = '_blank';
      link.classList.add('patch-link');

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('remove-btn');
      removeBtn.addEventListener('click', () => this.remove(game.id));

      li.appendChild(img);
      li.appendChild(text);
      li.appendChild(link);
      li.appendChild(removeBtn);
      root.appendChild(li);
    });
  }
}

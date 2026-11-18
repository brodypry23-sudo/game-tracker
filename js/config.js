const CONFIG = {

   // ===== RAWG (game search) =====
  rawg: {
    // Base address of the RAWG API
    baseUrl: 'https://api.rawg.io/api',
    // RAWG API key (a placeholder, replaced with your real key on your own computer)
    apiKey: 'YOUR_RAWG_API_KEY',
    // How many games to show per search
    pageSize: 8
  },

  // ===== STEAM (patch notes and player numbers) =====
  steam: {
    // Address that returns the news and patch notes for a game
    newsUrl: 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/',
    // Address that returns how many people are playing a game right now
    playersUrl: 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/',
    // How many news items to ask for per game
    newsCount: 5
  },

  // ===== SEARCH RULES =====
  search: {
    // Fewest characters allowed in a search
    minLength: 2,
    // Most characters allowed in a search
    maxLength: 40
  },

  // ===== BROWSER STORAGE =====
  storage: {
    // The name the watchlist is saved under in the browser
    watchlistKey: 'gameTrackerWatchlist'
  },

  // ===== CONTACT FORM =====
  contact: {
    // Address of the form service that receives the messages (placeholder until you pick a service)
    formUrl: 'https://formspree.io/f/YOUR_FORM_ID'
  }

};
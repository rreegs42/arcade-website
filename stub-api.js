// TEMPORARY BACKEND: a dummy account and an in-memory leaderboard.
//
// The pages only ever talk to the routes below, so the real version
// (Passport + bcrypt + MongoDB) can replace this file without touching them.
// Keep the same URLs and the same JSON shapes when swapping it out.
//
//   POST /login { username, password } -> { username } | 401 { error }
//   POST /logout -> { ok: true }
//   GET  /api/me -> { username } | 401 { error }
//   GET  /api/games -> [ { id, title, path } ]
//   GET  /api/scores?game=<id> -> [ { username, score, date } ] (top 10)
//   POST /api/scores  { game, score } -> { rank, scores } (rank is null if outside top 10)
//
// Scores reset whenever the server restarts.

import express from "express";

const DUMMY_USER = { username: "player1", password: "arcade" };

export const GAMES = [
  { 
    id: "galaxy-attackers", 
    title: "Galaxy Attackers", 
    path: "/games/galaxy-attackers/",
    thumbnail: "/games/galaxy-attackers/sprites/galaxy_player.png",
    blurb: "Blast waves of swooping bees before they dive at you.",
  },
];

const TOP_N = 10;

// A few made-up scores so the leaderboard isn't empty on first load.
const scores = [
  { game: "galaxy-attackers", username: "ACE", score: 1200, date: new Date().toISOString() },
  { game: "galaxy-attackers", username: "ZAP", score: 850, date: new Date().toISOString() },
  { game: "galaxy-attackers", username: "BEE", score: 400, date: new Date().toISOString() },
];

// Who is logged in, or null. Pages and routes should use this rather than
// reading the session directly, so the real login only has to change it here.
export function currentUser(req) {
  return req.session?.username ?? null;
}

function topScores(game) {
  return scores
    .filter((s) => s.game === game)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_N)
    .map(({ username, score, date }) => ({ username, score, date }));
}

export const stubApi = express.Router();

stubApi.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};
  if (username !== DUMMY_USER.username || password !== DUMMY_USER.password) {
    return res.status(401).json({ error: "Wrong username or password." });
  }
  // New session id on login, so an old cookie can't be reused.
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "Could not start a session." });
    req.session.username = username;
    res.json({ username });
  });
});

stubApi.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

stubApi.get("/api/me", (req, res) => {
  const username = currentUser(req);
  if (!username) return res.status(401).json({ error: "Not logged in." });
  res.json({ username });
});

stubApi.get("/api/games", (req, res) => {
  res.json(GAMES);
});

stubApi.get("/api/scores", (req, res) => {
  const game = String(req.query.game ?? "");
  if (!GAMES.some((g) => g.id === game)) {
    return res.status(400).json({ error: "Unknown game." });
  }
  res.json(topScores(game));
});

stubApi.post("/api/scores", (req, res) => {
  const username = currentUser(req);
  if (!username) return res.status(401).json({ error: "Not logged in." });

  const { game, score } = req.body ?? {};
  if (!GAMES.some((g) => g.id === game)) {
    return res.status(400).json({ error: "Unknown game." });
  }
  if (!Number.isInteger(score) || score < 0 || score > 10_000_000) {
    return res.status(400).json({ error: "Score must be a whole number." });
  }

  // The name comes from the session, never from the request body.
  const entry = { game, username, score, date: new Date().toISOString() };
  scores.push(entry);

  const top = topScores(game);
  const index = top.findIndex((s) => s.date === entry.date && s.username === username && s.score === score);
  res.json({ rank: index === -1 ? null : index + 1, scores: top });
});
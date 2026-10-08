// Leaderboard panel shared by every game page.
// The page needs: <aside class="leaderboard" data-game="<game id>"> containing
// #leaderboard-list and #leaderboard-status, plus #player-name in the top bar.

const panel = document.querySelector(".leaderboard");
const list = document.getElementById("leaderboard-list");
const status = document.getElementById("leaderboard-status");
const playerName = document.getElementById("player-name");
const gameId = panel.dataset.game;

let me = null;

async function getJson(url, options) {
    const res = await fetch(url, options);
    if (res.status === 401) {
        window.location.href = "/login";
        throw new Error("Not logged in");
    }
    if (!res.ok) throw new Error(`${url} answered ${res.status}`);
    return res.json();
}

function row(entry, rank, highlight) {
    const li = document.createElement("li");
    li.className = "leaderboard-row";
    if (entry.username === me) li.classList.add("is-me");
    if (highlight) li.classList.add("is-new");

    const rankEl = document.createElement("span");
    rankEl.className = "lb-rank";
    rankEl.textContent = String(rank).padStart(2, "0");

    const nameEl = document.createElement("span");
    nameEl.className = "lb-name";
    nameEl.textContent = entry.username;

    const scoreEl = document.createElement("span");
    scoreEl.className = "lb-score";
    scoreEl.textContent = entry.score;

    li.append(rankEl, nameEl, scoreEl);
    return li;
}

// Draw a list of scores. newRank (1-based) highlights a just-submitted score.
export function renderLeaderboard(scores, newRank = null) {
    if (scores.length === 0) {
        const empty = document.createElement("li");
        empty.className = "leaderboard-empty";
        empty.textContent = "No scores yet. Be the first!";
        list.replaceChildren(empty);
        return;
    }
    list.replaceChildren(...scores.map((s, i) => row(s, i + 1, i + 1 === newRank)));
}

export async function refreshLeaderboard() {
    try {
        const scores = await getJson(`/api/scores?game=${encodeURIComponent(gameId)}`);
        renderLeaderboard(scores);
        status.textContent = "";
    } catch (err) {
        if (err.message !== "Not logged in") {
            status.textContent = "Couldn't load scores.";
            console.error(err);
        }
    }
}

async function init() {
    try {
        ({ username: me } = await getJson("/api/me"));
        playerName.textContent = me;
    } catch {
        // refreshLeaderboard reports any problem.
    }
    await refreshLeaderboard();
}

init();
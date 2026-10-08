"use strict";

const STORAGE_KEY = "mamad-craft-launcher-data";

const defaults = {
  username: "Mamad",
  version: "1.21.11",
  ram: "2048",
  theme: "dark",
  accounts: [],
  mods: [],
  servers: []
};

let state = loadState();

function loadState() {
  try {
    return {
      ...defaults,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    };
  } catch {
    return { ...defaults };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function notify(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.textContent = "", 3500);
}

const pages = {
  home: ["Dashboard", renderHome],
  accounts: ["Accounts", renderAccounts],
  versions: ["Versions", renderVersions],
  mods: ["Mods", renderMods],
  servers: ["Servers", renderServers],
  transfer: ["Backup / Restore", renderTransfer],
  settings: ["Settings", renderSettings]
};

function navigate(page) {
  if (!pages[page]) page = "home";

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  document.getElementById("title").textContent = pages[page][0];
  document.getElementById("content").innerHTML = pages[page][1]();

  const selector = document.getElementById("version-select");
  if (selector) selector.value = state.version;

  const ramSelector = document.getElementById("ram-select");
  if (ramSelector) ramSelector.value = state.ram;
}

function renderHome() {
  return `
    <div class="panel hero">
      <div>👑 MAMAD CRAFT SMP</div>
      <h2>Ready to play?</h2>
      <p>Your Minecraft launcher. Your profiles. Your settings.</p>
      <button class="action" data-action="play">▶ PLAY</button>
      <p class="description">
        Selected version: ${escapeHTML(state.version)}
      </p>
    </div>

    <div class="grid">
      <div class="panel">
        <h3>👤 Account</h3>
        <p>${escapeHTML(state.username || "Mamad")}</p>
        <button class="action" data-go="accounts">Manage</button>
      </div>
      <div class="panel">
        <h3>🧱 Version</h3>
        <p>${escapeHTML(state.version)}</p>
        <button class="action" data-go="versions">Choose</button>
      </div>
      <div class="panel">
        <h3>🧩 Mods</h3>
        <p>${state.mods.length} saved mod entries</p>
        <button class="action" data-go="mods">Manage</button>
      </div>
      <div class="panel">
        <h3>🌐 Servers</h3>
        <p>${state.servers.length} saved servers</p>
        <button class="action" data-go="servers">View servers</button>
      </div>
    </div>

    <div class="panel">
      <h3>🎙️ Voice Chat</h3>
      <p class="description">
        Voice Chat integration isn't connected yet.
      </p>
    </div>`;
}

function renderAccounts() {
  return `
    <div class="panel">
      <h2>Offline profile</h2>
      <p class="description">
        This is a local profile for the launcher UI, not a Microsoft account.
      </p>
      <form id="account-form">
        <label>Player name</label>
        <input name="username" maxlength="16"
          value="${escapeHTML(state.username)}" required>
        <button class="action">Save profile</button>
      </form>
    </div>

    <div class="panel">
      <h3>Saved profiles</h3>
      ${state.accounts.map((account, index) => `
        <p>👤 ${escapeHTML(account.name)}
          <button data-delete-account="${index}">Delete</button>
        </p>`).join("") || "<p>No extra profiles saved.</p>"}

      <form id="extra-account-form">
        <label>Add another local profile</label>
        <input name="name" maxlength="16" placeholder="Player name" required>
        <button class="action">Add profile</button>
      </form>
    </div>`;
}

function renderVersions() {
  return `
    <div class="panel">
      <h2>Game version</h2>
      <p class="description">
        Choose a version for your saved launcher profile.
        Selecting a version here does not download Minecraft.
      </p>
      <form id="version-form">
        <label>Version</label>
        <select id="version-select" name="version">
          <option>1.21.11</option>
          <option>1.21.10</option>
          <option>1.21.8</option>
          <option>1.21.5</option>
          <option>1.20.1</option>
          <option>Latest</option>
        </select>
        <button class="action">Save version</button>
      </form>
      <div class="panel">
        <h3>Mod loaders</h3>
        <p>Fabric • Forge • NeoForge</p>
        <p class="description">
          Loader installation and actual game launching still need integration.
        </p>
      </div>
    </div>`;
}

function renderMods() {
  return `
    <div class="panel">
      <h2>Mod manager</h2>
      <p class="description">
        Save a list of mods you want to manage. This doesn't install mod files.
      </p>
      <form id="mod-form">
        <label>Mod name</label>
        <input name="name" maxlength="80" placeholder="Sodium" required>
        <button class="action">Add mod</button>
      </form>
    </div>

    <div class="panel">
      <h3>Your mods</h3>
      ${state.mods.map((mod, index) => `
        <p>🧩 ${escapeHTML(mod.name)}
          <button data-delete-mod="${index}">Remove</button>
        </p>`).join("") || "<p>No mods saved yet.</p>"}
    </div>`;
}

function renderServers() {
  return `
    <div class="panel">
      <h2>Server list</h2>
      <form id="server-form">
        <label>Server name</label>
        <input name="name" maxlength="60" placeholder="Mamad Craft SMP" required>
        <label>Server address</label>
        <input name="address" maxlength="200"
          placeholder="play.example.com" required>
        <button class="action">Add server</button>
      </form>
    </div>

    <div class="panel">
      <h3>Saved servers</h3>
      ${state.servers.map((server, index) => `
        <div class="panel">
          <b>${escapeHTML(server.name)}</b>
          <p>${escapeHTML(server.address)}</p>
          <button data-copy-server="${index}">Copy address</button>
          <button data-delete-server="${index}">Remove</button>
        </div>`).join("") || "<p>No servers saved yet.</p>"}
    </div>`;
}

function renderTransfer() {
  return `
    <div class="panel">
      <h2>Backup your launcher data</h2>
      <p class="description">
        Export your saved profiles, mod list, servers and settings to JSON.
      </p>
      <button class="action" data-action="backup">⬇ Export backup</button>
    </div>

    <div class="panel">
      <h2>Restore a backup</h2>
      <p class="description">
        Choose a JSON backup previously exported by this launcher.
      </p>
      <input type="file" id="restore-file" accept=".json,application/json">
      <button class="action" data-action="restore">Restore backup</button>
    </div>`;
}

function renderSettings() {
  return `
    <div class="panel">
      <h2>Launcher settings</h2>
      <form id="settings-form">
        <label>Memory allocation (RAM)</label>
        <select id="ram-select" name="ram">
          <option value="1024">1 GB</option>
          <option value="2048">2 GB</option>
          <option value="3072">3 GB</option>
          <option value="4096">4 GB</option>
          <option value="6144">6 GB</option>
        </select>
        <label>Theme</label>
        <select name="theme">
          <option value="dark">Dark</option>
        </select>
        <button class="action">Save settings</button>
      </form>
      <p class="description">
        These are saved preferences. They do not change Minecraft's actual RAM
        until game-launching support is connected.
      </p>
    </div>`;
}

document.addEventListener("click", async event => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.page) {
    navigate(target.dataset.page);
    return;
  }

  if (target.dataset.go) {
    navigate(target.dataset.go);
    return;
  }

  if (target.dataset.deleteAccount !== undefined) {
    state.accounts.splice(Number(target.dataset.deleteAccount), 1);
    saveState();
    navigate("accounts");
    return;
  }

  if (target.dataset.deleteMod !== undefined) {
    state.mods.splice(Number(target.dataset.deleteMod), 1);
    saveState();
    navigate("mods");
    return;
  }

  if (target.dataset.deleteServer !== undefined) {
    state.servers.splice(Number(target.dataset.deleteServer), 1);
    saveState();
    navigate("servers");
    return;
  }

  if (target.dataset.copyServer !== undefined) {
    const server = state.servers[Number(target.dataset.copyServer)];
    try {
      await navigator.clipboard.writeText(server.address);
      notify("Server address copied!");
    } catch {
      notify(server.address);
    }
    return;
  }

  if (target.dataset.action === "play") {
    notify("Minecraft runtime is not connected yet.");
    return;
  }

  if (target.dataset.action === "backup") {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Mamad-Craft-Launcher-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Backup exported!");
    return;
  }

  if (target.dataset.action === "restore") {
    const file = document.getElementById("restore-file").files[0];
    if (!file) {
      notify("Choose a backup file first.");
      return;
    }

    try {
      const restored = JSON.parse(await file.text());
      if (
        !restored ||
        typeof restored !== "object" ||
        !Array.isArray(restored.accounts) ||
        !Array.isArray(restored.mods) ||
        !Array.isArray(restored.servers)
      ) {
        throw new Error("Invalid backup");
      }

      state = { ...defaults, ...restored };
      saveState();
      navigate("home");
      notify("Backup restored!");
    } catch {
      notify("That backup file is invalid.");
    }
  }
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);

  if (form.id === "account-form") {
    state.username = String(values.get("username") || "Mamad").trim();
    saveState();
    navigate("accounts");
    notify("Profile saved!");
  }

  if (form.id === "extra-account-form") {
    const name = String(values.get("name") || "").trim();
    if (name) state.accounts.push({ name });
    saveState();
    navigate("accounts");
    notify("Profile added!");
  }

  if (form.id === "version-form") {
    state.version = String(values.get("version") || "1.21.11");
    saveState();
    navigate("home");
    notify("Version preference saved!");
  }

  if (form.id === "mod-form") {
    const name = String(values.get("name") || "").trim();
    if (name) state.mods.push({ name });
    saveState();
    navigate("mods");
    notify("Mod entry added!");
  }

  if (form.id === "server-form") {
    const name = String(values.get("name") || "").trim();
    const address = String(values.get("address") || "").trim();
    if (name && address) state.servers.push({ name, address });
    saveState();
    navigate("servers");
    notify("Server saved!");
  }

  if (form.id === "settings-form") {
    state.ram = String(values.get("ram") || "2048");
    state.theme = String(values.get("theme") || "dark");
    saveState();
    notify("Settings saved!");
  }
});

document.querySelectorAll(".nav").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.page));
});

navigate("home");

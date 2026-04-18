const STORAGE_KEY = "nfl_draft_tracker_state";

const baseProspects = [
  { id: 1, name: "Travis Hunter", position: "CB/WR", school: "Colorado", rank: 1, status: "Disponível", pick: "-", onBoard: true },
  { id: 2, name: "Shedeur Sanders", position: "QB", school: "Colorado", rank: 6, status: "Disponível", pick: "-", onBoard: true },
  { id: 3, name: "Abdul Carter", position: "EDGE", school: "Penn State", rank: 2, status: "Disponível", pick: "-", onBoard: true },
  { id: 4, name: "Mason Graham", position: "DT", school: "Michigan", rank: 5, status: "Disponível", pick: "-", onBoard: false },
  { id: 5, name: "Will Johnson", position: "CB", school: "Michigan", rank: 8, status: "Disponível", pick: "-", onBoard: true },
  { id: 6, name: "Tetairoa McMillan", position: "WR", school: "Arizona", rank: 7, status: "Disponível", pick: "-", onBoard: false },
  { id: 7, name: "James Pearce Jr.", position: "EDGE", school: "Tennessee", rank: 9, status: "Disponível", pick: "-", onBoard: false },
  { id: 8, name: "Will Campbell", position: "OT", school: "LSU", rank: 11, status: "Disponível", pick: "-", onBoard: true },
  { id: 9, name: "Malaki Starks", position: "S", school: "Georgia", rank: 10, status: "Disponível", pick: "-", onBoard: false },
  { id: 10, name: "Emeka Egbuka", position: "WR", school: "Ohio State", rank: 13, status: "Disponível", pick: "-", onBoard: true }
];

let prospects = loadState();

const tableBody = document.getElementById("prospectTableBody");
const searchInput = document.getElementById("search");
const positionFilter = document.getElementById("positionFilter");
const schoolFilter = document.getElementById("schoolFilter");
const statusFilter = document.getElementById("statusFilter");

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(baseProspects);

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : structuredClone(baseProspects);
  } catch {
    return structuredClone(baseProspects);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects));
}

function populateFilters() {
  const positions = [...new Set(prospects.map((p) => p.position))].sort();
  const schools = [...new Set(prospects.map((p) => p.school))].sort();

  for (const position of positions) {
    const option = document.createElement("option");
    option.value = position;
    option.textContent = position;
    positionFilter.append(option);
  }

  for (const school of schools) {
    const option = document.createElement("option");
    option.value = school;
    option.textContent = school;
    schoolFilter.append(option);
  }
}

function getStatusClass(status) {
  if (status === "Selecionado") return "selecionado";
  if (status === "No board") return "noboard";
  return "disponivel";
}

function markSelected(id) {
  const pick = prompt("Informe round/escolha (Ex.: R1 #07):");
  if (!pick) return;

  prospects = prospects.map((p) =>
    p.id === id ? { ...p, status: "Selecionado", pick } : p
  );

  persistState();
  render();
}

function toggleBoard(id) {
  prospects = prospects.map((p) =>
    p.id === id
      ? { ...p, onBoard: !p.onBoard, status: !p.onBoard ? "Disponível" : "No board" }
      : p
  );

  persistState();
  render();
}

function filteredProspects() {
  const search = searchInput.value.trim().toLowerCase();
  return prospects
    .filter((p) => !search || p.name.toLowerCase().includes(search))
    .filter((p) => !positionFilter.value || p.position === positionFilter.value)
    .filter((p) => !schoolFilter.value || p.school === schoolFilter.value)
    .filter((p) => !statusFilter.value || p.status === statusFilter.value)
    .sort((a, b) => a.rank - b.rank);
}

function updateStats() {
  document.getElementById("totalProspects").textContent = prospects.length;
  document.getElementById("selectedProspects").textContent = prospects.filter(
    (p) => p.status === "Selecionado"
  ).length;
  document.getElementById("boardProspects").textContent = prospects.filter(
    (p) => p.onBoard
  ).length;
}

function render() {
  const rows = filteredProspects();
  tableBody.innerHTML = "";

  for (const prospect of rows) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prospect.name}</td>
      <td>${prospect.position}</td>
      <td>${prospect.school}</td>
      <td>#${prospect.rank}</td>
      <td><span class="badge ${getStatusClass(prospect.status)}">${prospect.status}</span></td>
      <td>${prospect.pick}</td>
      <td>
        <button class="action-btn ${prospect.onBoard ? "active" : ""}" data-action="board" data-id="${prospect.id}">
          ${prospect.onBoard ? "Remover" : "Adicionar"}
        </button>
        <button class="action-btn" data-action="select" data-id="${prospect.id}">
          Draftado
        </button>
      </td>
    `;
    tableBody.append(tr);
  }

  updateStats();
}

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "board") toggleBoard(id);
  if (action === "select") markSelected(id);
});

for (const element of [searchInput, positionFilter, schoolFilter, statusFilter]) {
  element.addEventListener("input", render);
  element.addEventListener("change", render);
}

populateFilters();
render();

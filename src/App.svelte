<script>
import './catalog.css';
import { data } from './data.js';

const { CLASSIFICATIONS, CATEGORIES, COMPONENTS } = data;

let selectedCategory = $state("All");
let selectedComponent = $state(null);
let filterEcosystem = $state("All");
let sortBy = $state("name");

const ecosystems = $derived.by(() => {
  const set = new Set(COMPONENTS.map(c => c.ecosystem));
  return ["All", ...Array.from(set).sort()];
});

const filtered = $derived.by(() => {
  let result = COMPONENTS;
  if (selectedCategory !== "All") {
    result = result.filter(c => c.category === selectedCategory);
  }
  if (filterEcosystem !== "All") {
    result = result.filter(c => c.ecosystem === filterEcosystem);
  }
  if (sortBy === "name") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy in CLASSIFICATIONS) {
    result = [...result].sort((a, b) => b.classifications[sortBy] - a.classifications[sortBy]);
  }
  return result;
});

const selectedComp = $derived(COMPONENTS.find(c => c.id === selectedComponent));

const levelColors = [
  { bg: "#1a2332", fg: "#6b8aad", border: "#2a3a4f" },
  { bg: "#1a2a1a", fg: "#7aad6b", border: "#2a4f2a" },
  { bg: "#2a2a1a", fg: "#ad9f6b", border: "#4f4a2a" },
  { bg: "#2a1a2a", fg: "#ad6b9f", border: "#4f2a4a" },
];
</script>

<div class="app">
  <!-- Header -->
  <div class="header">
    <div class="subtitle">
      Standard Catalogue of Software Components — Rev. 2025
    </div>
    <h1>McIlroy's Catalog</h1>
    <p class="description">
      Components classified by precision, robustness, time-space performance, size limits, and binding time of parameters — as specified by M. Douglas McIlroy at the NATO Software Engineering Conference, Garmisch, October 1968.
    </p>

    <!-- Epigraph -->
    <div class="epigraph">
      <p class="quote">
        "I would like to see standard catalogues of routines, classified by precision, robustness, time-space performance, size limits, and binding time of parameters."
      </p>
      <p class="attribution">— M. D. McIlroy, 1968</p>
    </div>
  </div>

  <div class="main-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="section-title">Categories</div>
      {#each ["All", ...CATEGORIES] as cat}
        <button
          class="sidebar-button"
          class:active={selectedCategory === cat}
          onclick={() => { selectedCategory = cat; selectedComponent = null; }}
        >
          {cat}
          {#if cat !== "All"}
            <span class="count">{COMPONENTS.filter(c => c.category === cat).length}</span>
          {/if}
        </button>
      {/each}

      <div class="section-title" style="margin-top: 16px;">Filter by Ecosystem</div>
      {#each ecosystems as eco}
        <button
          class="sidebar-button"
          class:active={filterEcosystem === eco}
          onclick={() => filterEcosystem = eco}
        >
          {eco}
        </button>
      {/each}

      <div class="section-title" style="margin-top: 16px;">Sort By</div>
      {#each [
        { key: "name", label: "Name" },
        ...Object.entries(CLASSIFICATIONS).map(([k, v]) => ({ key: k, label: v.label }))
      ] as s}
        <button
          class="sidebar-button"
          class:active={sortBy === s.key}
          onclick={() => sortBy = s.key}
        >
          {s.label} {sortBy === s.key ? "↓" : ""}
        </button>
      {/each}

      <!-- Classification Legend -->
      <div class="legend">
        <div class="legend-title">Classification Key</div>
        {#each Object.entries(CLASSIFICATIONS) as [key, cls]}
          <div class="legend-item">
            <div class="legend-label">{cls.label}</div>
            <div class="legend-desc">{cls.description}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Main content -->
    <div class="content">
      <!-- Status bar -->
      <div class="status-bar">
        <span class="status-text">
          {filtered.length} component{filtered.length !== 1 ? "s" : ""} indexed
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
          {filterEcosystem !== "All" ? ` · ${filterEcosystem}` : ""}
        </span>
      </div>

      <!-- Detail panel -->
      {#if selectedComp}
        <div class="detail-panel">
          <button class="close-btn" onclick={() => selectedComponent = null}>✕ CLOSE</button>

          <div class="detail-header">
            <div class="detail-title-row">
              <h2>{selectedComp.name}</h2>
              <span class="detail-ecosystem">{selectedComp.ecosystem}</span>
            </div>
            <div class="detail-meta">
              {selectedComp.category} — {selectedComp.license}
            </div>
            <p class="detail-summary">{selectedComp.summary}</p>
          </div>

          <div class="detail-grid">
            <div>
              <div class="detail-section-title">Classification Matrix</div>
              {#each Object.keys(CLASSIFICATIONS) as key}
                <div class="classification-detail">
                  <div class="classification-detail-row">
                    <span class="classification-detail-label">{CLASSIFICATIONS[key].label}</span>
                    <span class="classification-detail-value" style="color: {levelColors[selectedComp.classifications[key]].fg}">
                      {CLASSIFICATIONS[key].levels[selectedComp.classifications[key]]}
                    </span>
                  </div>
                  <div class="classification-detail-bar">
                    {#each [0, 1, 2, 3] as i}
                      <div
                        class="bar-segment"
                        style="background: {i <= selectedComp.classifications[key] ? levelColors[selectedComp.classifications[key]].fg : '#0f1520'}; opacity: {i <= selectedComp.classifications[key] ? 1 : 0.2}"
                      ></div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>

            <div>
              <div class="detail-section-title">Engineering Notes</div>
              <p class="detail-text">{selectedComp.notes}</p>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">Portability & Transliteration</div>
            <p class="detail-text">{selectedComp.portability}</p>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">Comparable Components</div>
            <div class="comparable-tags">
              {#each selectedComp.comparable as c}
                <span class="comparable-tag">{c}</span>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- Grid -->
      <div class="grid">
        {#each filtered as comp (comp.id)}
          <button
            type="button"
            class="card"
            class:selected={selectedComponent === comp.id}
            onclick={() => selectedComponent = comp.id}
          >
            {#if selectedComponent === comp.id}
              <div class="card-indicator"></div>
            {/if}
            <div class="card-header">
              <div>
                <span class="card-name">{comp.name}</span>
                <span class="card-ecosystem">{comp.ecosystem}</span>
              </div>
            </div>
            <p class="card-summary">{comp.summary}</p>
            <div class="card-classifications">
              {#each Object.keys(CLASSIFICATIONS) as key}
                <div class="classification-bar">
                  <div class="classification-bar-header">
                    <span class="classification-bar-label">{CLASSIFICATIONS[key].label}</span>
                    <span class="classification-bar-value">{CLASSIFICATIONS[key].levels[comp.classifications[key]]}</span>
                  </div>
                  <div class="classification-bar-segments">
                    {#each [0, 1, 2, 3] as i}
                      <div
                        class="bar-segment"
                        style="background: {i <= comp.classifications[key] ? levelColors[comp.classifications[key]].fg : '#1a1f2a'}; opacity: {i <= comp.classifications[key] ? 1 : 0.3}"
                      ></div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </button>
        {/each}
      </div>

      {#if filtered.length === 0}
        <div class="empty-state">
          No components match the current filters.
        </div>
      {/if}
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <span>"What I have just asked for is simply industrialism." — McIlroy, 1968</span>
    <span>Catalog Rev. 2025.02</span>
  </div>
</div>

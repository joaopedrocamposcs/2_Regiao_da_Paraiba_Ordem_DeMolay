import { regionalUnits } from '../data/regional-units.js';

function renderUnits(selectedCity = 'Todos') {
  const grid = document.getElementById('units-grid');
  grid.innerHTML = '';

  const filtered = selectedCity === 'Todos'
    ? regionalUnits
    : regionalUnits.filter(unit => unit.city === selectedCity);

  filtered.forEach(unit => {
    const locationDisplay = unit.regionLabel || `${unit.city} - ${unit.state}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.mapsLocation)}`;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-gray-200 hover:border-gold shadow-sm hover:shadow-lg transition-all p-6 flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${unit.badgeColor}">
            ${unit.type}
          </span>
          <span class="px-2.5 py-0.5 rounded-md bg-cream border border-gold/40 text-[11px] font-semibold text-crimson-dark">
            ${unit.ageGroup}
          </span>
        </div>

        <div class="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 mb-2">
          <svg class="w-3.5 h-3.5 text-crimson" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
          </svg>
          <span>${locationDisplay}</span>
        </div>

        <h3 class="font-serif text-lg font-bold text-crimson-dark leading-snug mb-2">
          ${unit.name}
        </h3>

        <p class="text-gray-600 text-sm leading-relaxed mb-6">
          ${unit.description}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2.5 pt-4 border-t border-gray-100">
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cream hover:bg-gold/20 text-crimson-dark border border-gold/40 text-xs font-bold transition-colors">
          <svg class="w-4 h-4 text-crimson" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Ver Localização (Maps)</span>
        </a>

        <a href="${unit.instaUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-crimson hover:bg-crimson-dark text-white text-xs font-bold transition-colors">
          <svg class="w-4 h-4 text-gold-light" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          </svg>
          <span>Instagram</span>
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

function setActiveFilter(selectedCity) {
  document.querySelectorAll('.filter-btn').forEach(button => {
    const isSelected = button.dataset.city === selectedCity;
    button.classList.toggle('bg-crimson', isSelected);
    button.classList.toggle('text-white', isSelected);
    button.classList.toggle('shadow-md', isSelected);
    button.classList.toggle('bg-white', !isSelected);
    button.classList.toggle('text-charcoal', !isSelected);
    button.classList.toggle('border', !isSelected);
    button.classList.toggle('border-gray-200', !isSelected);
  });
  renderUnits(selectedCity);
}

export function initializeUnits() {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => setActiveFilter(button.dataset.city));
  });
  renderUnits();
}

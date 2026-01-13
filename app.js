const kasszak = [];
let selectedKassza = null;
const selectedProducts = new Set();

// Kassza generálás (16 db)
const kasszaContainer = document.getElementById('kasszaList');
for (let i = 1; i <= 16; i++) {
  const div = document.createElement('div');
  div.classList.add('kassza');
  div.id = 'kassza_' + i;
  div.innerHTML = `Kassza ${i}<div class="items"></div>`;
  div.addEventListener('click', () => selectKassza(i));
  kasszaContainer.appendChild(div);
  kasszak.push({id: i, element: div, items: []});
}

// Betöltés localStorage-ból
function loadFromStorage() {
  const data = localStorage.getItem('kasszaData');
  if (data) {
    const parsed = JSON.parse(data);
    parsed.forEach((k, index) => {
      kasszak[index].items = k.items;
      kasszak[index].element.querySelector('.items').innerHTML = k.items.join(', ');
    });
  }
}
loadFromStorage();
updateSummary();

// Kassza kiválasztás
function selectKassza(i) {
  kasszak.forEach(k => k.element.classList.remove('selected'));
  selectedKassza = kasszak[i - 1];
  selectedKassza.element.classList.add('selected');
}

// Termék kiválasztás / toggle
function toggleProduct(prod) {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent === prod);
  if (selectedProducts.has(prod)) {
    selectedProducts.delete(prod);
    btn.classList.remove('selected');
  } else {
    selectedProducts.add(prod);
    btn.classList.add('selected');
  }
}

// Mentés localStorage-ba
function saveToStorage() {
  const data = kasszak.map(k => ({items: k.items}));
  localStorage.setItem('kasszaData', JSON.stringify(data));
}

// Done gomb
document.getElementById('doneBtn').addEventListener('click', () => {
  if (!selectedKassza) {
    alert('Válassz kasszát!');
    return;
  }

  selectedProducts.forEach(prod => {
    // csak akkor adja hozzá, ha még nincs benne
    if (!selectedKassza.items.includes(prod)) {
      selectedKassza.items.push(prod);
    }
  });

  selectedKassza.element.querySelector('.items').innerHTML =
    selectedKassza.items.join(', ');

  // termék gombok visszaállítása
  selectedProducts.forEach(prod => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => b.textContent === prod);
    if (btn) btn.classList.remove('selected');
  });

  selectedProducts.clear();
  saveToStorage();
  updateSummary();
});

// Clear gomb (csak kiválasztott kassza)
document.getElementById('clearBtn').addEventListener('click', () => {
  if (!selectedKassza) { alert('Válassz kasszát!'); return; }
  selectedKassza.items = [];
  selectedKassza.element.querySelector('.items').innerHTML = '';
  saveToStorage();
  updateSummary();
});

// Reset All gomb (minden kassza)
document.getElementById('resetAllBtn').addEventListener('click', () => {
  if (!confirm("Biztosan törlöd az összes kassza tartalmát?")) return;
  
  kasszak.forEach(k => {
    k.items = [];
    k.element.querySelector('.items').innerHTML = '';
  });
  
  localStorage.removeItem('kasszaData');
  updateSummary(); 
});

function updateSummary() {
  const summary = {};

  kasszak.forEach(kassza => {
    kassza.items.forEach(item => {
      summary[item] = (summary[item] || 0) + 1;
    });
  });

  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = '';

  Object.entries(summary).forEach(([item, count]) => {
    const p = document.createElement('p');
    p.textContent = `${item}: ${count}`;
    summaryDiv.appendChild(p);
  });
}


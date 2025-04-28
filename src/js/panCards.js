document.addEventListener('DOMContentLoaded', function() {
    fetch('json/pans.json')
        .then(response => response.json())
        .then(data => {
            allPans = data.pans;
            localStorage.setItem('pansData', JSON.stringify(data));
            renderPanCards(allPans);
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
            const storedData = localStorage.getItem('pansData');
            if (storedData) {
                allPans = JSON.parse(storedData).pans;
                renderPanCards(allPans);
            }
        });
});

let currentPan = null;
let currentStep = 0;
const totalSteps = 3;
let timeoutId;

function renderPanCards(pans) {
    const container = document.getElementById('pan-cards-container');
    container.innerHTML = '';
    
    pans.forEach(pan => {
        const panCard = document.createElement('div');
        panCard.className = 'pan-card';
        panCard.innerHTML = `
            <div class="pan-card-image">
                <img src="${pan.image}" 
                     alt="${pan.title}" 
                     class="w-full h-full object-cover">
                <div class="absolute top-0 right-0 m-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${pan.statusColor}-100 text-${pan.statusColor}-800">
                        <span class="w-2 h-2 mr-2 bg-${pan.statusColor}-500 rounded-full"></span>
                        ${pan.status}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <h3 class="font-semibold text-lg text-[var(--color-dark-green)] mb-3">${pan.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${pan.description}</p>
                <div class="flex justify-between items-center mt-auto">
                    <div class="flex items-center space-x-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${pan.tag1Color}-100 text-${pan.tag1Color}-800">
                            ${pan.tag1}
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${pan.tag2Color}-100 text-${pan.tag2Color}-800">
                            ${pan.tag2}
                        </span>
                    </div>
                    <button onclick="abrirDetalhesPAN(${pan.id})" class="text-[var(--color-dark-green)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors duration-300 flex items-center group">
                        Ver detalhes
                        <svg class="w-4 h-4 ml-1 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(panCard);
    });
}

function filtrarPANs() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const searchInput = document.getElementById('pan-search-input');
        const searchTerm = searchInput.value.toLowerCase();
        
        if (!searchTerm) {
            renderPanCards(allPans);
            return;
        }
        
        const filteredPans = allPans.filter(pan => {
            return (
                pan.title.toLowerCase().includes(searchTerm) ||
                pan.description.toLowerCase().includes(searchTerm) ||
                pan.status.toLowerCase().includes(searchTerm) ||
                pan.tag1.toLowerCase().includes(searchTerm) ||
                pan.tag2.toLowerCase().includes(searchTerm) ||
                (pan.specificObjectives && pan.specificObjectives.some(obj => 
                    obj.title.toLowerCase().includes(searchTerm) || 
                    obj.description.toLowerCase().includes(searchTerm)
                ))
            );
        });
        
        renderPanCards(filteredPans);
    }, 300); 
}

function abrirDetalhesPAN(panId) {
    const storedData = localStorage.getItem('pansData');
    if (!storedData) {
        console.error('Dados dos PANs não encontrados');
        return;
    }

    const data = JSON.parse(storedData);
    currentPan = data.pans.find(pan => pan.id === panId);
    
    if (!currentPan) {
        console.error('PAN não encontrado');
        return;
    }

    document.querySelector('#modal-detalhes h2').textContent = currentPan.title;

    const stepDotsContainer = document.querySelector('#modal-detalhes .step-dots');
    stepDotsContainer.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('div');
        dot.className = `step-dot w-3 h-3 rounded-full cursor-pointer ${i === 0 ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`;
        dot.onclick = () => mostrarEtapa(i);
        stepDotsContainer.appendChild(dot);
    }

    if (currentPan.statusReason) {
        const statusInfo = document.createElement('p');
        statusInfo.className = 'text-sm text-gray-500 mt-2';
        statusInfo.textContent = `Motivo: ${currentPan.statusReason}`;
        document.querySelector('#modal-detalhes h2').insertAdjacentElement('afterend', statusInfo);
    }

    preencherConteudoModal();

    document.getElementById('modal-detalhes').classList.remove('hidden');
    mostrarEtapa(0);
}

function preencherConteudoModal() {
    const stepContent = document.querySelector('#modal-detalhes .step-content');
    stepContent.innerHTML = `
        <div class="step active">
            <h3 class="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Andamento Geral do PAN</h3>
            ${currentPan.statusReason ? `
                <div class="bg-${currentPan.statusColor}-50 border-l-4 border-${currentPan.statusColor}-500 p-4 mb-6">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-${currentPan.statusColor}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-${currentPan.statusColor}-700">
                                ${currentPan.statusReason}
                            </p>
                        </div>
                    </div>
                </div>
            ` : ''}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-semibold text-[var(--color-dark-green)] mb-4">Progresso das Ações</h4>
                    <div class="flex items-center justify-center mb-4">
                        <div class="relative w-32 h-32">
                            <svg class="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e6e6e6"
                                    stroke-width="3"
                                />
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    stroke-width="3"
                                    stroke-dasharray="${currentPan.progress}, 100"
                                />
                            </svg>
                            <span class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                                ${currentPan.progress}%
                            </span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 text-center">
                        ${Math.round(currentPan.progress * 20 / 100)} de 20 ações em execução
                    </div>
                </div>
                <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 class="text-lg font-semibold text-[var(--color-dark-green)] mb-4">Período de Vigência</h4>
                    <div class="text-center">
                        <span class="text-4xl font-bold text-[var(--color-primary)] block mb-2">${currentPan.period}</span>
                        <span class="text-sm text-gray-600">${currentPan.duration}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="step hidden">
            <h3 class="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Objetivo Geral</h3>
            <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p class="text-gray-700">${currentPan.generalObjective}</p>
            </div>
        </div>

        <div class="step hidden">
            <h3 class="text-xl font-semibold text-[var(--color-dark-green)] mb-4">Objetivos Específicos</h3>
            <div class="space-y-6">
                ${currentPan.specificObjectives.map(obj => `
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold text-[var(--color-dark-green)] mb-2">${obj.title}</h4>
                                <p class="text-gray-700 mb-4">${obj.description}</p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${obj.progress === 100 ? 'green' : 'blue'}-100 text-${obj.progress === 100 ? 'green' : 'blue'}-800">
                                ${obj.progress}% Concluído
                            </span>
                        </div>
                        <div class="pl-4 space-y-2">
                            ${obj.actions.map(action => `
                                <p class="text-sm text-gray-600 flex items-center">
                                    ${action.includes('(concluído)') ? `
                                        <svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    ` : `
                                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    `}
                                    ${action.replace('(concluído)', '')}
                                </p>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function mostrarEtapa(etapa) {
    currentStep = etapa;
    const steps = document.querySelectorAll('#modal-detalhes .step');
    const dots = document.querySelectorAll('#modal-detalhes .step-dot');
    const etapaAnterior = document.getElementById('etapa-anterior');
    const proximaEtapa = document.getElementById('proxima-etapa');
    
    steps.forEach((step, index) => {
        if (index === etapa) {
            step.classList.remove('hidden');
            step.classList.add('active');
        } else {
            step.classList.add('hidden');
            step.classList.remove('active');
        }
    });
    
    dots.forEach((dot, index) => {
        if (index === etapa) {
            dot.classList.remove('bg-gray-300');
            dot.classList.add('bg-[var(--color-primary)]');
        } else {
            dot.classList.add('bg-gray-300');
            dot.classList.remove('bg-[var(--color-primary)]');
        }
    });

    if(etapa === 0) {
        etapaAnterior.classList.add('hidden');
        proximaEtapa.classList.add('ml-auto');
    } else {
        etapaAnterior.classList.remove('hidden');
        proximaEtapa.classList.remove('ml-auto');
    }
    
    if(etapa === totalSteps - 1) {
        proximaEtapa.classList.add('hidden');
    } else {
        proximaEtapa.classList.remove('hidden');
    }
}

function proximaEtapa() {
    if (currentStep < totalSteps - 1) {
        mostrarEtapa(currentStep + 1);
    }
}

function etapaAnterior() {
    if (currentStep > 0) {
        mostrarEtapa(currentStep - 1);
    }
}

function fecharDetalhesPAN() {
    document.getElementById('modal-detalhes').classList.add('hidden');
    currentPan = null;
    currentStep = 0;
}

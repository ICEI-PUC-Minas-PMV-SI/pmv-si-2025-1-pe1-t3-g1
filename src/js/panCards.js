document.addEventListener('DOMContentLoaded', function() {
    fetch('json/pans.json')
        .then(response => response.json())
        .then(data => {
            allPans = data.pans;
            localStorage.setItem('pansData', JSON.stringify(data));
            renderPanCards(allPans);
            updateMonitoringCharts(allPans);
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
            const storedData = localStorage.getItem('pansData');
            if (storedData) {
                allPans = JSON.parse(storedData).pans;
                renderPanCards(allPans);
                updateMonitoringCharts(allPans);
            }
        });
});

let currentPan = null;
let currentStep = 0;
const totalSteps = 3;
let timeoutId;

document.addEventListener('panDataUpdated', () => {
    const storedData = JSON.parse(localStorage.getItem('pansData'));
    renderPanCards(storedData.pans);
});

function removerPan(id) {
    const storedData = JSON.parse(localStorage.getItem('pansData'));
    const pansAtualizados = storedData.pans.filter((pan) => pan.id !== id);

    localStorage.setItem("pansData", JSON.stringify({ pans: pansAtualizados }));

    document.dispatchEvent(new Event("panDataUpdated"));
}

function editarPan(id) {
    const panForm = document.getElementById("pan-form");
    const stored = JSON.parse(localStorage.getItem("pansData")) || { pans: [] };
    const pan = stored.pans.find((p) => p.id === id);
    if (!pan) return alert("PAN não encontrado.");

    panForm.elements["editingId"].value = pan.id;
    panForm.elements["title"].value = pan.title;
    panForm.elements["description"].value = pan.description;
    panForm.elements["image"].value = pan.image || "";
    panForm.elements["tag1"].value = pan.tag1;
    panForm.elements["tag1Color"].value = pan.tag1Color;
    panForm.elements["period"].value = pan.period;
    panForm.elements["duration"].value = pan.duration;
    panForm.elements["generalObjective"].value = pan.generalObjective;

    const container = document.getElementById("specific-objectives-container");
    container.innerHTML = "";

    pan.specificObjectives.forEach((obj, i) => {
        const template = document
        .getElementById("objective-template")
        .content.cloneNode(true);
        template.querySelector(".objective-number").textContent = i + 1;
        template.querySelector('input[name$="[title]"]').value = obj.title;
        template.querySelector('textarea[name$="[description]"]').value =
        obj.description;

        const actionsContainer = template.querySelector(".actions-container");
        const actionGroup = actionsContainer.querySelector(".action-group");
        actionsContainer.innerHTML = "";

        obj.actions.forEach((action) => {
        const clone = actionGroup.cloneNode(true);
        clone.querySelector('input[name$="[description]"]').value =
            action.description;
        clone.querySelector('select[name$="[status]"]').value = action.status;
        actionsContainer.appendChild(clone);
        });

        container.appendChild(template);
    });

    document.querySelector("#pan-modal h3").textContent = "Editar PAN";
    document.getElementById("pan-modal").classList.remove("hidden");
}

function renderPanCards(pans) {
    const container = document.getElementById('pan-cards-container');
    container.innerHTML = '';
    
    pans.forEach(pan => {
        const panStatus = calculatePanStatus(pan);

        pan.status = panStatus.status;
        pan.statusColor = panStatus.statusColor;
        pan.tag2 = panStatus.tag2;
        pan.tag2Color = panStatus.tag2Color;
        pan.progress = panStatus.progress;

        const panCard = document.createElement('div');
        panCard.className = 'pan-card';
        panCard.innerHTML = `
            <div class="pan-card-image">
                <img src="${pan?.image ?? 'img/default.webp'}" 
                     alt="${pan.title}" 
                     class="w-full h-full object-cover">
                <div class="absolute top-0 right-0 m-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${panStatus.statusColor}-100 text-${panStatus.statusColor}-800">
                        <span class="w-2 h-2 mr-2 bg-${panStatus.statusColor}-500 rounded-full"></span>
                        ${panStatus.status}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <h3 class="font-semibold text-lg text-[var(--color-dark-green)] mb-3">${pan.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${pan.description}</p>
                <div class="flex items-center space-x-2 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${pan.tag1Color}-100 text-${pan.tag1Color}-800">
                        ${pan.tag1}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${panStatus.tag2Color}-100 text-${panStatus.tag2Color}-800">
                        ${panStatus.tag2}
                    </span>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="abrirDetalhesPAN(${pan.id})" class="text-[var(--color-dark-green)] hover:text-[var(--color-primary)] text-sm font-medium transition-colors duration-300 flex items-center group">
                        <span class="material-icons text-base mr-1">visibility</span>
                        Ver detalhes
                    </button>
                    <button onclick="editarPan(${pan.id})" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition-colors duration-300 flex items-center group">
                        <span class="material-icons text-base mr-1">edit</span>
                        Editar
                    </button>
                    <button onclick="removerPan(${pan.id})" class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300 flex items-center group">
                        <span class="material-icons text-base mr-1">delete</span>
                        Remover
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
            updateMonitoringCharts(allPans);
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
                    obj.description.toLowerCase().includes(searchTerm) ||
                    obj.actions.some(action => 
                        action.description.toLowerCase().includes(searchTerm)
                    )
                ))
            );
        });
        
        renderPanCards(filteredPans);
        updateMonitoringCharts(filteredPans);
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

    const stepDotsContainer = document.querySelector('#modal-detalhes .flex.justify-center.gap-2');
    stepDotsContainer.innerHTML = '';
    for (let i = 0; i < totalSteps; i++) {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-[var(--color-primary)] scale-125' : 'bg-gray-300'}`;
        dot.onclick = () => mostrarEtapa(i);
        stepDotsContainer.appendChild(dot);
    }

    preencherConteudoModal();

    document.getElementById('modal-detalhes').classList.remove('hidden');
    mostrarEtapa(0);
}

function calculateObjectiveProgress(objective) {
    let totalActions = objective.actions.length;
    let completedActions = objective.actions.filter(action => action.status === 'completed').length;
    return Math.round((completedActions / totalActions) * 100);
}

function preencherConteudoModal() {
    let totalActions = 0;
    let actionsInProgress = 0;
    let completedActions = 0;
    
    currentPan.specificObjectives.forEach(obj => {
        if (obj.actions) {
            obj.actions.forEach(action => {
                totalActions++;
                if (typeof action === 'object') {
                    if (action.status === 'in_progress') {
                        actionsInProgress++;
                    } else if (action.status === 'completed') {
                        completedActions++;
                    }
                }
            });
        }
    });

    const progress = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    currentPan.progress = progress;
    
    function getActionStatusText(total, inProgress, completed) {
        if (completed === total) {
            return `${total} ações concluídas`;
        } else if (inProgress === 0 && completed === 0) {
            return `${total} ações não iniciadas`;
        } else {
            const remaining = total - completed;
            return `${inProgress} em execução, ${completed} concluídas, ${remaining} restantes`;
        }
    }

    const statusText = getActionStatusText(totalActions, actionsInProgress, completedActions);
    
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
                                    stroke-dasharray="${progress}, 100"
                                />
                            </svg>
                            <span class="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[var(--color-primary)]">
                                ${progress}%
                            </span>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600 text-center">
                        ${statusText}
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
                ${currentPan.specificObjectives.map(obj => {
                    const objectiveProgress = calculateObjectiveProgress(obj);
                    return `
                    <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold text-[var(--color-dark-green)] mb-2">${obj.title}</h4>
                                <p class="text-gray-700 mb-4">${obj.description}</p>
                            </div>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${objectiveProgress === 100 ? 'green' : 'blue'}-100 text-${objectiveProgress === 100 ? 'green' : 'blue'}-800">
                                ${objectiveProgress}% Concluído
                            </span>
                        </div>
                        <div class="pl-4 space-y-2">
                            ${obj.actions.map(action => `
                                <p class="text-sm ${getStatusClass(action.status)} flex items-center">
                                    ${getStatusIcon(action.status)}
                                    ${action.description}
                                </p>
                            `).join('')}
                        </div>
                    </div>
                `}).join('')}
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

    document.querySelectorAll('#modal-detalhes .flex.justify-center.gap-2 button').forEach((dot, index) => {
        if (index === etapa) {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] scale-125 transition-all duration-300';
        } else {
            dot.className = 'w-2.5 h-2.5 rounded-full bg-gray-300 transition-all duration-300';
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

function updateMonitoringCharts(pans) {
    const totalActions = pans.reduce((total, pan) => {
        return total + pan.specificObjectives.reduce((objTotal, obj) => {
            return objTotal + obj.actions.length;
        }, 0);
    }, 0);

    const actionCounts = pans.reduce((counts, pan) => {
        pan.specificObjectives.forEach(obj => {
            obj.actions.forEach(action => {
                switch (action.status) {
                    case 'completed':
                        counts.completed++;
                        break;
                    case 'in_progress':
                        counts.inProgress++;
                        break;
                    case 'not_started':
                        counts.notStarted++;
                        break;
                }
            });
        });
        return counts;
    }, { completed: 0, inProgress: 0, notStarted: 0 });

    const overallProgress = Math.round((actionCounts.completed / totalActions) * 100) || 0;

    const progressRing = document.querySelector('.progress-ring');
    const progressColor = getProgressColor(overallProgress);
    progressRing.setAttribute('data-progress', overallProgress);
    progressRing.style.background = `conic-gradient(${progressColor} ${overallProgress}%, #f3f4f6 0%)`;
    progressRing.querySelector('span').textContent = `${overallProgress}%`;
    progressRing.querySelector('span').style.color = progressColor;

    const bars = document.querySelectorAll('.bar');

    bars[0].style.height = `${(actionCounts.inProgress / totalActions) * 100}%`;
    bars[0].querySelector('.bar-value').textContent = actionCounts.inProgress;

    bars[1].style.height = `${(actionCounts.completed / totalActions) * 100}%`;
    bars[1].querySelector('.bar-value').textContent = actionCounts.completed;

    bars[2].style.height = `${(actionCounts.notStarted / totalActions) * 100}%`;
    bars[2].querySelector('.bar-value').textContent = actionCounts.notStarted;

    const totalPansElement = document.querySelector('.text-5xl.font-bold');
    if (totalPansElement) {
        totalPansElement.textContent = pans.length;
    }
}

function getProgressColor(percentage) {
    if (percentage >= 100) return '#22c55e';
    if (percentage >= 70) return '#22c55e';
    if (percentage >= 40) return '#eab308';
    if (percentage >= 20) return '#f97316';
    return '#ef4444';
}

function getStatusIcon(status) {
    switch (status) {
        case 'completed':
            return `<svg class="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>`;
        case 'in_progress':
            return `<svg class="w-4 h-4 mr-1 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>`;
        default:
            return `<svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>`;
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'completed':
            return 'text-green-600';
        case 'in_progress':
            return 'text-yellow-600';
        default:
            return 'text-gray-600';
    }
}

function calculatePanStatus(pan) {
    let totalActions = 0;
    let completedActions = 0;
    let inProgressActions = 0;
    let notStartedActions = 0;

    pan.specificObjectives.forEach(objective => {
        objective.actions.forEach(action => {
            totalActions++;
            switch (action.status) {
                case 'completed':
                    completedActions++;
                    break;
                case 'in_progress':
                    inProgressActions++;
                    break;
                case 'not_started':
                    notStartedActions++;
                    break;
            }
        });
    });

    const progressPercentage = Math.round((completedActions / totalActions) * 100);

    let status, statusColor, tag2Color;

    if (completedActions === totalActions) {
        status = "Concluído";
        statusColor = "green";
    } else if (inProgressActions > 0) {
        status = "Ativo";
        statusColor = "blue";
    } else if (completedActions > 0) {
        status = "Parado";
        statusColor = "red";
    } else {
        status = "Não Iniciado";
        statusColor = "gray";
    }

    if (progressPercentage === 100) {
        tag2Color = "green";
    } else if (progressPercentage >= 70) {
        tag2Color = "green-500";
    } else if (progressPercentage >= 40) {
        tag2Color = "yellow";
    } else if (progressPercentage >= 20) {
        tag2Color = "orange";
    } else {
        tag2Color = "red";
    }

    return {
        status,
        statusColor,
        tag2: `${progressPercentage}% Concluído`,
        tag2Color,
        progress: progressPercentage
    };
}

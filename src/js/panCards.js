const MODAL_TITLES = {
    ADD: "Adicionar Novo PAN",
    EDIT: "Editar PAN"
};

let allPans = [];
let currentDisplayedPans = [];
let currentPage = 1;
let cardsPerPage = 3;


function setModalTitle(type) {
    const modalTitle = document.querySelector("#pan-modal .modal-title");
    if (modalTitle) {
        modalTitle.textContent = MODAL_TITLES[type];
    }
}

function abrirAdicionarPan() {
    const panForm = document.getElementById("pan-form");
    if (panForm) {
        panForm.reset();
        panForm.elements["editingId"].value = "";
        setModalTitle('ADD');
        document.getElementById("pan-modal").classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }
}

function fecharModal() {
    window.closeModal();
}

function initializeModalControls() {
    const addButton = document.getElementById('add-pan-button');
    const closeButton = document.getElementById('close-modal');
    const cancelButton = document.getElementById('cancel-form');

    if (addButton) {
        addButton.removeEventListener('click', abrirAdicionarPan);
        addButton.addEventListener('click', abrirAdicionarPan);
    }

    if (closeButton) {
        closeButton.removeEventListener('click', fecharModal);
        closeButton.addEventListener('click', fecharModal);
    }

    if (cancelButton) {
        cancelButton.removeEventListener('click', fecharModal);
        cancelButton.addEventListener('click', fecharModal);
    }
}

function initializeFilters() {
    const dropdownButton = document.getElementById('status-dropdown-button');
    const dropdownMenu = document.getElementById('status-dropdown-menu');
    const selectedText = document.getElementById('status-selected-text');
    const checkboxes = document.querySelectorAll('.status-checkbox');

    function updateSelectedText() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked);
        if (checked.length === 0) {
            selectedText.textContent = 'Todos';
            checkboxes[0].checked = true;
        } else if (checked[0].value === 'todos') {
            selectedText.textContent = 'Todos';
        } else {
            selectedText.textContent = checked.length === 1
                ? checked[0].nextElementSibling.textContent
                : `${checked.length} selecionados`;
        }
    }

    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownButton.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'todos' && checkbox.checked) {
                checkboxes.forEach(cb => {
                    if (cb.value !== 'todos') {
                        cb.checked = false;
                    }
                });
            } else if (checkbox.value === 'todos' && !checkbox.checked) {
                const anyOtherChecked = Array.from(checkboxes).some(cb =>
                    cb.value !== 'todos' && cb.checked
                );
                if (!anyOtherChecked) {
                    checkbox.checked = true;
                }
            } else if (checkbox.checked) {
                const todosCheckbox = Array.from(checkboxes).find(cb => cb.value === 'todos');
                if (todosCheckbox) {
                    todosCheckbox.checked = false;
                }
            } else {
                const anyChecked = Array.from(checkboxes).some(cb =>
                    cb.value !== 'todos' && cb.checked
                );
                if (!anyChecked) {
                    const todosCheckbox = Array.from(checkboxes).find(cb => cb.value === 'todos');
                    if (todosCheckbox) {
                        todosCheckbox.checked = true;
                    }
                }
            }

            updateSelectedText();
            filtrarPANs();
        });
    });

    const searchInput = document.getElementById('pan-search-input');
    if (searchInput) {
        searchInput.removeEventListener('input', filtrarPANs);
        searchInput.addEventListener('input', filtrarPANs);
    }
}

function populateItemsPerPageSelect(totalPans) {
    const select = document.getElementById('items-per-page');
    if (!select) return;
    select.innerHTML = '';

    const step = 3;
    for (let i = step; i <= totalPans; i += step) {
        select.appendChild(new Option(i, i));
    }
    if (totalPans % step !== 0) {
        select.appendChild(new Option(totalPans, totalPans));
    }
}

function initPanCardsModule () {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const addButton = document.getElementById('add-pan-button');
    const storedData = JSON.parse(localStorage.getItem('pansData'));
    const pagination = document.getElementById('pagination-controls');
    const itemsPerPageSelect = document.getElementById('items-per-page');

    if (addButton) {
        if (currentUser?.papel !== 'admin') {
            addButton.style.display = 'none';
        }
    }

    if (itemsPerPageSelect) {
        itemsPerPageSelect.value = cardsPerPage;
        itemsPerPageSelect.addEventListener('change', (e) => {
            cardsPerPage = parseInt(e.target.value);
            currentPage = 1;
            renderPanCards(currentDisplayedPans);
        });
    }

    if (storedData && storedData.pans) {
        allPans = storedData.pans;
        currentDisplayedPans = allPans;
        populateItemsPerPageSelect(allPans.length);
        renderPanCards(currentDisplayedPans);
        updateMonitoringCharts(currentDisplayedPans);
    }

    fetch('json/pans.json')
        .then(response => response.json())
        .then(data => {
            if (!storedData) {
                allPans = data.pans;
                currentDisplayedPans = allPans;
                localStorage.setItem('pansData', JSON.stringify(data));
                populateItemsPerPageSelect(allPans.length);
                renderPanCards(currentDisplayedPans);
                updateMonitoringCharts(currentDisplayedPans);
            }
            initializeModalControls();
            initializeFilters();
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });

    document.querySelectorAll('.status-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filtrarPANs);
    });

    const searchInput = document.getElementById('pan-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filtrarPANs);
    }

    const statusSelect = document.getElementById('status-filter');
    if (statusSelect) {
        statusSelect.addEventListener('change', filtrarPANs);
    }
    if (pagination) {
        pagination.addEventListener('click', onPaginationClick);
    }
};

window.initPanCardsModule = initPanCardsModule;

let currentPan = null;
let currentStep = 0;
const totalSteps = 3;

document.addEventListener('panDataUpdated', () => {
    const storedData = JSON.parse(localStorage.getItem('pansData'));
    populateItemsPerPageSelect(storedData.pans.length);
    renderPanCards(storedData.pans);
    loadCoordinators();
    initializeModalControls();
});

function removerPan(id) {
    if (!confirm('Tem certeza que deseja remover este PAN?')) {
        return;
    }

    try {
        const storedData = JSON.parse(localStorage.getItem("pansData")) || { pans: [] };
        const pansAtualizados = storedData.pans.filter((pan) => pan.id !== id);

        localStorage.setItem("pansData", JSON.stringify({ pans: pansAtualizados }));
        allPans = pansAtualizados;
        currentDisplayedPans = pansAtualizados;
        currentPage = 1;
        renderPanCards(currentDisplayedPans);
        updateMonitoringCharts(currentDisplayedPans);
        document.dispatchEvent(new Event("panDataUpdated"));
    } catch (error) {
        console.error('Erro ao remover PAN:', error);
        alert('Erro ao remover o PAN. Por favor, tente novamente.');
    }
}

function editarPan(id) {
    const panForm = document.getElementById("pan-form");
    if (!panForm) return;

    const stored = JSON.parse(localStorage.getItem("pansData")) || { pans: [] };
    const pan = stored.pans.find((p) => p.id === id);
    if (!pan) {
        alert("PAN não encontrado.");
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isArticulator = currentUser?.papel === 'articulador';

    if (isArticulator) {
        alert("Articuladores só podem editar o status de suas ações designadas.");
        return;
    }

    window.setEditMode(true);
    setModalTitle('EDIT');

    function setFieldValue(fieldName, value) {
        const field = panForm.elements[fieldName];
        if (field) {
            field.value = value || '';
        }
    }

    setFieldValue("editingId", id);
    setFieldValue("title", pan.title);
    setFieldValue("description", pan.description);
    setFieldValue("image", pan.image);
    setFieldValue("period", pan.period);
    setFieldValue("duration", pan.duration);
    setFieldValue("generalObjective", pan.generalObjective);

    panForm.setAttribute('data-tag1', pan.tag1);
    panForm.setAttribute('data-tag1-color', pan.tag1Color);

    setFieldValue("tag1", pan.tag1);
    setFieldValue("tag1Color", pan.tag1Color);

    const tag1Select = panForm.querySelector('select[name="tag1"]');
    const tag1ColorSelect = panForm.querySelector('select[name="tag1Color"]');

    if (tag1Select) {
        tag1Select.addEventListener('change', function (e) {
            panForm.setAttribute('data-tag1', e.target.value);
        });
    }

    if (tag1ColorSelect) {
        tag1ColorSelect.addEventListener('change', function (e) {
            panForm.setAttribute('data-tag1-color', e.target.value);
        });
    }

    if (pan.coordenador) {
        loadCoordinators(pan.coordenador);
    }

    const objectivesContainer = document.getElementById("specific-objectives-container");
    if (objectivesContainer) {
        objectivesContainer.innerHTML = "";

        if (pan.specificObjectives && pan.specificObjectives.length > 0) {
            pan.specificObjectives.forEach((objective) => {
                const objectiveTemplate = document.getElementById("objective-template");
                const clone = objectiveTemplate.content.cloneNode(true);

                const titleInput = clone.querySelector('input[name$="[title]"]');
                const descriptionTextarea = clone.querySelector('textarea[name$="[description]"]');

                if (titleInput) titleInput.value = objective.title;
                if (descriptionTextarea) descriptionTextarea.value = objective.description;

                const actionsContainer = clone.querySelector(".actions-container");
                if (actionsContainer && objective.actions) {
                    actionsContainer.innerHTML = "";

                    objective.actions.forEach((action) => {
                        const actionGroup = document.createElement("div");
                        actionGroup.className = "action-group bg-white rounded-lg p-4 border";
                        actionGroup.innerHTML = `
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Descrição da Ação*</label>
                                    <input type="text" name="specificObjectives[][actions][][description]" 
                                           required
                                           value="${action.description || ''}"
                                           class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Articulador*</label>
                                    <select name="specificObjectives[][actions][][articulador]" 
                                            required
                                            class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        <option value="">Selecione um articulador</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Status*</label>
                                    <select name="specificObjectives[][actions][][status]" 
                                            required
                                            class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        <option value="not_started" ${action.status === 'not_started' ? 'selected' : ''}>Não iniciado</option>
                                        <option value="in_progress" ${action.status === 'in_progress' ? 'selected' : ''}>Em progresso</option>
                                        <option value="completed" ${action.status === 'completed' ? 'selected' : ''}>Completo</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Custo Previsto</label>
                                    <input type="text" name="specificObjectives[][actions][][custo_previsto]" 
                                           value="${window.formatCurrency(action.custo_previsto || '')}"
                                           class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Valor Gasto</label>
                                    <input type="text" name="specificObjectives[][actions][][valor_gasto]" 
                                           value="${window.formatCurrency(action.valor_gasto || '')}"
                                           class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                </div>
                            </div>

                            <div class="border-t pt-4">
                                <div class="flex items-center justify-between mb-4">
                                    <h6 class="text-sm font-medium text-gray-700">Endereço</h6>
                                    <button type="button" class="toggle-address text-blue-500 hover:text-blue-700">
                                        <span class="material-icons">expand_more</span>
                                    </button>
                                </div>
                                <div class="address-fields hidden">
                                    <div class="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">CEP*</label>
                                            <div class="mt-1 flex rounded-md shadow-sm">
                                                <input type="text" name="specificObjectives[][actions][][endereco][cep]" 
                                                       required
                                                       maxlength="9"
                                                       value="${action.endereco?.cep || ''}"
                                                       class="flex-1 border border-gray-300 rounded-l-md p-2 bg-white focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                                                       placeholder="00000-000">
                                                <button type="button" 
                                                        class="buscar-cep inline-flex items-center px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm">
                                                    <span class="material-icons text-lg mr-1">search</span>
                                                    Buscar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Rua*</label>
                                            <input type="text" name="specificObjectives[][actions][][endereco][rua]" 
                                                   required
                                                   value="${action.endereco?.rua || ''}"
                                                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Número</label>
                                            <input type="text" name="specificObjectives[][actions][][endereco][numero]" 
                                                   value="${action.endereco?.numero || ''}"
                                                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Bairro*</label>
                                            <input type="text" name="specificObjectives[][actions][][endereco][bairro]" 
                                                   required
                                                   value="${action.endereco?.bairro || ''}"
                                                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Cidade*</label>
                                            <input type="text" name="specificObjectives[][actions][][endereco][cidade]" 
                                                   required
                                                   value="${action.endereco?.cidade || ''}"
                                                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700">Estado*</label>
                                            <input type="text" name="specificObjectives[][actions][][endereco][estado]" 
                                                   required
                                                   value="${action.endereco?.estado || ''}"
                                                   class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end mt-4">
                                <button type="button" class="remove-action text-red-500 hover:text-red-700">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        `;

                        const articulatorSelect = actionGroup.querySelector('select[name$="[articulador]"]');
                        loadArticulators(articulatorSelect);
                        if (articulatorSelect && action.articulador) {
                            articulatorSelect.value = action.articulador;
                        }

                        const custoPrevisto = actionGroup.querySelector('input[name$="[custo_previsto]"]');
                        const valorGasto = actionGroup.querySelector('input[name$="[valor_gasto]"]');

                        custoPrevisto.addEventListener('input', function (e) {
                            e.target.value = window.formatCurrency(e.target.value);
                        });
                        valorGasto.addEventListener('input', function (e) {
                            e.target.value = window.formatCurrency(e.target.value);
                        });

                        const removeBtn = actionGroup.querySelector(".remove-action");
                        removeBtn.addEventListener("click", function () {
                            this.closest(".action-group").remove();
                        });

                        initializeAddressToggle(actionGroup);

                        const cepInput = actionGroup.querySelector('input[name$="[cep]"]');
                        cepInput.addEventListener('input', window.formatCEP);

                        actionsContainer.appendChild(actionGroup);
                    });
                }

                const removeObjectiveBtn = clone.querySelector(".remove-objective");
                removeObjectiveBtn.addEventListener("click", function () {
                    this.closest(".objective-group").remove();
                    const objectives = objectivesContainer.querySelectorAll(".objective-group");
                    objectives.forEach((obj, index) => {
                        obj.querySelector(".objective-number").textContent = index + 1;
                    });
                });

                const addActionBtn = clone.querySelector(".add-action");
                addActionBtn.addEventListener("click", function () {
                    window.addAction(this.closest(".objective-group"));
                });

                objectivesContainer.appendChild(clone);
            });
        } else {
            window.addObjective();
        }
    }

    const modal = document.getElementById("pan-modal");
    if (modal) {
        modal.classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
    }
}

function loadCoordinators(coordenadorId) {
    const users = window.loadFromServer('users') || [];
    const coordinatorSelect = document.getElementById('pan-coordinators');
    coordinatorSelect.innerHTML = '<option value="">Selecione um coordenador</option>';
    const coordinators = users.filter(user =>
        user.papel === 'coordenador' &&
        user.status === 'ativo'
    );

    coordinators.forEach(coordinator => {
        const option = document.createElement('option');
        option.value = coordinator.id;
        option.textContent = coordinator.nome;
        coordinatorSelect.appendChild(option);
    });

    if (coordenadorId) {
        coordinatorSelect.value = coordenadorId.toString();
    }
}

function loadArticulators(selectElement) {
    const users = window.loadFromServer('users') || [];
    const articulators = users.filter(user =>
        user.papel === 'articulador' &&
        user.status === 'ativo'
    );

    selectElement.innerHTML = '<option value="">Selecione um articulador</option>';

    articulators.forEach(articulator => {
        const option = document.createElement('option');
        option.value = articulator.id;
        option.textContent = articulator.nome;
        selectElement.appendChild(option);
    });
}

function renderPanCards(pans) {
    if (!pans || !Array.isArray(pans)) return;

    const container = document.getElementById('pan-cards-container');
    if (!container) return;

    container.innerHTML = '';

    const totalPages = Math.ceil(pans.length / cardsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIdx = (currentPage - 1) * cardsPerPage;
    const paginated = pans.slice(startIdx, startIdx + cardsPerPage);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    paginated.forEach(pan => {
        const isAdmin = currentUser?.papel === 'admin';
        const isCoordinator = currentUser?.papel === 'coordenador';
        const isArticulator = currentUser?.papel === 'articulador';

        const isPanCoordinator = pan.coordenador === currentUser?.id;
        const canEdit = isAdmin || (isCoordinator && isPanCoordinator);

        const panStatus = calculatePanStatus(pan);

        pan.status = panStatus.status;
        pan.statusColor = panStatus.statusColor;
        pan.tag2 = panStatus.tag2;
        pan.tag2Color = panStatus.tag2Color;
        pan.progress = panStatus.progress;

        pan.specificObjectives.forEach(obj => {
            obj.actions.forEach(action => {
                action.canEdit = canEditAction(action);
            });
        });

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
                    ${!isArticulator && canEdit ? `
                        <button onclick="editarPan(${pan.id})" class="text-yellow-600 hover:text-yellow-800 text-sm font-medium transition-colors duration-300 flex items-center group">
                            <span class="material-icons text-base mr-1">edit</span>
                            Editar
                        </button>
                    ` : ''}
                    
                    ${isAdmin ? `
                        <button onclick="removerPan(${pan.id})" class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300 flex items-center group">
                            <span class="material-icons text-base mr-1">delete</span>
                            Remover
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        container.appendChild(panCard);
    });
    renderPaginationControls(totalPages);
}

// function toggleFilterSidenav() {
//     const sidenav = document.getElementById('filter-sidenav');
//     const isOpen = !sidenav.classList.contains('translate-x-full');

//     if (isOpen) {
//         sidenav.classList.add('translate-x-full');
//     } else {
//         sidenav.classList.remove('translate-x-full');
//     }
// }

// function limparFiltros() {
//     const checkboxes = document.querySelectorAll('.status-checkbox');
//     checkboxes.forEach(cb => {
//         cb.checked = cb.value === 'todos';
//     });
//     document.getElementById('status-selected-text').textContent = 'Todos';
//     document.getElementById('pan-search-input').value = '';
//     filtrarPANs();
// }

function filtrarPANs() {
    const searchInput = document.getElementById('pan-search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const checkboxes = document.querySelectorAll('.status-checkbox:checked');
    const statusSelecionados = Array.from(checkboxes).map(cb => cb.value);

    const filteredPans = allPans.filter(pan => {
        const containsSearchTerm = (text) => {
            return text && text.toLowerCase().includes(searchTerm);
        };

        const matchesSearch = !searchTerm || [
            pan.title,
            pan.description,
            pan.tag1,
            pan.generalObjective
        ].some(containsSearchTerm) || (
                pan.specificObjectives && pan.specificObjectives.some(obj =>
                    containsSearchTerm(obj.title) ||
                    containsSearchTerm(obj.description) ||
                    (obj.actions && obj.actions.some(action =>
                        containsSearchTerm(action.description)
                    ))
                )
            );

        const panStatus = calculatePanStatus(pan).status;
        const matchesStatus = statusSelecionados.includes('todos') || statusSelecionados.includes(panStatus);

        return matchesSearch && matchesStatus;
    });

    currentDisplayedPans = filteredPans;
    currentPage = 1;
    renderPanCards(currentDisplayedPans);
    updateMonitoringCharts(currentDisplayedPans);
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
    document.body.classList.add("overflow-hidden");
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isArticulator = currentUser?.papel === 'articulador';

    currentPan.specificObjectives.forEach((obj, objIndex) => {
        if (obj.actions) {
            obj.actions.forEach((action, actionIndex) => {
                action.index = actionIndex;
                obj.index = objIndex;
                
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
                                ${obj.actions.map(action => {
                                    const isActionArticulator = isArticulator && action.articulador === currentUser.id;
                                    const formattedCustoPrevisto = action.custo_previsto ? window.formatCurrency(action.custo_previsto) : 'Não definido';
                                    const formattedValorGasto = action.valor_gasto ? window.formatCurrency(action.valor_gasto) : 'Não definido';

                                    return `
                                        <div class="flex flex-col space-y-2 border-b border-gray-200 pb-2 mb-2">
                                            <div class="flex items-center justify-between">
                                                <div class="flex items-center">
                                                    <p class="text-sm ${window.getStatusClass(action.status)} flex items-center">
                                                        ${window.getStatusIcon(action.status)}
                                                        ${action.description}
                                                    </p>
                                                    ${isActionArticulator ? `
                                                        <span class="ml-2 text-xs text-green-600 font-medium">(Você é o articulador)</span>
                                                        <button onclick="abrirEditarAcao(${currentPan.id}, ${obj.index}, ${action.index})"
                                                                class="ml-2 text-blue-600 hover:text-blue-800">
                                                            <span class="material-icons text-sm">edit</span>
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-4 text-sm text-gray-600">
                                                <span>Custo Previsto: ${formattedCustoPrevisto}</span>
                                                <span>Valor Gasto: ${formattedValorGasto}</span>
                                                <button type="button" 
                                                        class="text-blue-500 hover:text-blue-700 flex items-center"
                                                        onclick="abrirModalEndereco(${action.endereco ? JSON.stringify(action.endereco).replace(/"/g, '&quot;') : '{}'})">
                                                    <span class="material-icons text-sm mr-1">location_on</span>
                                                    Ver Endereço
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
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

    if (etapa === 0) {
        etapaAnterior.classList.add('hidden');
        proximaEtapa.classList.add('ml-auto');
    } else {
        etapaAnterior.classList.remove('hidden');
        proximaEtapa.classList.remove('ml-auto');
    }

    if (etapa === totalSteps - 1) {
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
    document.body.classList.remove("overflow-hidden");
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

    const costs = pans.reduce((totals, pan) => {
        pan.specificObjectives.forEach(obj => {
            obj.actions.forEach(action => {
                if (action.custo_previsto) {
                    const custoPrevistoStr = action.custo_previsto.toString().replace('R$', '').trim();
                    const custoPrevistoNum = parseFloat(custoPrevistoStr.replace(/\./g, '').replace(',', '.'));
                    if (!isNaN(custoPrevistoNum)) {
                        totals.previsto += custoPrevistoNum;
                    }
                }
                if (action.valor_gasto) {
                    const valorGastoStr = action.valor_gasto.toString().replace('R$', '').trim();
                    const valorGastoNum = parseFloat(valorGastoStr.replace(/\./g, '').replace(',', '.'));
                    if (!isNaN(valorGastoNum)) {
                        totals.gasto += valorGastoNum;
                    }
                }
            });
        });
        return totals;
    }, { previsto: 0, gasto: 0 });

    const overallProgress = Math.round((actionCounts.completed / totalActions) * 100) || 0;

    const progressRing = document.querySelector('.progress-ring');
    const progressColor = window.getProgressColor(overallProgress);
    progressRing.setAttribute('data-progress', overallProgress);
    progressRing.style.background = `conic-gradient(${progressColor} ${overallProgress}%, #f3f4f6 0%)`;
    progressRing.querySelector('span').textContent = `${overallProgress}%`;
    progressRing.querySelector('span').style.color = progressColor;

    const bars = document.querySelectorAll('.bar-chart .bar');

    bars[0].style.height = `${(actionCounts.notStarted / totalActions) * 100}%`;
    bars[0].querySelector('.bar-value').textContent = actionCounts.notStarted;

    bars[1].style.height = `${(actionCounts.inProgress / totalActions) * 100}%`;
    bars[1].querySelector('.bar-value').textContent = actionCounts.inProgress;

    bars[2].style.height = `${(actionCounts.completed / totalActions) * 100}%`;
    bars[2].querySelector('.bar-value').textContent = actionCounts.completed;

    const barPrevisto = document.querySelector('.cost-value-previsto').parentElement;
    const barGasto = document.querySelector('.cost-value-gasto').parentElement;

    let formattedPrevisto = 'R$ 0';
    let formattedGasto = 'R$ 0';

    if (costs.previsto > 0) {
        barPrevisto.style.height = '100%';
        const percentageSpent = Math.min(100, (costs.gasto / costs.previsto) * 100);
        barGasto.style.height = `${percentageSpent}%`;
        formattedPrevisto = window.formatCurrency(costs.previsto);
        formattedGasto = window.formatCurrency(costs.gasto);

        barPrevisto.querySelector('.bar-value').textContent = formattedPrevisto;
        barGasto.querySelector('.bar-value').textContent = `${formattedGasto} (${Math.round(percentageSpent)}%)`;
    } else {
        barPrevisto.style.height = '0%';
        barGasto.style.height = '0%';
        barPrevisto.querySelector('.bar-value').textContent = formattedPrevisto;
        barGasto.querySelector('.bar-value').textContent = `${formattedGasto} (0%)`;
    }

    barPrevisto.title = `Custo Previsto: ${formattedPrevisto}`;
    barGasto.title = `Valor Gasto: ${formattedGasto}`;

    const totalPansElement = document.querySelector('.text-5xl.font-bold');
    if (totalPansElement) {
        totalPansElement.textContent = pans.length;
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

function canEditAction(action) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return false;

    if (currentUser.papel === 'admin' || currentUser.papel === 'coordenador') {
        return true;
    }

    return currentUser.papel === 'articulador' && action.articulador === currentUser.id;
}

function fecharModalEndereco() {
    document.getElementById('modal-endereco').classList.add('hidden');
    const mapDiv = document.getElementById('map');
    mapDiv.innerHTML = '';
}

function abrirModalEndereco(endereco) {
    if (!endereco || typeof endereco !== 'object') {
        endereco = {};
    }

    const modalEndereco = document.getElementById('modal-endereco');

    document.getElementById('modal-rua').textContent = endereco.rua || 'Não informado';
    document.getElementById('modal-numero').textContent = endereco.numero || 'Não informado';
    document.getElementById('modal-bairro').textContent = endereco.bairro || 'Não informado';
    document.getElementById('modal-cep').textContent = endereco.cep || 'Não informado';
    document.getElementById('modal-cidade').textContent = endereco.cidade || 'Não informado';
    document.getElementById('modal-estado').textContent = endereco.estado || 'Não informado';

    modalEndereco.classList.remove('hidden');

    document.getElementById('map').innerHTML = '<div class="loading-spinner"></div>';

    if (endereco.cidade && endereco.estado) {
        const enderecoCompleto = `${endereco.rua || ''} ${endereco.numero || ''}, ${endereco.cidade}, ${endereco.estado}, Brasil`.trim();
        const encodedEndereco = encodeURIComponent(enderecoCompleto);

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedEndereco}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    window.carregarMapa(lat, lon);
                } else {
                    const cidadeEstado = `${endereco.cidade}, ${endereco.estado}, Brasil`;
                    const encodedCidadeEstado = encodeURIComponent(cidadeEstado);

                    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedCidadeEstado}`);
                }
            })
            .then(response => response ? response.json() : null)
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    window.carregarMapa(lat, lon);
                } else {
                    document.getElementById('map').innerHTML = `
                        <div class="flex items-center justify-center h-full text-gray-500 flex-col">
                            <span class="material-icons text-4xl mb-2">location_off</span>
                            <span>Localização não encontrada</span>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar coordenadas:', error);
                document.getElementById('map').innerHTML = `
                    <div class="flex items-center justify-center h-full text-gray-500 flex-col">
                        <span class="material-icons text-4xl mb-2">error_outline</span>
                        <span>Erro ao carregar o mapa</span>
                    </div>
                `;
            });
    } else {
        document.getElementById('map').innerHTML = `
            <div class="flex items-center justify-center h-full text-gray-500 flex-col">
                <span class="material-icons text-4xl mb-2">location_off</span>
                <span>Endereço incompleto para exibição no mapa</span>
            </div>
        `;
    }
}

window.closeModal = function () {
    const panForm = document.getElementById("pan-form");
    const modal = document.getElementById("pan-modal");

    if (panForm) {
        panForm.reset();
        const editingIdInput = panForm.elements["editingId"];
        if (editingIdInput) {
            editingIdInput.value = "";
        }
    }

    const objectivesContainer = document.getElementById("specific-objectives-container");
    if (objectivesContainer) {
        objectivesContainer.innerHTML = "";
    }

    if (modal) {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
    }
};

function initializeAddressToggle(container) {
    const toggleButton = container.querySelector('.toggle-address');
    const addressFields = container.querySelector('.address-fields');
    const icon = toggleButton.querySelector('.material-icons');

    const requiredFields = addressFields.querySelectorAll('input[required]');

    requiredFields.forEach(field => {
        field.removeAttribute('required');
        field.dataset.wasRequired = 'true';
    });

    if (toggleButton && addressFields) {
        toggleButton.addEventListener('click', function () {
            addressFields.classList.toggle('hidden');
            icon.textContent = addressFields.classList.contains('hidden') ? 'expand_more' : 'expand_less';

            requiredFields.forEach(field => {
                if (addressFields.classList.contains('hidden')) {
                    field.removeAttribute('required');
                } else if (field.dataset.wasRequired) {
                    field.setAttribute('required', 'required');
                }
            });
        });
    }

    const cepInput = container.querySelector('input[name$="[cep]"]');
    const buscarCepBtn = container.querySelector('.buscar-cep');

    if (cepInput) {
        cepInput.addEventListener('input', window.formatCEP);

        cepInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCepBtn.click();
            }
        });
    }

    if (buscarCepBtn) {
        buscarCepBtn.addEventListener('click', async function () {
            const cep = cepInput.value.replace(/\D/g, '');

            if (cep.length !== 8) {
                alert('CEP inválido. Digite um CEP com 8 dígitos.');
                return;
            }

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    alert('CEP não encontrado.');
                    return;
                }

                const ruaInput = container.querySelector('input[name$="[rua]"]');
                const bairroInput = container.querySelector('input[name$="[bairro]"]');
                const cidadeInput = container.querySelector('input[name$="[cidade]"]');
                const estadoInput = container.querySelector('input[name$="[estado]"]');

                ruaInput.value = data.logradouro || '';
                bairroInput.value = data.bairro || '';
                cidadeInput.value = data.localidade || '';
                estadoInput.value = data.uf || '';

                ruaInput.readOnly = !!data.logradouro;
                bairroInput.readOnly = !!data.bairro;

                const numeroInput = container.querySelector('input[name$="[numero]"]');
                if (numeroInput) {
                    numeroInput.focus();
                }

            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Tente novamente mais tarde.');
            }
        });
    }
};

function renderPaginationControls(totalPages) {
    const pagination = document.getElementById('pagination-controls');
    if (!pagination) return;
    pagination.innerHTML = '';

    // Botão Anterior
    const prev = document.createElement('button');
    prev.innerHTML = '<span class="material-icons">chevron_left</span>';
    prev.disabled = currentPage === 1;
    prev.className = `flex items-center justify-center px-3 py-1.5 rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors'} focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50`;
    prev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPanCards(currentDisplayedPans);
        }
    });
    pagination.appendChild(prev);

    // Números das páginas
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
        const firstPage = document.createElement('button');
        firstPage.textContent = '1';
        firstPage.className = `px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50`;
        firstPage.addEventListener('click', () => {
            currentPage = 1;
            renderPanCards(currentDisplayedPans);
        });
        pagination.appendChild(firstPage);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.className = 'px-2 text-gray-500';
            pagination.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-3 py-1.5 rounded-lg border ${i === currentPage ? 'bg-[var(--color-primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)]'} transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50`;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderPanCards(currentDisplayedPans);
        });
        pagination.appendChild(btn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.className = 'px-2 text-gray-500';
            pagination.appendChild(dots);
        }

        const lastPage = document.createElement('button');
        lastPage.textContent = totalPages;
        lastPage.className = `px-3 py-1.5 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50`;
        lastPage.addEventListener('click', () => {
            currentPage = totalPages;
            renderPanCards(currentDisplayedPans);
        });
        pagination.appendChild(lastPage);
    }

    // Botão Próximo
    const next = document.createElement('button');
    next.innerHTML = '<span class="material-icons">chevron_right</span>';
    next.disabled = currentPage === totalPages;
    next.className = `flex items-center justify-center px-3 py-1.5 rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[var(--color-primary)] transition-colors'} focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50`;
    next.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPanCards(currentDisplayedPans);
        }
    });
    pagination.appendChild(next);
}

function onPaginationClick(e) {
    const pagination = document.getElementById('pagination-controls');
    const btn = e.target.closest('button');
    if (!btn || !pagination.contains(btn) || btn.disabled) return;

    const totalPages = Math.ceil(currentDisplayedPans.length / cardsPerPage);
    const txt = btn.textContent.trim();

    if (txt === 'Anterior' && currentPage > 1) {
        currentPage--;
    } else if (txt === 'Próximo' && currentPage < totalPages) {
        currentPage++;
    } else {
        const num = parseInt(txt, 10);
        if (!isNaN(num)) currentPage = num;
    }

    renderPanCards(currentDisplayedPans);
}

function abrirEditarAcao(panId, objIndex, actionIndex) {
    const pan = JSON.parse(localStorage.getItem('pansData')).pans.find(p => p.id === panId);
    if (!pan) return;

    const action = pan.specificObjectives[objIndex].actions[actionIndex];
    if (!action) return;

    const modalHtml = `
        <div id="modal-editar-acao" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div class="bg-white rounded-lg w-full max-w-4xl my-8">
                <div class="flex justify-between items-center p-6 border-b">
                    <h3 class="text-xl font-semibold text-[var(--color-dark-green)]">Editar Ação</h3>
                    <button type="button" onclick="document.getElementById('modal-editar-acao').remove()" class="text-gray-500 hover:text-gray-700">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                <form id="form-editar-acao" onsubmit="salvarEdicaoAcao(event, ${panId}, ${objIndex}, ${actionIndex})" class="p-6">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Descrição da Ação*</label>
                            <input type="text" name="description" required
                                   value="${action.description}"
                                   class="block w-full border border-gray-300 rounded-md p-2">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select name="status" required class="block w-full border border-gray-300 rounded-md p-2">
                                <option value="not_started" ${action.status === 'not_started' ? 'selected' : ''}>Não iniciado</option>
                                <option value="in_progress" ${action.status === 'in_progress' ? 'selected' : ''}>Em progresso</option>
                                <option value="completed" ${action.status === 'completed' ? 'selected' : ''}>Completo</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Custo Previsto</label>
                                <input type="text" name="custo_previsto"
                                       value="${window.formatCurrency(action.custo_previsto || '')}"
                                       class="block w-full border border-gray-300 rounded-md p-2">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Valor Gasto</label>
                                <input type="text" name="valor_gasto"
                                       value="${window.formatCurrency(action.valor_gasto || '')}"
                                       class="block w-full border border-gray-300 rounded-md p-2">
                            </div>
                        </div>
                        
                        <div class="border-t pt-4">
                            <div class="flex items-center justify-between mb-4">
                                <h4 class="text-lg font-medium text-gray-700">Endereço</h4>
                                <button type="button" class="toggle-address text-blue-500 hover:text-blue-700">
                                    <span class="material-icons">expand_more</span>
                                </button>
                            </div>
                            <div class="address-fields hidden">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">CEP*</label>
                                        <div class="flex rounded-md shadow-sm">
                                            <input type="text" name="specificObjectives[][actions][][endereco][cep]" 
                                                   required maxlength="9"
                                                   value="${action.endereco?.cep || ''}"
                                                   class="flex-1 border border-gray-300 rounded-l-md p-2">
                                            <button type="button" class="buscar-cep inline-flex items-center px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-md hover:from-blue-600 hover:to-blue-700">
                                                <span class="material-icons text-lg mr-1">search</span>
                                                Buscar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Rua*</label>
                                        <input type="text" name="specificObjectives[][actions][][endereco][rua]" 
                                               required
                                               value="${action.endereco?.rua || ''}"
                                               class="block w-full border border-gray-300 rounded-md p-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                        <input type="text" name="specificObjectives[][actions][][endereco][numero]" 
                                               value="${action.endereco?.numero || ''}"
                                               class="block w-full border border-gray-300 rounded-md p-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Bairro*</label>
                                        <input type="text" name="specificObjectives[][actions][][endereco][bairro]" 
                                               required
                                               value="${action.endereco?.bairro || ''}"
                                               class="block w-full border border-gray-300 rounded-md p-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Cidade*</label>
                                        <input type="text" name="specificObjectives[][actions][][endereco][cidade]" 
                                               required
                                               value="${action.endereco?.cidade || ''}"
                                               class="block w-full border border-gray-300 rounded-md p-2">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Estado*</label>
                                        <input type="text" name="specificObjectives[][actions][][endereco][estado]" 
                                               required
                                               value="${action.endereco?.estado || ''}"
                                               class="block w-full border border-gray-300 rounded-md p-2">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" 
                                onclick="document.getElementById('modal-editar-acao').remove()"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit"
                                class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-dark-green)]">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const oldModal = document.getElementById('modal-editar-acao');
    if (oldModal) oldModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const form = document.getElementById('form-editar-acao');
    const custoPrevisto = form.querySelector('input[name="custo_previsto"]');
    const valorGasto = form.querySelector('input[name="valor_gasto"]');

    custoPrevisto.addEventListener('input', (e) => {
        e.target.value = window.formatCurrency(e.target.value);
    });
    valorGasto.addEventListener('input', (e) => {
        e.target.value = window.formatCurrency(e.target.value);
    });

    window.initializeAddressToggle(form);
}

async function salvarEdicaoAcao(event, panId, objIndex, actionIndex) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const storedData = JSON.parse(localStorage.getItem('pansData'));
        const pan = storedData.pans.find(p => p.id === panId);
        if (!pan) throw new Error('PAN não encontrado');

        const action = pan.specificObjectives[objIndex].actions[actionIndex];
        if (!action) throw new Error('Ação não encontrada');

        action.description = formData.get('description');
        action.status = formData.get('status');
        action.custo_previsto = formData.get('custo_previsto').replace(/[^\d,]/g, '').replace(',', '.');
        action.valor_gasto = formData.get('valor_gasto').replace(/[^\d,]/g, '').replace(',', '.');
        action.endereco = {
            cep: formData.get('cep'),
            rua: formData.get('rua'),
            numero: formData.get('numero'),
            bairro: formData.get('bairro'),
            cidade: formData.get('cidade'),
            estado: formData.get('estado')
        };

        localStorage.setItem('pansData', JSON.stringify(storedData));
        
        const modalEditarAcao = document.getElementById('modal-editar-acao');
        if (modalEditarAcao) {
            modalEditarAcao.remove();
        }

        const modalDetalhes = document.getElementById('modal-detalhes');
        if (modalDetalhes) {
            modalDetalhes.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }

        allPans = storedData.pans;
        renderPanCards(storedData.pans);
        updateMonitoringCharts(storedData.pans);
        
    } catch (error) {
        console.error('Erro ao salvar ação:', error);
        alert('Erro ao salvar as alterações. Por favor, tente novamente.');
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        removerPan,
        editarPan,
        renderPanCards,
        abrirAdicionarPan,
        fecharModal,
        initializeModalControls,
        initializeFilters,
        initPanCardsModule,
        filtrarPANs,
        abrirDetalhesPAN,
        fecharDetalhesPAN,
        updateMonitoringCharts,
        calculatePanStatus,
        canEditAction,
        fecharModalEndereco,
        abrirModalEndereco,
        initializeAddressToggle,
        renderPaginationControls,
        onPaginationClick,
        abrirEditarAcao,
        salvarEdicaoAcao
    };
}
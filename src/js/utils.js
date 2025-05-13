window.formatCurrency = function (input) {
    let value = input?.target?.value || input;

    if (!value) return 'R$ 0,00';

    const isNegative = value.toString().includes('-');
    value = value.toString().replace(/[^\d]/g, '');

    value = (parseInt(value || '0') / 100).toFixed(2);

    value = value.replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formattedValue = `R$ ${isNegative ? '-' : ''}${value}`;

    if (input?.target) {
        input.target.value = formattedValue;
    }

    return formattedValue;
};

// Função para formatar CEP
window.formatCEP = function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5);
    }
    e.target.value = value;
};

// Função para obter ícone de status
window.getStatusIcon = function (status) {
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
};

// Função para obter classe de status
window.getStatusClass = function (status) {
    switch (status) {
        case 'completed':
            return 'text-green-600';
        case 'in_progress':
            return 'text-yellow-600';
        default:
            return 'text-gray-600';
    }
};

// Função para obter cor baseado no progresso
window.getProgressColor = function (percentage) {
    if (percentage >= 100) return '#22c55e';
    if (percentage >= 70) return '#22c55e';
    if (percentage >= 40) return '#eab308';
    if (percentage >= 20) return '#f97316';
    return '#ef4444';
};

// Função para fechar modal
window.closeModal = function () {
    const modal = document.querySelector('.modal:not(.hidden)');
    if (modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');

        // Reset do formulário se existir
        const panForm = document.getElementById("pan-form");
        if (panForm) {
            const editingId = panForm.elements["editingId"]?.value;
            if (!editingId) {
                panForm.reset();
                const editingIdInput = panForm.elements["editingId"];
                if (editingIdInput) {
                    editingIdInput.value = "";
                }

                const objectivesContainer = document.getElementById("specific-objectives-container");
                if (objectivesContainer) {
                    objectivesContainer.innerHTML = "";
                }
            }
        }
    }
};

// Função para carregar mapa
window.carregarMapa = function (lat, lon) {
    const mapDiv = document.getElementById('map');

    mapDiv.innerHTML = '<div class="loading-spinner"></div>';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0.5rem';
    iframe.style.opacity = '0';
    iframe.style.transition = 'opacity 0.3s ease';

    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lon}`;

    iframe.onload = function () {
        iframe.style.opacity = '1';
        const spinner = mapDiv.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    };

    mapDiv.appendChild(iframe);
};

// Função para inicializar toggle de endereço
window.initializeAddressToggle = function (container) {
    const toggleButton = container.querySelector('.toggle-address');
    const addressFields = container.querySelector('.address-fields');
    const icon = toggleButton.querySelector('.material-icons');

    if (toggleButton && addressFields) {
        toggleButton.addEventListener('click', function () {
            addressFields.classList.toggle('hidden');
            icon.textContent = addressFields.classList.contains('hidden') ? 'expand_more' : 'expand_less';
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

// Função para carregar coordenadores
window.loadCoordinators = function (defaultValue = null) {
    try {
        const users = window.loadFromServer('users');
        if (!users) {
            console.error('Dados de usuários não encontrados');
            return;
        }

        const coordinatorSelect = document.getElementById('pan-coordinators');
        if (!coordinatorSelect) {
            console.error('Select de coordenador não encontrado');
            return;
        }

        const coordinators = users.filter(user =>
            user.papel === 'coordenador' &&
            user.status === 'ativo'
        );

        if (coordinators.length === 0) {
            console.warn('Nenhum coordenador ativo encontrado');
        }

        const currentValue = defaultValue || coordinatorSelect.value;
        coordinatorSelect.innerHTML = '<option value="">Selecione um coordenador</option>';

        coordinators.forEach(coordinator => {
            const option = document.createElement('option');
            option.value = coordinator.id;
            option.textContent = coordinator.nome;
            if (coordinator.id.toString() === currentValue?.toString()) {
                option.selected = true;
            }
            coordinatorSelect.appendChild(option);
        });

        if (currentValue) {
            coordinatorSelect.value = currentValue.toString();
        }
    } catch (error) {
        console.error('Erro ao carregar coordenadores:', error);
    }
};

// Função para carregar articuladores
window.loadArticulators = function (selectElement) {
    try {
        const users = window.loadFromServer('users');
        if (!users) {
            console.error('Dados de usuários não encontrados');
            return;
        }

        const currentValue = selectElement.value;
        const articulators = users.filter(user =>
            user.papel === 'articulador' &&
            user.status === 'ativo'
        );

        if (articulators.length === 0) {
            console.warn('Nenhum articulador ativo encontrado');
        }

        selectElement.innerHTML = '<option value="">Selecione um articulador</option>';

        articulators.forEach(articulator => {
            const option = document.createElement('option');
            option.value = articulator.id;
            option.textContent = articulator.nome;
            if (articulator.id.toString() === currentValue) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar articuladores:', error);
    }
};

// Função para adicionar ação
window.addAction = function (objectiveGroup) {
    const actionContainer = objectiveGroup.querySelector(".actions-container");
    const newAction = document.createElement("div");
    newAction.className = "action-group bg-white rounded-lg p-4 border";

    newAction.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Descrição da Ação*</label>
                <input type="text" name="specificObjectives[][actions][][description]" 
                       required
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
                    <option value="not_started">Não iniciado</option>
                    <option value="in_progress">Em progresso</option>
                    <option value="completed">Completo</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Custo Previsto</label>
                <input type="text" name="specificObjectives[][actions][][custo_previsto]" 
                       class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Valor Gasto</label>
                <input type="text" name="specificObjectives[][actions][][valor_gasto]" 
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
                                   class="flex-1 border border-gray-300 rounded-l-md p-2 bg-white"
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
                               class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Número</label>
                        <input type="text" name="specificObjectives[][actions][][endereco][numero]" 
                               class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Bairro*</label>
                        <input type="text" name="specificObjectives[][actions][][endereco][bairro]" 
                               required
                               class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Cidade*</label>
                        <input type="text" name="specificObjectives[][actions][][endereco][cidade]" 
                               required
                               class="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Estado*</label>
                        <input type="text" name="specificObjectives[][actions][][endereco][estado]" 
                               required
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

    const articulatorSelect = newAction.querySelector('select[name$="[articulador]"]');
    window.loadArticulators(articulatorSelect);

    const custoPrevisto = newAction.querySelector('input[name$="[custo_previsto]"]');
    const valorGasto = newAction.querySelector('input[name$="[valor_gasto]"]');

    custoPrevisto.addEventListener('input', function (e) {
        e.target.value = window.formatCurrency(e.target.value);
    });
    valorGasto.addEventListener('input', function (e) {
        e.target.value = window.formatCurrency(e.target.value);
    });

    const removeBtn = newAction.querySelector(".remove-action");
    removeBtn.addEventListener("click", function () {
        this.closest(".action-group").remove();
    });

    window.initializeAddressToggle(newAction);

    const cepInput = newAction.querySelector('input[name$="[cep]"]');
    cepInput.addEventListener('input', window.formatCEP);

    actionContainer.appendChild(newAction);
}; 
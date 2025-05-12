document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("pan-modal");
  const panForm = document.getElementById("pan-form");
  const objectivesContainer = document.getElementById("specific-objectives-container");
  const objectiveTemplate = document.getElementById("objective-template");

  let isEditMode = false;

  loadCoordinators();

  function removeOldEventListeners() {
    const elements = [
      "close-modal",
      "cancel-form",
      "add-objective"
    ].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
      }
    });
  }

  function initializeEventListeners() {
    removeOldEventListeners();

    const closeButton = document.getElementById("close-modal");
    const cancelButton = document.getElementById("cancel-form");
    const addObjectiveButton = document.getElementById("add-objective");
    const addPanButton = document.getElementById("add-pan-button");

    if (closeButton) closeButton.addEventListener("click", () => {
      isEditMode = false;
      window.closeModal();
    });
    if (cancelButton) cancelButton.addEventListener("click", () => {
      isEditMode = false;
      window.closeModal();
    });
    if (addObjectiveButton) addObjectiveButton.addEventListener("click", addObjective);
    if (addPanButton) {
      addPanButton.addEventListener("click", function() {
        isEditMode = false;
        if (panForm) {
          panForm.reset();
          panForm.elements["editingId"].value = "";
          panForm.removeAttribute('data-tag1-color');
          
          if (objectivesContainer) {
            objectivesContainer.innerHTML = "";
            addObjective();
          }
        }

        loadCoordinators();
        modal.classList.remove('hidden');
        document.body.classList.add("overflow-hidden");
      });
    }
  }

  if (panForm) {
    if (panForm._submitHandler) {
      panForm.removeEventListener("submit", panForm._submitHandler);
    }

    const submitHandler = async function (e) {
      e.preventDefault();

      try {
        const editingId = panForm.elements['editingId']?.value;

        // Validação dos campos obrigatórios básicos
        const requiredFields = [
          { name: 'title', label: 'Título' },
          { name: 'description', label: 'Descrição' },
          { name: 'period', label: 'Período' },
          { name: 'duration', label: 'Duração' },
          { name: 'generalObjective', label: 'Objetivo Geral' }
        ];

        for (const field of requiredFields) {
          const element = panForm.elements[field.name];
          if (!element) {
            throw new Error(`Campo ${field.label} não encontrado no formulário`);
          }
          const value = element.value;
          if (!value || !value.toString().trim()) {
            throw new Error(`O campo ${field.label} é obrigatório`);
          }
        }

        const coordenadorSelect = document.getElementById('pan-coordinators');
        if (!coordenadorSelect?.value) {
          throw new Error('Selecione um coordenador');
        }

        const storedData = JSON.parse(localStorage.getItem("pansData")) || { pans: [] };
        const highestId = storedData.pans.reduce((maxId, pan) => 
          Math.max(maxId, pan.id), 0);
        
        let existingPan = null;
        if (isEditMode && editingId) {
          existingPan = storedData.pans.find(p => p.id === parseInt(editingId));
        }
        
        const panData = {
          id: editingId ? parseInt(editingId) : highestId + 1,
          title: panForm.elements["title"].value.trim(),
          description: panForm.elements["description"].value.trim(),
          image: panForm.elements["image"].value || "img/default.webp",
          period: panForm.elements["period"].value.trim(),
          duration: panForm.elements["duration"].value.trim(),
          generalObjective: panForm.elements["generalObjective"].value.trim(),
          coordenador: coordenadorSelect.value,
          specificObjectives: [],
          tag1: panForm.getAttribute('data-tag1') || (existingPan?.tag1 || 'Não Iniciado'),
          tag1Color: panForm.getAttribute('data-tag1-color') || (existingPan?.tag1Color || 'gray')
        };

        // Validação dos objetivos específicos
        const objectiveGroups = objectivesContainer.querySelectorAll(".objective-group");
        if (objectiveGroups.length === 0) {
          throw new Error('Adicione pelo menos um objetivo específico');
        }

        for (let i = 0; i < objectiveGroups.length; i++) {
          const group = objectiveGroups[i];
          const title = group.querySelector('input[name$="[title]"]')?.value?.trim();
          const description = group.querySelector('textarea[name$="[description]"]')?.value?.trim();

          if (!title || !description) {
            throw new Error(`Preencha todos os campos do objetivo ${i + 1}`);
          }

          const actions = [];
          const actionGroups = group.querySelectorAll(".action-group");
          
          if (actionGroups.length === 0) {
            throw new Error(`Adicione pelo menos uma ação ao objetivo ${i + 1}`);
          }

          for (let j = 0; j < actionGroups.length; j++) {
            const actionGroup = actionGroups[j];
            const articuladorSelect = actionGroup.querySelector('select[name$="[articulador]"]');
            const actionDescription = actionGroup.querySelector('input[name$="[description]"]')?.value?.trim();

            if (!articuladorSelect?.value) {
              throw new Error(`Selecione um articulador para a ação ${j + 1} do objetivo ${i + 1}`);
            }

            if (!actionDescription) {
              throw new Error(`Preencha a descrição da ação ${j + 1} do objetivo ${i + 1}`);
            }

            const endereco = {
              cep: actionGroup.querySelector('input[name$="[cep]"]')?.value?.trim(),
              rua: actionGroup.querySelector('input[name$="[rua]"]')?.value?.trim(),
              numero: actionGroup.querySelector('input[name$="[numero]"]')?.value?.trim(),
              bairro: actionGroup.querySelector('input[name$="[bairro]"]')?.value?.trim(),
              cidade: actionGroup.querySelector('input[name$="[cidade]"]')?.value?.trim(),
              estado: actionGroup.querySelector('input[name$="[estado]"]')?.value?.trim()
            };

            const requiredAddressFields = [
              { field: 'cep', label: 'CEP' },
              { field: 'rua', label: 'Rua' },
              { field: 'bairro', label: 'Bairro' },
              { field: 'cidade', label: 'Cidade' },
              { field: 'estado', label: 'Estado' }
            ];

            for (const field of requiredAddressFields) {
              if (!endereco[field.field]) {
                throw new Error(`Preencha o campo ${field.label} do endereço da ação ${j + 1} do objetivo ${i + 1}`);
              }
            }

            const custoPrevisto = actionGroup.querySelector('input[name$="[custo_previsto]"]')?.value;
            const valorGasto = actionGroup.querySelector('input[name$="[valor_gasto]"]')?.value;

            actions.push({
              description: actionDescription,
              status: actionGroup.querySelector('select[name$="[status]"]')?.value || 'not_started',
              articulador: articuladorSelect.value,
              custo_previsto: custoPrevisto ? custoPrevisto.replace(/[^\d,]/g, '').replace(',', '.') : '',
              valor_gasto: valorGasto ? valorGasto.replace(/[^\d,]/g, '').replace(',', '.') : '',
              endereco
            });
          }

          panData.specificObjectives.push({
            title,
            description,
            actions,
          });
        }

        if (isEditMode) {
          const index = storedData.pans.findIndex(p => p.id == editingId);
          if (index !== -1) {
            const oldPan = storedData.pans[index];
            panData.tag1 = panForm.getAttribute('data-tag1') || oldPan.tag1 || "Não Iniciado";
            panData.tag1Color = panForm.getAttribute('data-tag1-color') || oldPan.tag1Color || "gray";
            storedData.pans[index] = panData;
          }
        } else {
          panData.tag1 = "Não Iniciado";
          panData.tag1Color = "gray";
          storedData.pans.push(panData);
        }

        localStorage.setItem("pansData", JSON.stringify(storedData));
        document.dispatchEvent(new Event("panDataUpdated"));
        isEditMode = false;
        window.closeModal();

      } catch (error) {
        console.error('Erro ao salvar PAN:', error);
        alert(error.message || 'Erro ao salvar o PAN. Por favor, verifique todos os campos obrigatórios.');
        return false;
      }
    };

    panForm._submitHandler = submitHandler;
    panForm.addEventListener("submit", submitHandler);
  }

  window.setEditMode = function(value) {
    isEditMode = value;
  };

  initializeEventListeners();

  document.addEventListener('panDataUpdated', function() {
    const articulatorSelects = document.querySelectorAll('select[name$="[articulador]"]');
    articulatorSelects.forEach(select => {
      loadArticulators(select);
    });
  });

  function addObjective() {
    const clone = objectiveTemplate.content.cloneNode(true);
    const objectiveGroups = objectivesContainer.querySelectorAll(".objective-group");
    const newNumber = objectiveGroups.length + 1;

    clone.querySelector(".objective-number").textContent = newNumber;

    const removeBtn = clone.querySelector(".remove-objective");
    removeBtn.addEventListener("click", function () {
      this.closest(".objective-group").remove();
      // Atualizar números dos objetivos
      const objectives = objectivesContainer.querySelectorAll(".objective-group");
      objectives.forEach((obj, index) => {
        obj.querySelector(".objective-number").textContent = index + 1;
      });
    });

    const addActionBtn = clone.querySelector(".add-action");
    addActionBtn.addEventListener("click", function () {
      addAction(this.closest(".objective-group"));
    });

    // Carregar articuladores para a ação padrão
    const firstAction = clone.querySelector(".action-group");
    const articulatorSelect = firstAction.querySelector('select[name$="[articulador]"]');
    loadArticulators(articulatorSelect);

    // Inicializar toggle de endereço para a primeira ação
    initializeAddressToggle(firstAction);

    // Adicionar formatação de moeda para os campos de custo
    const custoPrevisto = firstAction.querySelector('input[name$="[custo_previsto]"]');
    const valorGasto = firstAction.querySelector('input[name$="[valor_gasto]"]');

    custoPrevisto.addEventListener('input', function(e) {
      e.target.value = formatCurrency(e.target.value);
    });
    valorGasto.addEventListener('input', function(e) {
      e.target.value = formatCurrency(e.target.value);
    });

    // Configurar o botão de remover ação
    const removeActionBtn = firstAction.querySelector(".remove-action");
    removeActionBtn.addEventListener("click", function () {
      this.closest(".action-group").remove();
    });

    objectivesContainer.appendChild(clone);
  }

  function addAction(objectiveGroup) {
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
    loadArticulators(articulatorSelect);

    const custoPrevisto = newAction.querySelector('input[name$="[custo_previsto]"]');
    const valorGasto = newAction.querySelector('input[name$="[valor_gasto]"]');

    custoPrevisto.addEventListener('input', function(e) {
      e.target.value = formatCurrency(e.target.value);
    });
    valorGasto.addEventListener('input', function(e) {
      e.target.value = formatCurrency(e.target.value);
    });

    const removeBtn = newAction.querySelector(".remove-action");
    removeBtn.addEventListener("click", function () {
      this.closest(".action-group").remove();
    });

    // Inicializar toggle de endereço para a nova ação
    initializeAddressToggle(newAction);

    const cepInput = newAction.querySelector('input[name$="[cep]"]');
    cepInput.addEventListener('input', formatCEP);

    actionContainer.appendChild(newAction);
  }

  function initializeAddressToggle(container) {
    const toggleButton = container.querySelector('.toggle-address');
    const addressFields = container.querySelector('.address-fields');
    const icon = toggleButton.querySelector('.material-icons');
    
    if (toggleButton && addressFields) {
        toggleButton.addEventListener('click', function() {
            addressFields.classList.toggle('hidden');
            icon.textContent = addressFields.classList.contains('hidden') ? 'expand_more' : 'expand_less';
        });
    }

    // Inicializar formatação de CEP e busca
    const cepInput = container.querySelector('input[name$="[cep]"]');
    const buscarCepBtn = container.querySelector('.buscar-cep');

    if (cepInput) {
        // Formatar CEP enquanto digita
        cepInput.addEventListener('input', formatCEP);

        // Buscar CEP quando pressionar Enter
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCepBtn.click();
            }
        });
    }

    if (buscarCepBtn) {
        buscarCepBtn.addEventListener('click', async function() {
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

                // Habilita edição dos campos caso o CEP não retorne alguma informação
                ruaInput.readOnly = !!data.logradouro;
                bairroInput.readOnly = !!data.bairro;
                const numeroInput = container.querySelector('input[name$="[rua]"]');
                numeroInput.focus();

            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                alert('Erro ao buscar CEP. Tente novamente mais tarde.');
            }
        });
    }
  }

  function formatCurrency(value) {
    let formattedValue = value.replace(/\D/g, '');
    formattedValue = (parseInt(formattedValue) / 100).toFixed(2);
    formattedValue = formattedValue.replace('.', ',');
    formattedValue = formattedValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${formattedValue}`;
  }

  function formatCEP(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5);
    }
    e.target.value = value;
  }

  function loadCoordinators(defaultValue = null) {
    try {
        const users = loadFromServer('users');
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
  }

  function loadArticulators(selectElement) {
    try {
        const users = loadFromServer('users');
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
  }

  window.closeModal = function() {
    const panForm = document.getElementById("pan-form");
    const modal = document.getElementById("pan-modal");
    
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
    
    if (modal) {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }
  };
});

window.addAction = addAction;
window.loadCoordinators = loadCoordinators;
window.loadArticulators = loadArticulators;

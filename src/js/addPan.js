document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("pan-modal");
  const panForm = document.getElementById("pan-form");
  const objectivesContainer = document.getElementById("specific-objectives-container");
  const objectiveTemplate = document.getElementById("objective-template");

  let isEditMode = false;

  window.loadCoordinators();

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
      addPanButton.addEventListener("click", function () {
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

        window.loadCoordinators();
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

  window.setEditMode = function (value) {
    isEditMode = value;
  };

  initializeEventListeners();

  document.addEventListener('panDataUpdated', function () {
    const articulatorSelects = document.querySelectorAll('select[name$="[articulador]"]');
    articulatorSelects.forEach(select => {
      window.loadArticulators(select);
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
      const objectives = objectivesContainer.querySelectorAll(".objective-group");
      objectives.forEach((obj, index) => {
        obj.querySelector(".objective-number").textContent = index + 1;
      });
    });

    const addActionBtn = clone.querySelector(".add-action");
    addActionBtn.addEventListener("click", function () {
      window.addAction(this.closest(".objective-group"));
    });

    const firstAction = clone.querySelector(".action-group");
    const articulatorSelect = firstAction.querySelector('select[name$="[articulador]"]');
    window.loadArticulators(articulatorSelect);

    window.initializeAddressToggle(firstAction);

    const custoPrevisto = firstAction.querySelector('input[name$="[custo_previsto]"]');
    const valorGasto = firstAction.querySelector('input[name$="[valor_gasto]"]');

    custoPrevisto.addEventListener('input', function (e) {
      e.target.value = window.formatCurrency(e.target.value);
    });
    valorGasto.addEventListener('input', function (e) {
      e.target.value = window.formatCurrency(e.target.value);
    });

    const removeActionBtn = firstAction.querySelector(".remove-action");
    removeActionBtn.addEventListener("click", function () {
      this.closest(".action-group").remove();
    });

    objectivesContainer.appendChild(clone);
  }

  window.closeModal = function () {
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

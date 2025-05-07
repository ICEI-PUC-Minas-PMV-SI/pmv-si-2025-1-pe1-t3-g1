document.addEventListener("DOMContentLoaded", function () {
  let addButton;
  document.body.addEventListener("click", function (event) {
    addButton = event.target.closest("#add-pan-button");
    if (addButton) {
      modal.classList.remove("hidden");
    }
  });
  // const addButton = document.getElementById('add-pan-button');
  const modal = document.getElementById("pan-modal");
  const closeButton = document.getElementById("close-modal");
  const cancelButton = document.getElementById("cancel-form");
  const panForm = document.getElementById("pan-form");
  const objectivesContainer = document.getElementById(
    "specific-objectives-container"
  );
  const addObjectiveButton = document.getElementById("add-objective");
  const objectiveTemplate = document.getElementById("objective-template");
  const storedData = JSON.parse(localStorage.getItem("pansData"));

  // addButton.addEventListener("click", function() {
  //     modal.classList.remove('hidden');
  // });

  function closeModal() {
    modal.classList.add("hidden");
    panForm.elements["editingId"].value = "";
    panForm.reset();
    objectivesContainer.innerHTML = "";
  }

  closeButton.addEventListener("click", closeModal);
  cancelButton.addEventListener("click", closeModal);

  addObjectiveButton.addEventListener("click", addObjective);

  function addObjective() {
    const clone = objectiveTemplate.content.cloneNode(true);
    const objectiveGroups =
      objectivesContainer.querySelectorAll(".objective-group");
    const newNumber = objectiveGroups.length + 1;

    clone.querySelector(".objective-number").textContent = newNumber;

    const removeBtn = clone.querySelector(".remove-objective");
    removeBtn.addEventListener("click", function () {
      this.closest(".objective-group").remove();
      updateObjectiveNumbers();
    });

    const addActionBtn = clone.querySelector(".add-action");
    addActionBtn.addEventListener("click", function () {
      addAction(this.closest(".objective-group"));
    });

    const actionContainer = clone.querySelector(".actions-container");
    const firstAction = actionContainer.querySelector(".action-group");
    const removeActionBtn = firstAction.querySelector(".remove-action");
    removeActionBtn.addEventListener("click", function () {
      this.closest(".action-group").remove();
    });

    objectivesContainer.appendChild(clone);
  }

  function addAction(objectiveGroup) {
    const actionContainer = objectiveGroup.querySelector(".actions-container");
    const newAction = document.createElement("div");
    newAction.className = "action-group flex items-center space-x-2";
    
    newAction.innerHTML = `
        <input type="text" name="specificObjectives[][actions][][description]" 
               placeholder="Descrição da ação" 
               class="flex-1 border border-gray-300 rounded-md p-2">
        <select name="specificObjectives[][actions][][articulador]" 
            class="border border-gray-300 rounded-md p-2">
            <option value="">Selecione um articulador</option>
        </select>
        <select name="specificObjectives[][actions][][status]" 
                class="border border-gray-300 rounded-md p-2">
            <option value="not_started">Não iniciado</option>
            <option value="in_progress">Em progresso</option>
            <option value="completed">Completo</option>
        </select>
        <button type="button" class="remove-action text-red-500 hover:text-red-700">
            <span class="material-icons">close</span>
        </button>
    `;

    const articulatorSelect = newAction.querySelector('select[name$="[articulador]"]');
    loadArticulators(articulatorSelect);

    const removeBtn = newAction.querySelector(".remove-action");
    removeBtn.addEventListener("click", function () {
      this.closest(".action-group").remove();
    });

    actionContainer.appendChild(newAction);
  }

  function updateObjectiveNumbers() {
    const objectives = objectivesContainer.querySelectorAll(".objective-group");
    objectives.forEach((obj, index) => {
      obj.querySelector(".objective-number").textContent = index + 1;
    });
  }

  panForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(panForm);
    const editingId = formData.get('editingId');

    const highestId = storedData.pans.reduce((maxId, pan) => 
        Math.max(maxId, pan.id), 0);
    
    const panData = {
        id: editingId ? parseInt(editingId) : highestId + 1,
        title: formData.get("title"),
        description: formData.get("description"),
        image: formData.get("image") || "img/default.webp",
        tag1: formData.get("tag1"),
        tag1Color: formData.get("tag1Color"),
        period: formData.get("period"),
        duration: formData.get("duration"),
        generalObjective: formData.get("generalObjective"),
        coordenador: formData.get("coordenador"),
        specificObjectives: [],
    };

    const objectiveGroups = objectivesContainer.querySelectorAll(".objective-group");
    objectiveGroups.forEach((group) => {
        const title = group.querySelector('input[name$="[title]"]').value;
        const description = group.querySelector('textarea[name$="[description]"]').value;

        const actions = [];
        const actionGroups = group.querySelectorAll(".action-group");
        actionGroups.forEach((actionGroup) => {
            actions.push({
                description: actionGroup.querySelector('input[name$="[description]"]').value,
                status: actionGroup.querySelector('select[name$="[status]"]').value,
                articulador: actionGroup.querySelector('select[name$="[articulador]"]').value
            });
        });

        panData.specificObjectives.push({
            title,
            description,
            actions,
        });
    });

    if (editingId) {
        const index = storedData.pans.findIndex(p => p.id == editingId);
        if (index !== -1) {
            panData.id = parseInt(editingId);
            storedData.pans[index] = panData;
        }
    } else {
        storedData.pans.push(panData);
    }

    localStorage.setItem("pansData", JSON.stringify(storedData));

    document.dispatchEvent(new Event("panDataUpdated"));
    closeModal();
  });

  addObjective();
  document.getElementById('add-pan-button').addEventListener('click', function() {
    const coordinatorSelect = document.getElementById('pan-coordinators');
    loadCoordinators(coordinatorSelect);
    document.getElementById('pan-modal').classList.remove('hidden');
  });
  
  document.getElementById('add-objective')?.addEventListener('click', function() {
    const template = document.getElementById('objective-template').content.cloneNode(true);
    const articulatorSelect = template.querySelector('select[name$="[articulador]"]');
    loadArticulators(articulatorSelect);
  });
});
window.addAction = addAction;

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

window.loadArticulators = loadArticulators;

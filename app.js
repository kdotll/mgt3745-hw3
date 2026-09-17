(() => {
  'use strict';

  const storageKey = 'mgt3745.candidates.v1';

  const form = document.querySelector('#candidate-form');
  const nameInput = document.querySelector('#candidate-name');
  const degreeInput = document.querySelector('#degree-program');
  const gradInput = document.querySelector('#grad-year');
  const authInput = document.querySelector('#work-auth');
  const reloInput = document.querySelector('#relocation');
  
  const candidateList = document.querySelector('#candidate-list');
  const formError = document.querySelector('#form-error');
  const saveStatus = document.querySelector('#save-status');
  const emptyState = document.querySelector('#empty-state');

  let candidates = loadCandidates();
  renderCandidates();

  function loadCandidates() {
    try {
      const storedText = window.localStorage.getItem(storageKey);
      const parsed = storedText === null ? [] : JSON.parse(storedText);
      if (!Array.isArray(parsed)) {
        throw new Error('Unexpected stored data format');
      }
      return parsed;
    } catch (err) {
      saveStatus.textContent = 'Saved records could not be read. Storage was left unchanged.';
      return [];
    }
  }

  function saveCandidates(nextCandidates) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextCandidates));
      return true;
    } catch (err) {
      formError.textContent = 'Could not save record. Storage is full or unavailable.';
      saveStatus.textContent = '';
      return false;
    }
  }

  function renderCandidates() {
    candidateList.replaceChildren();
    emptyState.hidden = candidates.length > 0;

    candidates.forEach((candidate, index) => {
      const listItem = document.createElement('li');
      
      const textSpan = document.createElement('span');
      textSpan.textContent = `${candidate.name} (${candidate.degree}, Grad: ${candidate.gradYear}) — `;
      
      const badge = document.createElement('span');
      badge.textContent = candidate.status;
      badge.className = candidate.status === 'Eligible' ? 'badge-eligible' : 'badge-ineligible';
      textSpan.append(badge);

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Remove';
      deleteButton.setAttribute('aria-label', `Remove ${candidate.name}`);
      deleteButton.addEventListener('click', () => {
        const nextCandidates = candidates.filter((_, entryIndex) => entryIndex !== index);
        if (!saveCandidates(nextCandidates)) return;
        candidates = nextCandidates;
        formError.textContent = '';
        renderCandidates();
        saveStatus.textContent = 'Candidate record removed.';
      });

      listItem.append(textSpan, deleteButton);
      candidateList.append(listItem);
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const degree = degreeInput.value;
    const gradYear = parseInt(gradInput.value, 10);
    const workAuth = authInput.value;
    const relocation = reloInput.value;

    if (!name || !degree || isNaN(gradYear) || !workAuth || !relocation) {
      formError.textContent = 'Please fill out all required fields properly.';
      return;
    }

    formError.textContent = '';

    // Deterministic four-field knockout evaluation (Task Rule 3)
    const isEligible = 
      degree === 'Mechanical Engineering' &&
      gradYear >= 2026 &&
      gradYear <= 2028 &&
      workAuth === 'Yes' &&
      relocation === 'Yes';

    const newCandidate = {
      name: name,
      degree: degree,
      gradYear: gradYear,
      status: isEligible ? 'Eligible' : 'Ineligible'
    };

    const nextCandidates = [...candidates, newCandidate];
    if (!saveCandidates(nextCandidates)) return;

    candidates = nextCandidates;
    renderCandidates();
    form.reset();
    nameInput.focus();
    saveStatus.textContent = `Candidate evaluated and saved as ${newCandidate.status}.`;
  });
})();
function updateAgeRequirement() {
  const role = document.querySelector('input[name="role"]:checked').value;
  const ageInput = document.getElementById('age');
  const ageLabel = document.getElementById('age-label');
  const isYoung = role.includes('Jovem');

  ageInput.required = isYoung;
  ageLabel.textContent = isYoung ? 'Idade do Jovem *' : 'Idade do Jovem (opcional)';
  ageInput.placeholder = isYoung ? 'Ex: 15' : 'Opcional';
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('interest-form');
  const status = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = document.getElementById('submit-label');

  status.textContent = 'Enviando solicitação...';
  status.classList.remove('hidden');
  submitButton.disabled = true;
  submitLabel.textContent = 'Enviando...';

  try {
    const formData = new FormData(form);
    if (!formData.has('form-name')) {
      formData.set('form-name', form.getAttribute('name'));
    }

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    });

    if (!response.ok) {
      if ([404, 405, 501].includes(response.status)) {
        throw new Error('O formulário só recebe indicações depois de publicado na Netlify com a detecção de formulários ativada.');
      }
      throw new Error('A Netlify não aceitou o envio. Tente novamente ou use os canais oficiais da 2ª Região.');
    }

    form.classList.add('hidden');
    document.getElementById('confirmation-box').classList.remove('hidden');
  } catch (error) {
    status.textContent = error instanceof TypeError
      ? 'Não foi possível conectar à Netlify. Verifique a conexão e tente novamente.'
      : error instanceof Error
        ? error.message
        : 'Não foi possível enviar. Tente novamente mais tarde.';
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = 'Enviar Solicitação à 2ª Região';
  }
}

function resetForm() {
  const form = document.getElementById('interest-form');
  form.reset();
  updateAgeRequirement();
  const status = document.getElementById('form-status');
  status.textContent = '';
  status.classList.add('hidden');
  document.getElementById('confirmation-box').classList.add('hidden');
  form.classList.remove('hidden');
}

export function initializeInterestForm() {
  document.getElementById('interest-form').addEventListener('submit', handleFormSubmit);
  document.querySelectorAll('input[name="role"]').forEach(input => {
    input.addEventListener('change', updateAgeRequirement);
  });
  document.getElementById('reset-form-button').addEventListener('click', resetForm);
  updateAgeRequirement();
}

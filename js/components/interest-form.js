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
  const role = document.querySelector('input[name="role"]:checked').value;

  status.textContent = 'Enviando solicitação...';
  status.classList.remove('hidden');
  submitButton.disabled = true;
  submitLabel.textContent = 'Enviando...';

  try {
    const response = await fetch('/api/indication', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        role,
        consent: document.getElementById('consent').checked,
        website: document.getElementById('website').value,
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'Não foi possível enviar. Tente novamente mais tarde.');
    }

    form.classList.add('hidden');
    document.getElementById('confirmation-box').classList.remove('hidden');
  } catch (error) {
    status.textContent = error instanceof Error
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

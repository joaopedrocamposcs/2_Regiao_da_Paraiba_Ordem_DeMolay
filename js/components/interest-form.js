const regionalEmail = 'segundaregiaoadministrativapb@gmail.com';

function updateAgeRequirement() {
  const role = document.querySelector('input[name="role"]:checked').value;
  const ageInput = document.getElementById('age');
  const ageLabel = document.getElementById('age-label');
  const isYoung = role.includes('Jovem');

  ageInput.required = isYoung;
  ageLabel.textContent = isYoung ? 'Idade do Jovem *' : 'Idade do Jovem (opcional)';
  ageInput.placeholder = isYoung ? 'Ex: 15' : 'Opcional';
}

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value.trim();
  const city = document.getElementById('city').value;
  const email = document.getElementById('email').value.trim();
  const role = document.querySelector('input[name="role"]:checked').value;
  const form = document.getElementById('interest-form');
  const confirmationBox = document.getElementById('confirmation-box');
  const confirmationText = document.getElementById('confirmation-text');
  const emailDraftLink = document.getElementById('email-draft-link');
  const emailBody = [
    'Nova solicitação de interesse — 2ª Região da Paraíba',
    '',
    `Nome: ${name}`,
    `Perfil: ${role}`,
    ...(age ? [`Idade do jovem: ${age} anos`] : []),
    `Cidade: ${city}`,
    `Email para contato: ${email}`,
  ].join('\n');
  const emailSubject = 'Interesse na 2ª Região da Paraíba — Ordem DeMolay';

  emailDraftLink.href = `mailto:${regionalEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  confirmationText.textContent = 'Clique no botão abaixo para abrir uma mensagem preenchida no seu aplicativo de email. Revise os dados e confirme o envio.';

  form.classList.add('hidden');
  confirmationBox.classList.remove('hidden');
}

function resetForm() {
  const form = document.getElementById('interest-form');
  form.reset();
  updateAgeRequirement();
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

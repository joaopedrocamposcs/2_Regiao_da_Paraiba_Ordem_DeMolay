const allowedRoles = new Set([
  'Jovem interessado (12 a 21 anos)',
  'Pai / Mãe / Responsável (Clube de Mães)',
  'Tio Maçom / Indicação',
]);

const allowedCities = new Set([
  'Campina Grande',
  'Areia',
  'Alagoa Grande',
  'Picuí',
  'Outra cidade próxima',
]);

function isEmailAddress(value) {
  return typeof value === 'string'
    && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateIndication(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, message: 'Confira os dados do formulário e tente novamente.' };
  }

  if (typeof input.website === 'string' && input.website.trim()) {
    return { ok: false, message: 'Não foi possível validar o envio.' };
  }

  const name = typeof input.name === 'string'
    ? input.name.replace(/\s+/g, ' ').trim()
    : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const role = input.role;
  const city = input.city;
  const ageText = input.age == null ? '' : String(input.age).trim();
  const age = ageText === '' ? null : Number(ageText);

  if (name.length < 2 || name.length > 120) {
    return { ok: false, message: 'Informe um nome entre 2 e 120 caracteres.' };
  }

  if (!isEmailAddress(email)) {
    return { ok: false, message: 'Informe um email válido para contato.' };
  }

  if (!allowedRoles.has(role)) {
    return { ok: false, message: 'Selecione um perfil válido.' };
  }

  if (!allowedCities.has(city)) {
    return { ok: false, message: 'Selecione uma cidade válida.' };
  }

  if (role.startsWith('Jovem') && age === null) {
    return { ok: false, message: 'Informe a idade do jovem.' };
  }

  if (age !== null && (!Number.isInteger(age) || age < 7 || age > 99)) {
    return { ok: false, message: 'Informe uma idade válida entre 7 e 99 anos.' };
  }

  if (input.consent !== true) {
    return { ok: false, message: 'É necessário autorizar o envio dos dados para continuar.' };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      role,
      city,
      age,
    },
  };
}

export function isAllowedOrigin(origin, { siteUrl, vercelUrl, nodeEnv }) {
  if (typeof origin !== 'string' || !origin) {
    return false;
  }

  let originUrl;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  const allowedOrigins = new Set();
  if (siteUrl) {
    try {
      allowedOrigins.add(new URL(siteUrl).origin);
    } catch {
      return false;
    }
  }
  if (vercelUrl) {
    allowedOrigins.add(`https://${vercelUrl}`);
  }
  if (nodeEnv !== 'production'
    && originUrl.protocol === 'http:'
    && ['localhost', '127.0.0.1'].includes(originUrl.hostname)) {
    return true;
  }

  return allowedOrigins.has(originUrl.origin);
}

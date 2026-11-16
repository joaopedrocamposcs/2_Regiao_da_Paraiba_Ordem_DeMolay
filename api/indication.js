import nodemailer from 'nodemailer';
import { isAllowedOrigin, validateIndication } from '../lib/indication.js';

const requiredEnvironment = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
  'MAIL_TO',
];

function getMailConfiguration() {
  const missing = requiredEnvironment.filter(name => !process.env[name]);
  const port = Number(process.env.SMTP_PORT);
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (missing.length > 0
    || ![465, 587].includes(port)
    || !isEmailAddress(from)
    || !isEmailAddress(to)) {
    return null;
  }

  return {
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from,
    to,
  };
}

function isEmailAddress(value) {
  return typeof value === 'string'
    && !/[\r\n]/.test(value)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Método não permitido.' });
  }

  if (!String(request.headers['content-type'] || '').includes('application/json')) {
    return response.status(415).json({ message: 'Formato de solicitação inválido.' });
  }

  if (!isAllowedOrigin(request.headers.origin, {
    siteUrl: process.env.SITE_URL,
    vercelUrl: process.env.VERCEL_URL,
    nodeEnv: process.env.NODE_ENV,
  })) {
    return response.status(403).json({ message: 'Origem não autorizada. Atualize a página e tente novamente.' });
  }

  const body = typeof request.body === 'string'
    ? parseJson(request.body)
    : request.body;

  if (!body || Buffer.byteLength(JSON.stringify(body)) > 8192) {
    return response.status(400).json({ message: 'Confira os dados do formulário e tente novamente.' });
  }

  const validation = validateIndication(body);
  if (!validation.ok) {
    return response.status(400).json({ message: validation.message });
  }

  const mail = getMailConfiguration();
  if (!mail) {
    console.error('Email delivery is not configured. Check SMTP and mail environment variables.');
    return response.status(503).json({
      message: 'O envio está temporariamente indisponível. Tente novamente mais tarde ou use os canais oficiais.',
    });
  }

  const { name, email, role, city, age } = validation.data;
  const text = [
    'Nova solicitação de interesse — 2ª Região da Paraíba',
    '',
    `Nome: ${name}`,
    `Perfil: ${role}`,
    ...(age === null ? [] : [`Idade: ${age} anos`]),
    `Cidade: ${city}`,
    `Email para contato: ${email}`,
  ].join('\n');

  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure,
    auth: { user: mail.user, pass: mail.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    await transporter.sendMail({
      from: { name: '2ª Região da Paraíba', address: mail.from },
      to: mail.to,
      replyTo: { name, address: email },
      subject: 'Nova indicação — 2ª Região da Paraíba',
      text,
    });
  } catch (error) {
    console.error('SMTP delivery failed:', error?.code || error?.name || 'unknown error');
    return response.status(502).json({
      message: 'Não foi possível encaminhar a solicitação. Tente novamente em alguns minutos.',
    });
  }

  return response.status(200).json({ message: 'Solicitação encaminhada por email.' });
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

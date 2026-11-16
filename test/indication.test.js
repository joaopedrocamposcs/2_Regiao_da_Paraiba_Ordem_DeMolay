import test from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedOrigin, validateIndication } from '../lib/indication.js';

const validInput = {
  name: '  Ana   Silva ',
  email: 'ana@example.com',
  role: 'Jovem interessado (12 a 21 anos)',
  city: 'Campina Grande',
  age: '15',
  consent: true,
  website: '',
};

test('validates and normalizes a complete indication', () => {
  const result = validateIndication(validInput);

  assert.equal(result.ok, true);
  assert.deepEqual(result.data, {
    name: 'Ana Silva',
    email: 'ana@example.com',
    role: validInput.role,
    city: 'Campina Grande',
    age: 15,
  });
});

test('requires a youth age and consent', () => {
  assert.equal(validateIndication({ ...validInput, age: '' }).ok, false);
  assert.equal(validateIndication({ ...validInput, consent: false }).ok, false);
});

test('rejects invalid emails, cities, and filled honeypot', () => {
  assert.equal(validateIndication({ ...validInput, email: 'invalid' }).ok, false);
  assert.equal(validateIndication({ ...validInput, city: 'Cidade desconhecida' }).ok, false);
  assert.equal(validateIndication({ ...validInput, website: 'spam' }).ok, false);
});

test('allows only the site origin and local development origins', () => {
  const productionConfig = {
    siteUrl: 'https://regional.example',
    vercelUrl: 'project-preview.vercel.app',
    nodeEnv: 'production',
  };

  assert.equal(isAllowedOrigin('https://regional.example', productionConfig), true);
  assert.equal(isAllowedOrigin('https://project-preview.vercel.app', productionConfig), true);
  assert.equal(isAllowedOrigin('https://other.example', productionConfig), false);
  assert.equal(isAllowedOrigin('http://localhost:3000', { nodeEnv: 'development' }), true);
});

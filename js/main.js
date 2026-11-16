import { initializeInterestForm } from './components/interest-form.js';
import { initializeUnits } from './components/units.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeUnits();
  initializeInterestForm();
});

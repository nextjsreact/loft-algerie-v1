#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const localesDir = path.join(__dirname, '../public/locales');
const supportedLanguages = ['ar', 'en', 'fr'];
const namespaces = [
  'common', 'dashboard', 'transactions', 'nav', 'bills', 'tasks', 
  'teams', 'reservations', 'reports', 'executive', 'notifications',
  'paymentMethods', 'lofts', 'owners', 'settings', 'zoneAreas'
];

// Expected keys for each namespace (you can expand this)
const expectedKeys = {
  dashboard: [
    'title', 'subtitle', 'welcomeBack', 'totalLofts', 'occupiedLofts',
    'activeTasks', 'monthlyRevenue', 'teams', 'billMonitoring'
  ],
  transactions: [
    'title', 'subtitle', 'addNewTransaction', 'amount', 'category',
    'description', 'income', 'expense', 'currency', 'date'
  ],
  nav: [
    'dashboard', 'transactions', 'lofts', 'teams', 'settings',
    'conversations', 'reservations', 'tasks', 'reports', 'notifications'
  ],
  common: [
    'actions.add', 'actions.edit', 'actions.delete', 'actions.save',
    'actions.cancel', 'status.active', 'status.inactive', 'status.pending'
  ]
};

class TranslationValidator {
  constructor() {
    this.missingTranslations = new Map();
    this.inconsistentKeys = new Map();
  }

  validate() {
    console.log('🔍 Starting translation validation...\n');

    // Check if locales directory exists
    if (!fs.existsSync(localesDir)) {
      console.error('❌ Locales directory not found:', localesDir);
      return false;
    }

    let isValid = true;

    // Validate each language
    for (const language of supportedLanguages) {
      console.log(`📝 Validating ${language.toUpperCase()} translations...`);
      const languageValid = this.validateLanguage(language);
      isValid = isValid && languageValid;
    }

    // Check for inconsistencies across languages
    console.log('\n🔍 Checking for inconsistencies across languages...');
    const consistent = this.checkConsistency();
    isValid = isValid && consistent;

    // Report results
    this.reportResults();

    return isValid;
  }

  validateLanguage(language) {
    const languageDir = path.join(localesDir, language);
    if (!fs.existsSync(languageDir)) {
      console.error(`❌ Language directory not found: ${languageDir}`);
      return false;
    }

    let isValid = true;

    for (const namespace of namespaces) {
      const filePath = path.join(languageDir, `${namespace}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Missing file: ${filePath}`);
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(content);

        // Check for expected keys
        if (expectedKeys[namespace]) {
          const missing = this.findMissingKeys(translations, expectedKeys[namespace]);
          if (missing.length > 0) {
            this.missingTranslations.set(`${language}:${namespace}`, missing);
            console.warn(`⚠️  Missing keys in ${language}:${namespace}:`, missing);
            isValid = false;
          }
        }

        // Check for empty values
        const emptyValues = this.findEmptyValues(translations);
        if (emptyValues.length > 0) {
          console.warn(`⚠️  Empty values in ${language}:${namespace}:`, emptyValues);
        }

      } catch (error) {
        console.error(`❌ Error parsing ${filePath}:`, error.message);
        isValid = false;
      }
    }

    return isValid;
  }

  findMissingKeys(translations, expectedKeys) {
    const missing = [];
    
    for (const key of expectedKeys) {
      if (!this.hasNestedKey(translations, key)) {
        missing.push(key);
      }
    }
    
    return missing;
  }

  findEmptyValues(translations, path = '') {
    const empty = [];
    
    for (const [key, value] of Object.entries(translations)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.trim() === '') {
        empty.push(currentPath);
      } else if (typeof value === 'object' && value !== null) {
        empty.push(...this.findEmptyValues(value, currentPath));
      }
    }
    
    return empty;
  }

  hasNestedKey(obj, key) {
    return key.split('.').reduce((current, keyPart) => {
      return current && current[keyPart] !== undefined;
    }, obj);
  }

  checkConsistency() {
    let isValid = true;
    
    // Check that all languages have the same namespaces
    const namespaceSets = {};
    
    for (const language of supportedLanguages) {
      const languageDir = path.join(localesDir, language);
      if (fs.existsSync(languageDir)) {
        const files = fs.readdirSync(languageDir);
        const namespaces = files
          .filter(file => file.endsWith('.json'))
          .map(file => file.replace('.json', ''));
        
        namespaceSets[language] = new Set(namespaces);
      }
    }

    // Find differences
    const allNamespaces = new Set();
    Object.values(namespaceSets).forEach(set => {
      set.forEach(ns => allNamespaces.add(ns));
    });

    for (const namespace of allNamespaces) {
      const missingIn = [];
      
      for (const [language, set] of Object.entries(namespaceSets)) {
        if (!set.has(namespace)) {
          missingIn.push(language);
        }
      }
      
      if (missingIn.length > 0) {
        console.warn(`⚠️  Namespace '${namespace}' missing in: ${missingIn.join(', ')}`);
        isValid = false;
      }
    }

    return isValid;
  }

  reportResults() {
    console.log('\n📊 Validation Summary:');
    console.log('=====================');
    
    const missingCount = this.missingTranslations.size;
    if (missingCount > 0) {
      console.log(`❌ ${missingCount} translation issues found:`);
      
      for (const [key, missing] of this.missingTranslations) {
        console.log(`   ${key}: ${missing.join(', ')}`);
      }
    } else {
      console.log('✅ No missing translation keys found!');
    }

    console.log('\n💡 Recommendations:');
    console.log('==================');
    console.log('1. Standardize key naming across all translation files');
    console.log('2. Add missing translation keys to maintain consistency');
    console.log('3. Remove empty translation values');
    console.log('4. Consider using the translation validator in development mode');
    console.log('5. Implement automated validation in CI/CD pipeline');
  }
}

// Run validation
const validator = new TranslationValidator();
const isValid = validator.validate();

process.exit(isValid ? 0 : 1);
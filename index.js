'use strict';

const fromEntries = require('object.fromentries');
const entries = require('object.entries');

const allRules = require('./lib/rules');

function filterRules(rules, predicate) {
  return fromEntries(entries(rules).filter((entry) => predicate(entry[1])));
}

/**
 * @param {object} rules - rules object mapping rule name to rule module
 * @returns {Record<string, 2>}
 */
function configureAsError(rules) {
  return fromEntries(Object.keys(rules).map((key) => [`quiz-land/${key}`, 2]));
}

const activeRules = filterRules(allRules, (rule) => !rule.meta.deprecated);
const activeRulesConfig = configureAsError(activeRules);

const deprecatedRules = filterRules(allRules, (rule) => rule.meta.deprecated);

// for legacy config system
const plugins = [
  'quiz-land',
];

const plugin = {
  deprecatedRules: deprecatedRules,
  rules: allRules,
  configs: {
    recommended: {
      plugins: plugins,
      rules: {
        'quiz-land/schema-import': 'error',
      },
    },
    all: {
      plugins,
      rules: activeRulesConfig,
    },
  },
};

plugin.configs.flat = {
  recommended: {
    plugins: { 'quiz-land': plugin },
    rules: plugin.configs.recommended.rules,
  },
  all: {
    plugins: { 'quiz-land': plugin },
    rules: plugin.configs.all.rules,
  },
};

module.exports = plugin;

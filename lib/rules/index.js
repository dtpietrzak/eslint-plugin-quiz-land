'use strict';

/* eslint global-require: 0 */

/** @satisfies {Record<string, import('eslint').Rule.RuleModule>} */
module.exports = {
  'schema-import': require('./schema-import'),
}
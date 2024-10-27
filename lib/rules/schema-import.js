module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce import pathnames ending in "schema" to follow "import * as [name]Schema from \'@/[path]/schema\'"',
      recommended: 'error',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        // Check if the import path ends with '/schema'
        if (importSource.endsWith('/schema')) {
          const schemaImportRegex = /(\w+)?Schema\b/
          let hasValidImport = false

          // Check if any of the import specifiers match "[optional]Schema"
          for (const specifier of node.specifiers) {
            if (specifier.type === 'ImportNamespaceSpecifier' &&
              schemaImportRegex.test(specifier.local.name)) {
              hasValidImport = true
              break
            }
          }

          // If no valid import is found, report an error
          if (!hasValidImport) {
            context.report({
              node,
              message: `Imports from '${importSource}' must be in the form "import * as [optional]Schema from '${importSource}'"`,
            })
          }
        }
      },
    }
  },
}

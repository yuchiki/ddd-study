//

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
// eslint-disable-next-line import/no-unresolved
import ts from 'typescript-eslint'

const compat = new FlatCompat()

export default ts.config(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
  ...compat.extends('plugin:import/typescript'),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  importPlugin.flatConfigs.recommended,
  stylistic.configs['recommended'],
  {
    rules: {
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'object',
            'type',
            'index',
          ],
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': ['builtin'],
          'alphabetize': { order: 'asc', caseInsensitive: true },
          'pathGroups': [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs'],
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['node_modules/'],
  },
)

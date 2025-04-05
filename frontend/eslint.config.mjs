import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import ts from 'typescript-eslint'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = ts.config(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  js.configs.recommended,
  ...ts.configs.strictTypeChecked,
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
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ignores: ['node_modules/', '.next'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
)

export default eslintConfig

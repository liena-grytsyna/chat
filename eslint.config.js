import js from '@eslint/js'
import globals from 'globals'

export default [
  // Игнорируем эти директории
  {
    ignores: ['dist/', 'node_modules/', 'server/'],
  },
  // Основные правила для JS файлов
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn',
    },
  },
  // Правила для серверного кода
  {
    files: ['server/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
    },
  },
]

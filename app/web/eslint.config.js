import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

/**
 * Lint con tipos, enfocado a lo que pide la guía (typescript.md): las dos reglas
 * que necesitan información de tipos y que un `tsc` no da por sí solo.
 *
 *  - no-floating-promises: una promesa sin await ni catch se pierde en silencio.
 *    En el Relevo hay timers y capturas async; esto las caza.
 *  - no-misused-promises: pasar un handler async donde se espera void.
 *    Con checksVoidReturn.attributes:false para no marcar los onClick async de
 *    React, que ahí es un uso legítimo.
 *
 * A propósito NO se activa `recommendedTypeChecked` entero: marcaría los `as` y
 * los imports de JSON del catálogo, que aquí son deliberados, y sería ruido.
 */
export default tseslint.config(
  { ignores: ['dist', 'dev-dist', 'node_modules'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // De react-hooks solo las dos reglas ESTABLES y valiosas. El `recommended`
      // de la v7 trae además reglas experimentales del React Compiler (purity,
      // set-state-in-effect) que marcan patrones correctos y probados —resetear
      // un contador al cambiar de fase, `Date.now()` en un initializer de useRef
      // que React descarta tras montar—; no se activan.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Estas dos reglas de ESLint base no entienden sintaxis TS: `no-unused-vars`
      // marca tipos y params de callback; `no-undef` marca globals de build
      // (`__VERSION__`) y el namespace `React` de los tipos. `tsc` ya cubre las
      // dos mejor (noUnusedLocals, y el propio compilador para lo indefinido).
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
)

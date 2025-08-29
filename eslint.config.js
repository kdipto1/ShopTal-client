
import next from 'eslint-config-next';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';

export default [
  next,
  {
    files: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      jest,
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...jestDom.configs.recommended.rules,
      ...testingLibrary.configs.react.rules,
    },
  },
  {
    rules: {
      'testing-library/prefer-screen-queries': 'error',
      'testing-library/no-manual-cleanup': 'error',
      'testing-library/prefer-user-event': 'error',
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off"
    }
  }
];

module.exports = {
    root: true,
    extends: [
        "react",
        "recommended"
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react'
    ],
    parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
    },
}

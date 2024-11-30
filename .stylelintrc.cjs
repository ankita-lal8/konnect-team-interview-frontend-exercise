module.exports = {
  extends: [
    'stylelint-config-html',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
  ],
  overrides: [
    {
      files: [
        '**/*.vue',
        '**/*.scss',
      ],
      rules: {
        // Disable the following rules
        'custom-property-no-missing-var-function': null,
        'no-descending-specificity': null,
      },
    },
  ],
  plugins: ['stylelint-order'],
  rules: { 'order/properties-alphabetical-order': false,'vue/multi-word-component-names': false,'vue/singleline-html-element-content-newline': false, '@stylistic/comma-dangle':false,'@stylistic/object-curly-spacing':false },
}

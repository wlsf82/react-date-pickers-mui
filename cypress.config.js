const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://mui.com/x/react-date-pickers',
    env: { hideXhr: true },
  },
  fixturesFolder: false,
})

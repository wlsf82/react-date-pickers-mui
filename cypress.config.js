const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '2obqu6',
  e2e: {
    baseUrl: 'https://mui.com/x/react-date-pickers',
    env: { hideXhr: true },
  },
  fixturesFolder: false,
  retries: {
    runMode: 2,
    openMode: 0
  },
})

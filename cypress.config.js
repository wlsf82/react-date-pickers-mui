const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '2obqu6',
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
  fixturesFolder: false,
  retries: {
    runMode: 2,
    openMode: 0
  },
})

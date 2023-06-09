const cypress = require('cypress')
const fs = require('fs')
const path = require('path')

cypress.run().then(({
  status,
  startedTestsAt,
  endedTestsAt,
  totalDuration,
  totalTests,
  totalPassed,
  totalPending,
  totalFailed,
  totalSkipped,
  browserName,
  browserVersion,
  osName,
  osVersion,
  cypressVersion,
  runs,
}) => {
  let testResultsObj = {
    status,
    startedTestsAt,
    endedTestsAt,
    totalDuration: `${totalDuration / 1000} seconds`,
    totalTests,
    totalPassed,
    totalPending,
    totalFailed,
    totalSkipped,
    browserName,
    browserVersion,
    osName,
    osVersion,
    cypressVersion,
  }

  const testCases = runs[0].tests.map((({ title }) => title[title.length - 1]))

  testResultsObj.testCases = testCases
  testResultsObj = JSON.stringify(testResultsObj)

  const testReportDir = path.resolve(`${__dirname}/test-report`)

  if (!fs.existsSync(testReportDir)){
    fs.mkdirSync(testReportDir)
  }

  const testResultsFile = `${testReportDir}/testResults.json`

  fs.writeFile(testResultsFile, testResultsObj, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`\nTest report available at: ${testResultsFile}\n`)
    }
  })
})

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://www.whatismyip.com.tw',
    viewportWidth: 1280,
    viewportHeight: 720,
    // 增加超時時間以避免 429 錯誤
    defaultCommandTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    // 減慢測試執行速度
    watchForFileChanges: false,
    // 關閉測試隔離，讓 before 可以在所有測試間共享狀態
    testIsolation: false,
    // JUnit XML 報告設定
    reporter: 'junit',
    reporterOptions: {
      mochaFile: 'cypress/results/junit.xml',
      toConsole: true,
    },
  },
})

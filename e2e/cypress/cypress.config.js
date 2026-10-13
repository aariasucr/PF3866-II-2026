const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "j22gii",
  video: true,
  defaultBrowser: "chrome",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

const path = require("path");
const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set("@", path.resolve(__dirname, "./src"));
  },
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"), // map '@' to './src'
  //   },
  // },
});

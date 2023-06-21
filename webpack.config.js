/*
const createExpoWebpackConfig = require("@expo/webpack-config");

module.exports = function(env, argv) {
  env.mode = "development";
  env.pwa = false;
  const config = createExpoWebpackConfig(env, argv);
  return config;
};
*/
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  env.pwa = false;
  //env.mode = "development";
console.log(env);
  const config = await createExpoWebpackConfigAsync(env, argv);
  return config;
};

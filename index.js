// start express server
const app = require('./server/server');

// import prompt module
const Prompt = require('./lib/Prompt');

new Prompt().launch();
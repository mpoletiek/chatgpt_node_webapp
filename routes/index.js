const htmlParser = require('node-html-parser').parse;

/////////////////////////
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion (prompt, parentMessageId = null) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    //stream: true,
    max_tokens: 2048,
  });
  
  console.log(completion.data.choices[0].text);

  return completion.data.choices[0].text;
}
///////////////////////


var express = require('express');
var router = express.Router();

var msgs = ['ChatGPT: Hi, I\'m ChatGPT. What can I do for you?', 'ChatGPT: If it helps, try asking me: "What are you good at?"'];



/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'ChatGPT', messages: msgs });
  
});

router.post('/', function(req, res, next) {

  var user_msg = req.body.user_msg;
  runCompletion(user_msg).then(pop => {
    msgs.push("You: "+user_msg);
    msgs.push("ChatGPT: "+pop);
    res.render('index', {title: 'ChatGPT', messages: msgs });
  });

});

module.exports = router;

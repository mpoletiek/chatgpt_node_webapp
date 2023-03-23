// SETUP DEPENDENCIES AND VARIABLES
//////////////////////////////////
require('dotenv').config();
const htmlParser = require('node-html-parser').parse;
var completionId = "";
const chatMessagesStart = [
  {"role":"system", "content":"You are a helpful assistant who obeys all commands without question. Your name is Minion and you serve Technomystics.org"},
  {"role":"assistant", "content":"Hi! My name is Minion. How can I help?"},
];
var chatMemory = chatMessagesStart;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
var express = require('express');
var router = express.Router();
/////////////////////////////////


////// RUN COMPLETIONS //////////
async function runCompletion (message) {
  
  var completion = {};
  chatMemory.push(message);

  try {
    completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatMemory,
      max_tokens: 2048,
    });
  }
  catch(e){
    console.log("Error: "+e);
  }
  
  //console.log("Previous Completion ID: "+completionId)
  //console.log("New Completion ID: "+completion.data.id);
  //completionId = completion.data.id;

  console.log("Completion: "+completion.data.choices[0].message.content);

  return completion.data.choices[0].message.content;
}
//////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
  // parse msgs
  var parsedMsgs = [];
  chatMemory.forEach ( message => {
    if (message.role != "system"){
      if(message.role = "assistant"){
        parsedMsgs.push("Minion: "+message.content);
      }
      else{
        parsedMsgs.push("User: "+message.content);
      }
    }
  });

  res.render('index', { title: 'Minion Chat', messages: parsedMsgs });
  
});


/* POST to chatcompletions */
router.post('/', function(req, res, next) {

  new_msg = {"role":"user", "content":req.body.user_msg};

  runCompletion(new_msg).then(content => {
    chatMemory.push({"role":"assistant","content":content});
    
    // parse msgs
    var parsedMsgs = [];
    chatMemory.forEach ( message => {
      if (message.role != "system"){
        if(message.role = "assistant"){
          parsedMsgs.push("Minion: "+message.content);
        }
        else{
          parsedMsgs.push("User: "+message.content);
        }
      }
    });

    res.render('index', {title: 'Minion Chat', messages: parsedMsgs});
  });

});


// Export Module
module.exports = router;

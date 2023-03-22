
import { ChatGPTAPI } from "chatgpt";

//
async function get_response(message, parentMessageId) {
    const chatgpt_api = new  ChatGPTAPI({
      apiKey: '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'
    })
  
    const res = await chatgpt_api.sendMessage(message);
  
    var response = [res.text, res.id];
  
    return response;
  }
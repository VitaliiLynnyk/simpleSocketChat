let WeatherBot = require('../botClass/WeatherBot');
let QoutesBot = require('../botClass/QoutesBot');
let AdviceBot = require('../botClass/AdviceBot');
let NoteBot = require('../botClass/NoteBot');
let MoneyExchangeBot = require('../botClass/MoneyExchangeBot');

module.exports = class BotFactory {
  create(msg) {
    let bot;
    if (msg.indexOf("weather") > -1) {
      bot = new WeatherBot();
      bot.parseMsg(msg);
      return bot.say();
    } else if (msg.indexOf("show qoute") > -1) {
      bot = new QoutesBot();
      bot.setQoute();
      return bot.say();
    } else if ((msg.indexOf("Що мені робити") > -1) || (msg.indexOf("advice") > -1)) {
      bot = new AdviceBot();
      bot.setAdvice();
      return bot.say();
    } else if (msg.indexOf("save note") > -1) {
      let str = extractAllText(msg);
      if (str.length === 2) {
        bot = new NoteBot();
        return bot.setNote(str[0], str[1]);
      } else {
        return `sorry write save note title:".." body:"..."`
      }
    } else if (msg.indexOf("show note") > -1) {
      let str = extractAllText(msg);
      bot = new NoteBot();
      return bot.getNote(str[0]);
    } else if (msg.indexOf("delete note") > -1) {
      let str = extractAllText(msg);
      bot = new NoteBot();
      bot.removeNote(str);
    } else if (msg.indexOf("convert") > -1) {
      let arrayOfInformations = msg.split(" ");
      bot = new MoneyExchangeBot();

      if (arrayOfInformations.length === 6) {
        return bot.exchangeMoney(arrayOfInformations[2], arrayOfInformations[3], arrayOfInformations[5]);
      } else {
        return `sorry write "convert value dolars/euro to dolars/euro`;
      }
    } else {
      return `" please write correct /what is the weather (today,...,monday..)/show qoute/Що мені робити../advice/save note title:"..",body:"..."/show note title:"..""/delete note title:".." `;
    }
  }
}

function extractAllText(str) {
  const re = /"(.*?)"/g;
  const result = [];
  let current;
  while (current = re.exec(str)) {
    result.push(current.pop());
  }
  return result.length > 0
    ? result
    : [str];
}

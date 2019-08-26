module.exports = class WeatherBot {
  constructor() {
    this.temperature = Math.floor(Math.random() * (40 - (-40))) - 40;
  }

  parseMsg(msg) {
    let daysArray = ["today", "tommorow", "yesterday", "monday", "tuesday", "thursday", "friday", "saturday", "sunday"];
    let cityArray = ["kharkiv", "odessa", "dnipro", "kiev", "lviv", "horodische", "cherkasy"];

    this.day = checkStringInArray(msg, daysArray);
    this.city = checkStringInArray(msg, cityArray);
  }

  say() {
    console.log(this.day, this.city);
    if (this.day === undefined) {
      return `please write correct information`;
    } else if (this.city === undefined) {
      return `the weather on ${this.day} is ${this.temperature}`;
    } else {
      return `the weather on ${this.day} in ${this.city} is ${this.temperature}`;
    }
  }
}

function checkStringInArray(string, array) {
  for (let i in array) {
    if (string.indexOf(array[i]) > -1) {
      return array[i];
    }
  }
}
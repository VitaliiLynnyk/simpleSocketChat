module.exports = class QoutesBot {
  setQoute() {
    let qoutesArray = ["There is only one happiness in this life, to love and be loved. George Sand", "Because of your smile, you make life more beautiful. Thich Nhat Hanh",
      "Lighten up, just enjoy life, smile more, laugh more, and don't get so worked up about things. Kenneth Branagh", "Your smile will give you a positive countenance that will make people feel comfortable around you. Les Brown",
      "We shall never know all the good that a simple smile can do. Mother Teresa", "A warm smile is the universal language of kindness. William Arthur Ward",
      "Every day brings new choices. Martha Beck", "\n God never ends anything on a negative; God always ends on a positive. Edwin Louis Cole"];
    this.qoute = qoutesArray[Math.floor(Math.random() * qoutesArray.length)];
  }
  say() {
    return `" ${this.qoute} "`;
  }
}

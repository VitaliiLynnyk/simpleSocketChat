module.exports = class AdviceBot {
  setAdvice() {
    const adviceArray = ["sleep", "drink coffee"];
    this.advice = adviceArray[Math.floor(Math.random() * adviceArray.length)];
  }
  say() {
    return `"${this.advice}"`;
  }
}
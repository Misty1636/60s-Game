class PlayGame {
  constructor() {
    this.temScore = 0;
    this.firstNum = 0;
    this.secondNum = 0;
    this.result = '';
    this.temOperation = '';
    this.allOperation = ['+', '-', 'x', '÷'];
    this.totalTime = 60;
    this.timeSec = 0;
    this.timeMin = 0;
    this.level = 1;
    const timeStart = setInterval(() => {
      this.totalTime -= 1;
      if (this.totalTime === 0) {
        clearInterval(timeStart);
        this.displayReslut();
      }
      this.displayTime();
    }, 1000);
    this.displayTime();
    this.updateScore();
    this.getOperation();
  }

  getNum() {
    let tem;
    switch (this.level) {
      case 1:
        this.firstNum = Math.floor(Math.random() * 9) + 1;
        this.secondNum = Math.floor(Math.random() * 9) + 1;
        break;
      case 2:
        this.firstNum = Math.floor(Math.random() * 90) + 10;
        this.secondNum = Math.floor(Math.random() * 90) + 10;
        break;
      case 3:
        this.firstNum = Math.floor(Math.random() * 900) + 100;
        this.secondNum = Math.floor(Math.random() * 900) + 100;
        break;
      default:
        break;
    }

    if ((this.firstNum < this.secondNum && this.temOperation === '-') || (this.firstNum < this.secondNum && this.temOperation === '÷')) {
      tem = this.secondNum;
      this.secondNum = this.firstNum;
      this.firstNum = tem;
    }
    if (this.temOperation === '÷') {
      if ((this.firstNum % this.secondNum) !== 0) this.CheckPrime(this.firstNum);
    }
    document.querySelector('.palying__question__firstNum').textContent = this.firstNum;
    document.querySelector('.palying__question__secondNum').textContent = this.secondNum;
  }

  CheckPrime(num) {
    const ary = [];
    if (num === 1) this.secondNum = 1;
    if (num === 2) this.secondNum = Math.floor(Math.random() * 1) + 1;
    if (num > 2) {
      for (let i = 2; i < Math.floor(Math.sqrt(num)) + 1; i += 1) {
        if (num % i === 0) {
          ary.push(i);
        }
      }
      if (ary.length < 1) {
        this.getNum();
        return;
      }
      this.secondNum = ary[Math.floor(Math.random() * ary.length)];
    }
  }

  getOperation() {
    this.temOperation = this.allOperation[Math.floor(Math.random() * this.allOperation.length)];
    document.querySelector('.palying__question__operation').textContent = this.temOperation;
    this.getNum();
  }

  getAnswer(answer) {
    this.result = answer;
    this.checkReslut();
  }

  checkReslut() {
    let str;
    let num = 1;
    switch (this.temOperation) {
      case '+':
        str = this.firstNum + this.secondNum;
        break;
      case '-':
        str = this.firstNum - this.secondNum;
        break;
      case 'x':
        str = this.firstNum * this.secondNum;
        break;
      case '÷':
        str = this.firstNum / this.secondNum;
        break;
      default:
        break;
    }
    if (this.level === 3) num = 5;

    if (String(str) === this.result) {
      this.temScore += num;
      document.querySelector('.success').currentTime = 0;
      document.querySelector('.success').play();
    }
    if (this.temScore > 0 && String(str) !== this.result) {
      this.temScore -= 1;
    }

    if (String(str) !== this.result) {
      document.querySelector('.fail').currentTime = 0;
      document.querySelector('.fail').play();
    }

    this.getOperation();
    this.updateScore();
  }

  updateScore() {
    let str;
    if (String(this.temScore).length === 1) str = `00${this.temScore}`;
    if (String(this.temScore).length === 2) str = `0${this.temScore}`;
    document.querySelector('.palying__info__score').textContent = str;
  }

  displayReslut() {
    if (this.temScore > 10) document.querySelector('.clapping').play();
    document.querySelector('.end__score').textContent = this.temScore;
    document.querySelector('.palying').classList.remove('isActive');
    document.querySelector('.end').classList.add('isActive');
  }

  displayTime() {
    if (this.totalTime >= 60) {
      this.timeMin = Math.floor(this.totalTime / 60);
      this.timeSec = this.totalTime % 60;
    } else {
      this.timeMin = 0;
      this.timeSec = this.totalTime;
    }

    if (String(this.timeMin).length === 1) this.timeMin = `0${this.timeMin}`;
    if (String(this.timeSec).length === 1) this.timeSec = `0${this.timeSec}`;

    if (this.totalTime <= 40 && this.totalTime > 20) this.level = 2;
    if (this.totalTime <= 20) this.level = 3;

    document.querySelector('.palying__time').innerHTML = `${this.timeMin} : ${this.timeSec}`;
  }
}

let NewGame;
const startBtn = document.querySelector('.start__confirm__btn');
const playing = document.querySelector('.palying__question__enter');
const resetBtn = document.querySelector('.end__reset');

startBtn.addEventListener('click', () => {
  document.querySelector('.rain').pause();
  document.querySelector('.rain').currentTime = 0;
  document.querySelector('.start').classList.remove('isActive');
  document.querySelector('.palying').classList.add('isActive');
  NewGame = new PlayGame();
});

playing.addEventListener('keyup', (e) => {
  const key = e.keyCode || e.which || e.charcode;
  if (key === 13 || key === 108) {
    NewGame.getAnswer(playing.value);
    playing.value = '';
  }
});

resetBtn.addEventListener('click', () => {
  NewGame = null;
  playing.value = '';
  document.querySelector('.clapping').pause();
  document.querySelector('.clapping').currentTime = 0;
  document.querySelector('.end').classList.remove('isActive');
  document.querySelector('.start').classList.add('isActive');
  document.querySelector('.rain').currentTime = 0;
  document.querySelector('.rain').play();
});

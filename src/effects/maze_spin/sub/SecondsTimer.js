export default class SecondsTimer {
  // let timer = SecondsTimer(period)
  //    period
  //      = seconds between trigger
  //      = -1 to never trigger
  //
  constructor(period) {
    this.setPeriod(period);
  }

  // setPeriod(newPeriod)
  // establish a new timer period
  setPeriod(newPeriod) {
    this.period = newPeriod;
    this.start();
  }

  // establish start time
  start() {
    this.startSecs = secsTime();
  }

  // return seconds since start time established
  lapse() {
    let nowSecs = secsTime();
    return nowSecs - this.startSecs;
  }

  // return truthy 1 if period seconds has passed
  //    and restart timer if so.
  arrived() {
    let nowSecs = secsTime();
    let lapse = nowSecs - this.startSecs;
    if (this.period >= 0 && lapse > this.period) {
      this.startSecs = nowSecs;
      return 1;
    }
    return 0;
  }

  // return 0 to 1.0 as fraction of time to complete period
  progress() {
    return this.lapse() / this.period;
  }
}

// return relative time in seconds
function secsTime() {
  return millis() / 1000;
}

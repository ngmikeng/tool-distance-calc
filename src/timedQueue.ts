interface TimedJob {
  callback: Function;
  time: number;
}
// Singleton TimedQueue
export default class TimedQueue {
  private static instance: TimedQueue;
  private queue: Array<TimedJob> = [];
  private tHandle: any = null;
  private done: boolean = true;

  constructor() { }

  public static getInstance() {
    if (!TimedQueue.instance) {
      TimedQueue.instance = new TimedQueue();
    }
    return TimedQueue.instance;
  }

  addTask(job: TimedJob): number {
    if (!this.done) {
      throw new Error('Job is under process');
    }
    return this.queue.push(job);
  }

  removeTask(job: TimedJob) {
    if (!this.done) {
      throw new Error('Job is under process');
    }
    let index = this.queue.indexOf(job);
    if (index == -1) {
      throw new Error('Job not found');
    }
    this.queue.splice(index, 1);
  }

  start() {
    if (!this.done) {
      throw new Error('Job already started');
    }
    if (this.queue.length == 0) {
      throw new Error('Job Queue is empty');
    }
    this.done = false;
    this.tHandle = setTimeout(() => { this.next() }, 0);
  }

  private next() {
    if (this.queue.length == 0) {
      this.done = true;
      return;
    }
    let job: TimedJob = this.queue.shift();
    job.callback.call(null);
    this.tHandle = setTimeout(() => { this.next() }, job.time);
  }

  stop() {
    if (!this.done) {
      throw new Error('Queue is not started');
    }
    clearTimeout(this.tHandle);
  }

  reset() {
    clearTimeout(this.tHandle);
    this.tHandle = null;
    this.done = true;
    if (this.queue.length > 0) {
      this.queue.splice(0, this.queue.length);
    }
  }
}

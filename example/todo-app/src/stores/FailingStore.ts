import { makeAutoObservable } from "mobx";

export default class FailingStore {
  retried = false;

  constructor() {
    makeAutoObservable(this);
  }

  setHasRetried = (): void => {
    this.retried = true;
  };

  loadFailing = (): Promise<void> => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        if (!this.retried) {
          rej(new Error());
        } else {
          res();
        }
      }, 1000);
    });
  };
}

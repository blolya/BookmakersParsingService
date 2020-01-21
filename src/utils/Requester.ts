import {Flowable} from "./react";
import url from "url"
import request from "request";


export class Requester extends Flowable {
  private readonly interval: NodeJS.Timeout;

  constructor(address: string = '', options: object = {}, timeout: number = 1000) {
    super();

    if (!new url.URL(address))
      throw Error();

    this.interval = setInterval(async () => {
      request(address, options,(err: any, res: request.Response, body: any) => {
        this.emit("response", body);
      })
    }, timeout);
  }

  unsubscribe() {
    clearInterval(this.interval);
  }
}

import { JSDOM } from "jsdom";

const dom = new JSDOM();

const MessageEvent = dom.window.MessageEvent;
const ErrorEvent = dom.window.ErrorEvent;

export { MessageEvent, ErrorEvent };

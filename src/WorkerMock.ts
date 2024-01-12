import { RequestListener, WorkerFacade } from "@giancosta86/worker-facade";
import { ErrorEvent } from "./globalDom";
import { SerializingChannel } from "./SerializingChannel";

export class WorkerMock<TRequest, TResponse> implements WorkerFacade<TRequest> {
  static create<TRequest, TResponse>(
    requestListener: RequestListener<TRequest, TResponse>
  ): WorkerMock<TRequest, TResponse> {
    return new WorkerMock<TRequest, TResponse>(requestListener);
  }

  private readonly listeners: Map<
    WorkerFacade.EventType,
    WorkerFacade.EventListener<WorkerFacade.EventType>[]
  > = new Map([
    ["message", []],
    ["messageerror", []],
    ["error", []]
  ]);

  private readonly requestChannel = new SerializingChannel<TRequest>({
    onMessage: requestMessage => {
      try {
        this.requestListener(
          requestMessage.data,
          this.responseChannel.sendMessage.bind(this.responseChannel)
        );
      } catch (err) {
        const errorEvent = new ErrorEvent("error", {
          message: err instanceof Error ? err.message : String(err)
        });

        this.listeners
          .get("error")!
          .forEach(listener => listener.call(this, errorEvent));
      }
    },

    onMessageError: messageErrorEvent => {
      this.listeners
        .get("messageerror")!
        .forEach(listener => listener.call(this, messageErrorEvent));
    }
  });

  private readonly responseChannel = new SerializingChannel<TResponse>({
    onMessage: messageEvent => {
      this.listeners
        .get("message")!
        .forEach(listener => listener.call(this, messageEvent));
    },

    onMessageError: messageErrorEvent => {
      this.listeners
        .get("messageerror")!
        .forEach(listener => listener.call(this, messageErrorEvent));
    }
  });

  private constructor(
    private readonly requestListener: RequestListener<TRequest, TResponse>
  ) {}

  addEventListener<K extends WorkerFacade.EventType>(
    type: K,
    listener: WorkerFacade.EventListener<K>
  ): void {
    switch (type) {
      case "message":
      case "messageerror":
      case "error":
        this.listeners.get(type)!.push(listener as any);
        break;

      default:
        throw new Error(`Unsupported event type: ${type}`);
    }
  }

  removeEventListener<K extends WorkerFacade.EventType>(
    type: K,
    listener: WorkerFacade.EventListener<K>
  ): void {
    switch (type) {
      case "message":
      case "messageerror":
      case "error":
        this.listeners.set(
          type,
          this.listeners
            .get(type)!
            .filter(currentListener => currentListener != listener)
        );
        break;

      default:
        throw new Error(`Unsupported event type: ${type}`);
    }
  }

  postMessage(request: TRequest): void {
    this.requestChannel.sendMessage(request);
  }
}

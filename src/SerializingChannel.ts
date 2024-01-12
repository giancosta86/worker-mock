export namespace SerializingChannel {
  export type Settings<T> = Readonly<{
    onMessage: (messageEvent: MessageEvent<T>) => void;
    onMessageError: (messageErrorEvent: MessageEvent<Error>) => void;
  }>;
}

export class SerializingChannel<T> {
  constructor(private readonly settings: SerializingChannel.Settings<T>) {}

  sendMessage(message: T): void {
    const { onMessage, onMessageError } = this.settings;

    let clonedMessage;
    try {
      clonedMessage = structuredClone(message);
    } catch (err) {
      onMessageError(
        new MessageEvent("messageerror", {
          data: err as Error
        })
      );

      return;
    }

    onMessage(new MessageEvent("message", { data: clonedMessage }));
  }
}

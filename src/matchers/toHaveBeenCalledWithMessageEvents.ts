export function toHaveBeenCalledWithMessageEvents(
  this: jest.MatcherContext,
  listener: jest.Mock,
  expectedMessages: readonly unknown[]
): jest.CustomMatcherResult {
  const { printReceived, printExpected, matcherHint } = this.utils;

  const actualMessages = listener.mock.calls.map(([messageEvent]) => {
    expect(messageEvent.type === "message");
    return messageEvent.data;
  });

  const pass =
    JSON.stringify(actualMessages) === JSON.stringify(expectedMessages);

  return {
    pass,
    message: () =>
      pass
        ? matcherHint(`.not.${toHaveBeenCalledWithMessageEvents.name}`) +
          "\n\n" +
          "Unexpected message sequence:\n" +
          `  ${printExpected(expectedMessages)}\n`
        : matcherHint(`.${toHaveBeenCalledWithMessageEvents.name}`) +
          "\n\n" +
          "Expected messages:\n" +
          `  ${printExpected(expectedMessages)}\n` +
          "Received messages:\n" +
          `  ${printReceived(actualMessages)}`
  };
}

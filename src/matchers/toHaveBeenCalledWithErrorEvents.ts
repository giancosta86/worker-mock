export function toHaveBeenCalledWithErrorEvents(
  this: jest.MatcherContext,
  listener: jest.Mock,
  expectedErrorMessages: readonly string[]
): jest.CustomMatcherResult {
  const { printReceived, printExpected, matcherHint } = this.utils;

  const actualErrorMessages = listener.mock.calls.map(([errorEvent]) => {
    expect(errorEvent.type === "error");
    return errorEvent.message;
  });

  const pass =
    JSON.stringify(actualErrorMessages) ===
    JSON.stringify(expectedErrorMessages);

  return {
    pass,
    message: () =>
      pass
        ? matcherHint(`.not.${toHaveBeenCalledWithErrorEvents.name}`) +
          "\n\n" +
          "Unexpected error message sequence:\n" +
          `  ${printExpected(expectedErrorMessages)}\n`
        : matcherHint(`.${toHaveBeenCalledWithErrorEvents.name}`) +
          "\n\n" +
          "Expected error messages:\n" +
          `  ${printExpected(expectedErrorMessages)}\n` +
          "Received error messages:\n" +
          `  ${printReceived(actualErrorMessages)}`
  };
}

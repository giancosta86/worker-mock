// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace jest {
  interface Matchers<R> {
    toHaveBeenCalledWithMessageEvents(expectedMessages: readonly unknown[]): R;

    toHaveBeenCalledWithErrorEvents(
      expectedErrorMessages: readonly string[]
    ): R;
  }
}

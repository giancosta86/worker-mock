import { ErrorEvent } from "../globalDom";
import { toHaveBeenCalledWithErrorEvents } from "./toHaveBeenCalledWithErrorEvents";

describe(`.${toHaveBeenCalledWithErrorEvents.name}`, () => {
  describe("when the expected ErrorEvent was passed", () => {
    it("should pass", () => {
      const errorMessage = "This is a test";

      const listener = jest.fn();
      listener(
        new ErrorEvent("error", {
          message: errorMessage
        })
      );

      expect(listener).toHaveBeenCalledWithErrorEvents([errorMessage]);
    });
  });

  describe("when a sequence of expected ErrorEvent was passed", () => {
    it("should pass", () => {
      const firstErrorMessage = "Alpha";
      const secondErrorMessage = "Beta";

      const listener = jest.fn();
      listener(
        new ErrorEvent("error", {
          message: firstErrorMessage
        })
      );
      listener(
        new ErrorEvent("error", {
          message: secondErrorMessage
        })
      );

      expect(listener).toHaveBeenCalledWithErrorEvents([
        firstErrorMessage,
        secondErrorMessage
      ]);
    });
  });

  describe("when another ErrorEvent was passed", () => {
    it("should fail", () => {
      const listener = jest.fn();
      listener(new ErrorEvent("error", { message: "This is a test" }));

      expect(() => {
        expect(listener).toHaveBeenCalledWithErrorEvents(["<CIOP>"]);
      }).toThrow("Expected error messages");
    });
  });

  describe("when a longer sequence of actual ErrorEvent was passed", () => {
    it("should fail", () => {
      const firstErrorMessage = "Alpha";
      const secondErrorMessage = "Beta";

      const listener = jest.fn();
      listener(
        new ErrorEvent("error", {
          message: firstErrorMessage
        })
      );
      listener(
        new ErrorEvent("error", {
          message: secondErrorMessage
        })
      );
      listener(
        new ErrorEvent("error", {
          message: "Gamma"
        })
      );

      expect(() => {
        expect(listener).toHaveBeenCalledWithErrorEvents([
          firstErrorMessage,
          secondErrorMessage
        ]);
      }).toThrow("Expected error messages");
    });
  });
});

describe(`.not.${toHaveBeenCalledWithErrorEvents.name}`, () => {
  describe("when the expected ErrorEvent was passed", () => {
    it("should fail", () => {
      const errorMessage = "This is a test";

      const listener = jest.fn();
      listener(new ErrorEvent("error", { message: errorMessage }));

      expect(() => {
        expect(listener).not.toHaveBeenCalledWithErrorEvents([errorMessage]);
      }).toThrow("Unexpected error message sequence");
    });
  });

  describe("when another ErrorEvent was passed", () => {
    it("should pass", () => {
      const listener = jest.fn();
      listener(new ErrorEvent("error", { message: "This is a test" }));

      expect(listener).not.toHaveBeenCalledWithErrorEvents(["<Ciop>"]);
    });
  });
});

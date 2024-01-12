import { MessageEvent } from "../globalDom";
import { toHaveBeenCalledWithMessageEvents } from "./toHaveBeenCalledWithMessageEvents";

const matchingScenarios: readonly Readonly<{
  expectedDescription: string;
  expectedMessages: readonly unknown[];
}>[] = [
  {
    expectedDescription: "no messages",
    expectedMessages: []
  },

  {
    expectedDescription: "a numeric message",
    expectedMessages: [90]
  },

  {
    expectedDescription: "a string message",
    expectedMessages: ["Dodo"]
  },

  {
    expectedDescription: "an object message",
    expectedMessages: [{ name: "Yogi", age: 37 }]
  },

  {
    expectedDescription: "multiple number messages",
    expectedMessages: [90, 92, 95, 98]
  },

  {
    expectedDescription: "an numeric array message",
    expectedMessages: [[90, 92, 95, 98]]
  },

  {
    expectedDescription: "a mixed-type array message",
    expectedMessages: [["Dodo", 32, true]]
  }
];

const nonMatchingScenarios: readonly Readonly<{
  expectedDescription: string;
  actualMessages: readonly unknown[];
  expectedMessages: readonly unknown[];
}>[] = [
  {
    expectedDescription: "a totally different message",
    actualMessages: [91],
    expectedMessages: [90]
  },

  {
    expectedDescription: "totally different messages",
    actualMessages: [91, "Ciop"],
    expectedMessages: [37, "X"]
  },

  {
    expectedDescription: "partially different messages",
    actualMessages: [92, "Ciop"],
    expectedMessages: [92, "X"]
  },

  {
    expectedDescription: "less messages",
    actualMessages: [92, "Ciop"],
    expectedMessages: [92]
  },

  {
    expectedDescription: "more messages",
    actualMessages: [92],
    expectedMessages: [92, "Dodo"]
  }
];

describe(`.${toHaveBeenCalledWithMessageEvents.name}`, () => {
  describe.each(matchingScenarios)(
    "when expecting $expectedDescription",
    ({ expectedMessages }) => {
      it("should pass", () => {
        const listener = jest.fn();

        for (const expectedMessage of expectedMessages) {
          listener(new MessageEvent("message", { data: expectedMessage }));
        }

        expect(listener).toHaveBeenCalledWithMessageEvents(expectedMessages);
      });
    }
  );

  describe.each(nonMatchingScenarios)(
    "when preventing $expectedDescription",
    ({ actualMessages, expectedMessages }) => {
      it("should fail", () => {
        const listener = jest.fn();

        actualMessages.forEach(message => {
          listener(new MessageEvent("message", { data: message }));
        });

        expect(() => {
          expect(listener).toHaveBeenCalledWithMessageEvents(expectedMessages);
        }).toThrow("Expected messages");
      });
    }
  );
});

describe(".not.toHaveMessages", () => {
  describe.each(matchingScenarios)(
    "when expecting $expectedDescription non-matched by the actual value",
    ({ expectedMessages }) => {
      it("should fail", () => {
        const listener = jest.fn();

        for (const expectedMessage of expectedMessages) {
          listener(new MessageEvent("message", { data: expectedMessage }));
        }

        expect(() => {
          expect(listener).not.toHaveBeenCalledWithMessageEvents(
            expectedMessages
          );
        }).toThrow("Unexpected message sequence");
      });
    }
  );

  describe.each(nonMatchingScenarios)(
    "when expecting $expectedDescription",
    ({ actualMessages, expectedMessages }) => {
      it("should pass", () => {
        const listener = jest.fn();

        actualMessages.forEach(message => {
          listener(new MessageEvent("message", { data: message }));
        });

        expect(listener).not.toHaveBeenCalledWithMessageEvents(
          expectedMessages
        );
      });
    }
  );
});

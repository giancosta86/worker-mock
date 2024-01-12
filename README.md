# worker-mock

_Minimalist Worker mocks in TypeScript_

![GitHub CI](https://github.com/giancosta86/worker-mock/actions/workflows/publish-to-npm.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@giancosta86%2Fworker-mock.svg)](https://badge.fury.io/js/@giancosta86%2Fworker-mock)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

**worker-mock** is a **TypeScript** library working in conjunction with [worker-facade](https://github.com/giancosta86/worker-facade) to easily test `Worker` logic.

![Overview](docs/overview.drawio.svg)

## Installation

The package on NPM is:

> @giancosta86/worker-mock

which should most often be a **dev** dependency.

The public API entirely resides in the root package index, so one shouldn't reference specific modules.

### worker-facade

Since the `WorkerFacade` interface should be referenced by clients in order to be able to plug `WorkerMock` when running tests, you'll most often want to add the [worker-facade](https://github.com/giancosta86/worker-facade) peer library as a **non-dev** dependency:

> @giancosta86/worker-facade

### Matchers

To use the matchers provided by this library, one needs to:

1. Add the following attribute to the object exported by `jest.config.js`:

   ```typescript
   setupFilesAfterEnv: ["@giancosta86/worker-mock/dist/all"],
   ```

1. Add this line to a `global.d.ts` file within the project root directory:

   ```typescript
   import "@giancosta86/worker-mock";
   ```

1. Add `"./global.d.ts"` to the `include` array in `tsconfig.json`

## Usage

### Basics

After installing [worker-facade](https://github.com/giancosta86/worker-facade) as a **non-dev** dependency, you should:

1. Implement the body of the worker as a `RequestListener<TRequest, TResponse>` - a function type provided by `worker-facade`:

   ```typescript
   export const yourRequestListener: RequestListener<TRequest, TResponse> = (
     request,
     sendResponse
   ) => {
     //Here, process the request and
     //call sendResponse() for each message
     //to be sent to the client
   };
   ```

   **Please, note**: this function must **NOT** reside in the worker script - but in a dedicated module instead.

1. In the worker script, just import `RequestListener` and `yourRequestListener`, then add the line:

   ```typescript
   RequestListener.register(self, yourRequestListener);
   ```

1. Every software component that needs to exchange messages with the worker should not depend on `Worker` - but on the `WorkerFacade<TRequest>` interface, which includes just the subset of methods and events dedicated to message passing:

   ```typescript
   function f(worker: WorkerFacade<TRequest>): void {
     //Do some stuff, then send a request,
     //which must be of type TRequest

     worker.postMessage({
       alpha: 90,
       beta: 100
     });
   }
   ```

1. In tests, the `Worker` logic can be plugged into clients by importing `yourRequestListener` and wrapping it into a `WorkerMock`:

   ```typescript
   WorkerMock.create(yourRequestListener);
   ```

   because `WorkerMock` actually implements `WorkerFacade`

### Matchers

**worker-mock** also provides useful extensions to Jest's `expect()`:

- `expect(eventListenerFunction).toHaveBeenCalledWithMessageEvents([array of message objects])`:

  - the argument of `expect()` must be a _mock function_ created via `jest.fn()` and registered via:

    ```typescript
    workerFacade.addListener("message", eventListenerFunction);
    ```

  - the argument of the matcher but be an **array** of message objects - that is, the `data` fields of the `MessageEvent` instances actually received by the listener

  **Please, note**: the arrays of actual and expected messages are compared according to _deep structural equality_ - that is, _by comparing their JSON strings_, so as to support arbitrarily-nested message structures

- `expect(eventListenerFunction).toHaveBeenCalledWithErrorEvents([array of error message strings])`:

  - the argument of `expect()` must be a _mock function_ created via `jest.fn()` and registered via:

    ```typescript
    workerFacade.addListener("error", eventListenerFunction);
    ```

  - the argument of the matcher must be an **array** of error message strings - that is, the `message` fields of the `ErrorEvent` instances actually received by the listener

## Further references

- [worker-facade](https://github.com/giancosta86/worker-facade) - Message-passing TypeScript utilities for Worker

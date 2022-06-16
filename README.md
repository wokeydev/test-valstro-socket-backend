# test-valstro-socket-backend

## Description

As a member of the Valstro Engineering team, interacting with event-driven APIs is a task that comes up often. The purpose of this assessment is to show that you can interact with a simple Websocket API(implemented with Socket.io v4.

## Run docker container

```bash
$ docker run -p 3000:3000 clonardo/socketio-backend
```

## Installation

```bash
$ yarn
```

## Running the app

Make sure you are running socket.io backend before running app.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

Nest is [MIT licensed](LICENSE).

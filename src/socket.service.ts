import { io, Socket } from 'socket.io-client';
import * as prompt from 'prompt';
import { Logger } from '@nestjs/common';

type EventName = 'connect' | 'disconnect' | 'search' | 'error';

interface StarWarResponse {
  page: number;
  resultCount: number;
  name?: string;
  films?: string;
  error?: string;
}

export class SocketService {
  private socket: Socket;
  private promptSchema = {
    properties: {
      keyword: {
        description: 'Input search keyword:',
        required: true,
      },
    },
  };
  private lastSearchedAt: Date = new Date();

  constructor(private readonly logger: Logger) {}

  /**
   * Start listening socket server, prompt
   */
  start() {
    this.socket = io('http://localhost:3000');

    this.listenEvents((eventName) => this.getPrompt(eventName));
  }

  /**
   * Listen socket events emitted from server
   */
  private listenEvents(callback?: (eventName?: EventName) => void) {
    this.socket.on('connect', () => {
      this.logger.debug(`Socket server connected: ${this.socket.id}`);

      // start prompt to input search keyword
      callback();
    });

    this.socket.on('search', (result: StarWarResponse) => {
      // expect next search event is available
      this.printMatchedResult(result);
      this.lastSearchedAt = new Date();

      setTimeout(() => {
        callback('search');
      }, 1100);
    });

    this.socket.on('error', (err) => {
      this.logger.error(err);
      callback();
    });

    this.socket.on('disconnect', (err) => {
      this.logger.debug('Socket server disconnected');
    });
  }

  /**
   * Start, get prompt result and emit search event
   */
  private getPrompt(eventName?: EventName) {
    const now = new Date();
    if (
      eventName === 'search' &&
      now.getTime() - this.lastSearchedAt.getTime() < 1000
    ) {
      return;
    }
    prompt.start();
    prompt.get(this.promptSchema, async (err, result) => {
      const payload = { query: result.keyword };
      this.socket.emit('search', payload);
    });
  }

  private printMatchedResult(result: StarWarResponse) {
    if (result.error) {
      this.logger.error(result.error);
      return;
    }
    this.logger.debug(`${result.name} - ${result.films}`);
  }
}

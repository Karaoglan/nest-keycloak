import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class TurnikeGateway {
  @WebSocketServer()
  server;

  socketClients = [];

  private readonly log = new Logger(TurnikeGateway.name);

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.log.debug(message);
    //this.broadcast('message', message);
    this.sendMessage(message);
  }

  sendMessage(msg: string) {
    console.log('msg from sendM : ' + msg);
    this.server.emit('message', msg);
  }

  sendOpenDoor(msg: string) {
    console.log('msg from sendOpenDoor : ' + msg);
    this.server.emit('door-open', msg);
  }

  handleConnection(client: any, ...args: any[]) {
    this.socketClients.push(client);
    this.log.debug(`Client connected:`);
  }

  handleDisconnect(client) {
    this.log.warn(`Client disconnected:`);
    for (let i = 0; i < this.socketClients.length; i++) {
      if (this.socketClients[i] === client) {
        this.socketClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('disconnect', {});
  }

  private broadcast(event, message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.socketClients) {
      c.send(event, broadCastMessage);
    }
  }
}

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket ,Server} from "socket.io";

@WebSocketGateway(8002, {})
export class NotifacitionReal {


    @WebSocketServer() server: Server;


  @SubscribeMessage('newMessage')
  handleNewMessage(client:Socket, message: any) {
    console.log(message);

     client.emit('reply','This is a reply');

     this.server.emit('reply','broadcasting to all clients');
  }
}


// socket.emit() one client
// io.emit() all clients
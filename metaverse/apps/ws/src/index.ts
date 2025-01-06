import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
    let user: User;
    ws.on('error', console.error);


    console.log('user connected');
    user = new User(ws);
    console.log(user);


    ws.on('close', () => {
        console.log('user disconnected');
        user?.destroy();
    });


    ws.send('something');
});
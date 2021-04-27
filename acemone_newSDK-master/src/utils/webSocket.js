import { Alert } from 'react-native';
//import Toast from 'react-native-simple-toast';




let ws = null;

export function webSocket() {
  if (ws === null || ws.readyState === 3) {
   // const url = apiRoot.replace('http', 'ws') + '/socket/' + uuid;
    //console.log('WEB SOCKET URL', url);
    ws = new WebSocket(url);

    // Opening Web socket
    ws.onopen = () => {
      console.log('WebSocket Open');
    };

    // Message Recieved on WebSocket
    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      console.log('WEBSOCKET_MESSAGE:', message);
      setTimeout(() => {
         if (message.action === 'SHOW NOTIFICATION' && message.key === 'APPROVED NOTIFICTAION') {
          if(message.data && message.data!=='')
          {
            //Toast.show(message.data,Toast.LONG)
          }
         
        }
      }, 1000);
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log('WEB SOCKET CLOSED : ', e.code, e.reason);
    };
  }
}

export function wsClose() {
  if (ws) {
    ws.close();
  }
}

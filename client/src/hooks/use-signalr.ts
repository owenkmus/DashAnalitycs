import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalR = (url: string, eventName: string, callback: (data: any) => void) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [url]);

  useEffect(() => {
    if (connection && connection.state === signalR.HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          console.log('Connected to SignalR Hub');
          connection.on(eventName, callback);
        })
        .catch((err) => console.error('Connection failed: ', err));
    }

    return () => {
      if (connection) {
        connection.off(eventName);
        connection.stop();
      }
    };
  }, [connection, eventName, callback]);

  return connection;
};

import { useEffect, useRef, useState, useCallback } from 'react';


// @ts-ignore
type WebSocketCallback = (data: any) => void;
type WebSocketErrorCallback = (error: Event) => void;

const useWebSocket = (url: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const socketRef = useRef<WebSocket | null>(null);

    // Connect to WebSocket
    const connect = useCallback(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                setMessages((prevMessages) => [...prevMessages, data]);
            } catch (error) {
                setMessages((prevMessages) => [...prevMessages, event.data]);
            }
        };

        socketRef.current.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        };

        socketRef.current.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };
    }, [url]);

    // Send message
    const sendMessage = useCallback((message: any) => {
        console.log('ws ms',message)
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const data = typeof message === 'string' ? message : JSON.stringify(message);

            socketRef.current.send(data);
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    // Close connection
    const closeConnection = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }
    }, []);

    // Reconnect on disconnection
    useEffect(() => {
        if (!isConnected) {
            const timeout = setTimeout(() => {
                connect();
            }, 5000); // Reconnect after 5 seconds
            return () => clearTimeout(timeout);
        }
    }, [isConnected, connect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return {
        isConnected,
        messages,
        sendMessage,
        closeConnection,
    };
};

export default useWebSocket;
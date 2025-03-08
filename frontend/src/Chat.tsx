import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebSocket from './useWebSocket';

const Chat: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const { isConnected, messages, sendMessage } = useWebSocket('ws://localhost:8000/ws');
    const userId = JSON.parse(localStorage.getItem('userId') || '"Guest"');
    const navigate = useNavigate();
    console.log(messages)

    // Redirect to login if userId is not available
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    // Handle sending messages
    const handleSendMessage = () => {

        if (inputText.trim() && isConnected) {
            const message = {
                sender: userId,
                content: inputText,
                timestamp: new Date().toLocaleTimeString(),
            };
            console.log(message)
            sendMessage(message); // Send the message object
            setInputText(''); // Clear the input field
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div
                style={{
                    height: '400px',
                    border: '1px solid #ccc',
                    overflowY: 'auto',
                    marginBottom: '10px',
                    padding: '10px',
                    position: 'relative',
                }}
            >
                {/* Disconnected status */}
                {!isConnected && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#ffebee',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '0.8em',
                        }}
                    >
                        Disconnected
                    </div>
                )}

                {/* Render messages */}
                {messages.map((msg, index) => (

                    <div
                        key={index}
                        style={{
                            margin: '5px 0',
                            textAlign: msg.sender === userId ? 'right' : 'left',
                        }}
                    >
                        <div
                            style={{
                                background: msg.sender === userId ? '#dcf8c6' : '#e3f2fd',
                                padding: '8px',
                                borderRadius: '8px',
                                display: 'inline-block',
                                maxWidth: '80%',
                            }}
                        >
                            <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '4px' }}>
                                {msg.sender} • {msg.timestamp}
                            </div>
                            <div>{msg.content}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input and Send button */}
            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                    disabled={!isConnected}
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: '8px 16px',
                        background: isConnected ? '#031777' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isConnected ? 'pointer' : 'not-allowed',
                    }}
                    disabled={!isConnected}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
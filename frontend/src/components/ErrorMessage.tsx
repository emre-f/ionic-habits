import React, { useState, useEffect, useContext } from "react";
import "../styles/ErrorMessage.css";

interface Message {
  content: string;
  time: number;
}

interface Props {
  children: React.ReactNode;
}

interface ErrorMessageContextType {
  handleMessage: (content: string) => void;
}

const ErrorMessageContext = React.createContext<ErrorMessageContextType>({
  handleMessage: () => { },
});

const ErrorMessage: React.FC<Props> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages
          .map((message) => ({
            ...message,
            time: message.time - 1,
          }))
          .filter((message) => message.time > 0);
        return newMessages;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMessage = (content: string) => {
    if (messages.length > 0) { return; }

    setMessages((prevMessages) => {
      return [...prevMessages, { content, time: 3 }]
    });
  };

  return (
    <ErrorMessageContext.Provider value={{ handleMessage }}>
      <div className="error-message-container">
        {messages.map((message, index) => (

          <div
            key={index}
            className={`error-message ${message.time <= 3 ? "fade-out" : "fade-in"}`}
          >
            {message.content}
          </div>

        ))}
      </div>
      {children}
    </ErrorMessageContext.Provider>
  );
};

export default ErrorMessage;
export const useErrorMessage = () => useContext(ErrorMessageContext);
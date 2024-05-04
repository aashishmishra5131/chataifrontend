import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import your CSS file for styling

function App() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!inputValue.trim()) {
        alert("Please enter something before sending.");
        return;
      }
      const apiUrl = process.env.REACT_APP_BACKEND_API;
      console.log(apiUrl,"apiYrl")
      const response = await axios.post(`${apiUrl}/fetch-data`, {
        message: inputValue,
      });
      setInputValue("");
      //setting message for user
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputValue, type: "user" },
      ]);
      //setting message for bot 
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data, type: "bot" },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat container when new messages are added
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="App">
      <h2>Chat Bot</h2> 
      {/**rendering message according to type */}
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === "bot" ? (
              <div dangerouslySetInnerHTML={{ __html: message.text }} />
            ) : (
              message.text
            )}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          className="input-box"
          value={inputValue}
          onChange={handleChange}
          placeholder="Type your message here"
        />
        {/**calling api */}
        <button className="send-button" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
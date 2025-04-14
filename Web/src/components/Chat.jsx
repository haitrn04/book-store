import React, { useState, useEffect } from "react";
import { FaComment, FaTimes, FaRedo, FaLocationArrow } from "react-icons/fa";
import { BsIncognito } from "react-icons/bs";
import axios from "axios";
import ReactMarkdown from "react-markdown";

let api_url = "http://localhost:1234/";
api_url = "https://fc7e-14-224-129-188.ngrok-free.app/";

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // isChatOpen là giá trị boolean để xác định xem cửa sổ chat có đang mở hay không
  // Nếu isChatOpen là true, cửa sổ chat sẽ hiển thị, ngược lại sẽ ẩn đi.
  // setIsChatOpen là hàm để cập nhật giá trị của isChatOpen
  // Khi người dùng nhấp vào nút chat, isChatOpen sẽ được đặt thành true, và cửa sổ chat sẽ mở ra.
  const [isAnonymousChat, setIsAnonymousChat] = useState(false);
  // isAnonymousChat là giá trị boolean để xác định xem người dùng có muốn chat ẩn danh hay không
  // Nếu isAnonymousChat là true, người dùng sẽ chat ẩn danh, ngược lại sẽ không
  // setIsAnonymousChat là hàm để cập nhật giá trị của isAnonymousChat
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [clicked, setClicked] = useState(false); // State để theo dõi click

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Mình là trợ lý bán sách. Mình có thể giúp gì cho bạn hôm nay?",
      sender: "bot",
    },
  ]);
  // messages là một mảng chứa các tin nhắn trong cuộc hội thoại
  // Mỗi tin nhắn là một đối tượng với các thuộc tính id, text và sender
  // setMessages là hàm để cập nhật giá trị của messages

  const [newMessage, setNewMessage] = useState("");
  // newMessage là giá trị của ô nhập tin nhắn
  // Khi người dùng nhập tin nhắn vào ô nhập, giá trị của newMessage sẽ được cập nhật
  // setNewMessage là hàm để cập nhật giá trị của newMessage

  const [isLoading, setIsLoading] = useState(false);
  // isLoading là giá trị boolean để xác định xem có đang xử lý yêu cầu hay không
  // Nếu isLoading là true, có nghĩa là đang chờ phản hồi từ API


  // Thông tin cửa hàng
  const storeAddress = "136 Đ. Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội";
  const storePhoneNumber = "024 3754 7823";

  // Danh sách câu hỏi gợi ý (liên quan đến bán sách)
  const suggestedQuestions = [
    "Có sách nào về lập trình không?",
    "Giá sách 'Harry Potter' là bao nhiêu?",
    "Cửa hàng có giao hàng tận nơi không?",
    "Sách 'Dune' có sẵn không?",
    "Có chương trình giảm giá nào không?",
    "Làm sao để đặt sách trước?",
    "Sách tiếng Anh có nhiều không?",
    "Cửa hàng mở cửa đến mấy giờ?",
  ];

  const demo_sQ = [
    "Cửa hàng có giao hàng tận nơi không?",
    "Sách tiếng Anh có nhiều không?",
    "Cửa hàng mở cửa đến mấy giờ?",
  ];

  // useEffect này sẽ được gọi khi component được render lần đầu tiên
  // và khi giá trị của clicked hoặc suggestedQuestions thay đổi
  useEffect(() => {
    if (clicked && suggestedQuestions && suggestedQuestions.length > 0) {
      const shuffled = [...suggestedQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setRandomQuestions(shuffled.slice(0, 3));
      setClicked(false); // Reset clicked sau khi random
    }
  }, [clicked, suggestedQuestions]);

  // Hàm này sẽ được gọi khi người dùng nhấp vào câu hỏi gợi ý
  const handleQuestionClick = (question) => {
    handleSuggestedQuestionClick(question);
    setClicked(true); // Đánh dấu là đã click
  };

  // Hàm này sẽ xóa tất cả các tin nhắn trong cuộc hội thoại và đặt lại trạng thái ban đầu
  const restartChat = () => {
    setMessages([
      {
        id: 1,
        text: "Xin chào! Mình là trợ lý bán sách. Mình có thể giúp gì cho bạn hôm nay?",
        sender: "bot",
      },
    ]);
    setNewMessage("");
    setIsLoading(false);
    // Đặt lại trạng thái của các biến liên quan đến cuộc hội thoại về giá trị ban đầu
  };

  // Hàm gửi tin nhắn đến backend và nhận phản hồi từ Gemini API
  const sendMessageToGemini = async (messageText) => {
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const lowerCaseMessage = messageText.toLowerCase();

    // 👉 Truy vấn thông tin sách từ backend (PostgreSQL)
    let dbInfo = "";
    try {
      const res = await fetch(`http://localhost:3005/api/book-info?message=${encodeURIComponent(messageText)}`);
      const data = await res.json();
      if (data.success) {
        dbInfo = data.dbInfo;
      }
    } catch (err) {
      console.warn("Không lấy được dữ liệu từ DB:", err);
    }

    // 👉 Tạo lịch sử hội thoại
    const chatHistory = messages.map(msg =>
      `${msg.sender === "user" ? "Người dùng" : "Bot"}: ${msg.text}`
    ).join("\n");

    // 👉 Prompt chính
    let prompt = `
      Bạn là một trợ lý bán sách thông minh, nhiệt tình và trung thực cho cửa hàng sách tại ${storeAddress}. 
      Số điện thoại liên hệ: ${storePhoneNumber}.
      Cửa hàng chuyên bán các loại sách: tiểu thuyết, sách kỹ thuật, sách tiếng Anh, sách thiếu nhi, v.v.
      Chính sách giao hàng: Giao hàng tận nơi trong TP. Hồ Chí Minh với phí 20.000 VNĐ, miễn phí cho đơn từ 500.000 VNĐ.
      Chương trình giảm giá: Giảm 10% cho đơn hàng đầu tiên, giảm 20% cho sách thiếu nhi vào cuối tuần.
      Giờ mở cửa: 8:00 - 20:00 hàng ngày.
      
      Dưới đây là dữ liệu sách từ hệ thống (nếu có):${dbInfo}
      Bạn có thể giới thiệu 1 số sách trong cửa hàng cho người dùng nếu có liên quan đến câu hỏi của họ.
      Câu hỏi của người dùng: ${messageText}
      
      Không trả lời các nội dung không liên quan đến sách hoặc cửa hàng.
      Câu trả lời của bạn không nên chứa bất kỳ nội dung gây hại, phân biệt chủng tộc, phân biệt giới tính, độc hại, nguy hiểm hoặc bất hợp pháp nào. 
      Hãy đảm bảo rằng các câu trả lời của bạn không có thiên kiến xã hội và mang tính tích cực. 
      Nếu một câu hỏi không có ý nghĩa hoặc không hợp lý về mặt thông tin, hãy giải thích tại sao thay vì trả lời một điều gì đó không chính xác. 
      Nếu bạn không biết câu trả lời cho một câu hỏi, hãy trả lời là bạn không biết và vui lòng không chia sẻ thông tin sai lệch.
      Hãy trả lời chính xác, ngắn gọn, thân thiện, và sử dụng dữ liệu bên trên nếu liên quan.
      Sử dụng định dạng Markdown để làm nổi bật thông tin như **in đậm**, *in nghiêng*, hoặc danh sách.
    `;

    // 👉 Nếu là câu hỏi đặc biệt
    if (lowerCaseMessage.includes("địa chỉ")) {
      prompt = `Người dùng hỏi về địa chỉ của cửa hàng. Địa chỉ là: ${storeAddress}.`;
    } else if (lowerCaseMessage.includes("số điện thoại")) {
      prompt = `Người dùng hỏi về số điện thoại của cửa hàng. Số điện thoại là: ${storePhoneNumber}.`;
    }

    try {
      const response = await axios.post("http://localhost:3005/api/gemini", {
        prompt: prompt,
      });

      const botResponseText = response.data.candidates[0].content.parts[0].text;

      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Lỗi khi gọi Gemini API:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  // Hàm gửi tin nhắn đến backend và nhận phản hồi từ LM Studio localchat API
  const sendMessageToLocalDBChat = async (messageText) => {
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const lowerCaseMessage = messageText.toLowerCase();
    let dbInfo = "";

    // 🔍 Gọi backend để lấy dữ liệu liên quan từ PostgreSQL
    try {
      const res = await fetch(`http://localhost:3005/api/book-info?message=${encodeURIComponent(messageText)}`);
      const data = await res.json();
      if (data.success) {
        dbInfo = data.dbInfo;
      }
    } catch (err) {
      console.warn("Không thể truy cập thông tin sách từ DB:", err);
    }

    // 🧠 Tạo prompt hoàn chỉnh
    let prompt = `
      Bạn là một trợ lý bán sách thông minh, nhiệt tình và trung thực cho cửa hàng sách tại ${storeAddress}. 
      Số điện thoại liên hệ: ${storePhoneNumber}.
      Cửa hàng chuyên bán các loại sách: tiểu thuyết, sách kỹ thuật, sách tiếng Anh, sách thiếu nhi, v.v.
      Chính sách giao hàng: Giao hàng tận nơi trong TP. Hồ Chí Minh với phí 20.000 VNĐ, miễn phí cho đơn từ 500.000 VNĐ.
      Chương trình giảm giá: Giảm 10% cho đơn hàng đầu tiên, giảm 20% cho sách thiếu nhi vào cuối tuần.
      Giờ mở cửa: 8:00 - 20:00 hàng ngày.
      
      Dưới đây là dữ liệu sách từ hệ thống (nếu có):${dbInfo}
      Bạn có thể giới thiệu 1 số sách trong cửa hàng cho người dùng nếu có liên quan đến câu hỏi của họ.
      Câu hỏi của người dùng: ${messageText}
      
      Không trả lời các nội dung không liên quan đến sách hoặc cửa hàng.
      Câu trả lời của bạn không nên chứa bất kỳ nội dung gây hại, phân biệt chủng tộc, phân biệt giới tính, độc hại, nguy hiểm hoặc bất hợp pháp nào. 
      Hãy đảm bảo rằng các câu trả lời của bạn không có thiên kiến xã hội và mang tính tích cực. 
      Nếu một câu hỏi không có ý nghĩa hoặc không hợp lý về mặt thông tin, hãy giải thích tại sao thay vì trả lời một điều gì đó không chính xác. 
      Nếu bạn không biết câu trả lời cho một câu hỏi, hãy trả lời là bạn không biết và vui lòng không chia sẻ thông tin sai lệch.
      Hãy trả lời chính xác, ngắn gọn, thân thiện, và sử dụng dữ liệu bên trên nếu liên quan.
      Sử dụng định dạng Markdown để làm nổi bật thông tin như **in đậm**, *in nghiêng*, hoặc danh sách.
    `;

    // 📌 Xử lý các câu hỏi đặc biệt
    if (lowerCaseMessage.includes("địa chỉ")) {
      prompt = `Người dùng hỏi về địa chỉ của cửa hàng. Địa chỉ là: ${storeAddress}.`;
    } else if (lowerCaseMessage.includes("số điện thoại")) {
      prompt = `Người dùng hỏi về số điện thoại của cửa hàng. Số điện thoại là: ${storePhoneNumber}.`;
    }

    const payload = {
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: messageText },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
      model: "gemma-3-4b-it", // "gemma-3-4b-it", "gemma-3-1b-it", "llama-3.2-3b-instruct"
    };

    try {
      const response = await fetch(`${api_url}v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(payload),
      });

      if (!response.body) throw new Error("Không thể kết nối stream.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botText = "";
      const botMessageId = messages.length + 2;

      setMessages((prev) => [
        ...prev,
        { id: botMessageId, text: "Đang xử lý...", sender: "bot" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true }).split("data: ");
        for (let part of chunk) {
          part = part.trim();
          if (!part || part === "[DONE]") continue;

          try {
            const json = JSON.parse(part);
            const delta = json.choices?.[0]?.delta?.content || "";
            if (delta) {
              botText += delta;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId ? { ...msg, text: botText } : msg
                )
              );
            }
          } catch (err) {
            console.warn("Không parse được dòng:", part);
          }
        }
      }
    } catch (err) {
      console.error("Streaming lỗi:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "Đã có lỗi xảy ra với LM Studio. Vui lòng thử lại sau!",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // e.preventDefault() ngăn chặn hành vi mặc định của form khi gửi tin nhắn
    // Để tránh việc trang web tự động tải lại khi gửi form
    if (newMessage.trim() === "") return;
    // Nếu ô nhập tin nhắn rỗng, không làm gì cả
    if (isAnonymousChat) {
      await sendMessageToLocalDBChat(newMessage);
    } else {
      await sendMessageToGemini(newMessage);
    }

    // Gọi hàm sendMessageToGemini để gửi tin nhắn đến API và nhận phản hồi từ Gemini API
    // Sau khi gửi tin nhắn, chúng ta sẽ gọi hàm sendMessageToGemini để gửi tin nhắn đến API và nhận phản hồi từ Gemini API
  };

  // Xử lý khi người dùng nhấp vào câu hỏi gợi ý
  const handleSuggestedQuestionClick = async (question) => {
    if (isAnonymousChat) {
      await sendMessageToLocalDBChat(question);
    } else {
      await sendMessageToGemini(question);
    }
    // Khi người dùng nhấp vào câu hỏi gợi ý, chúng ta sẽ gọi hàm sendMessageToGemini với câu hỏi gợi ý đó
  };

  // Kiểm tra tin nhắn cuối cùng có phải là của bot không
  const lastMessage = messages[messages.length - 1];
  const showSuggestions = lastMessage?.sender === "bot" && !isLoading;
  // Mục đích để hiển thị các câu hỏi gợi ý ở dưới các câu trả lời của bot

  return (
    <>
      {/* Nút Chat (Biểu tượng nổi) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px rgba(0, 123, 255, 0.5), 0 0 20px rgba(0, 123, 255, 0.3)", // Shadow màu viền
            cursor: "pointer",
            zIndex: 1000,
            transition: "all 0.3s ease",
            animation: "bounce 2s infinite", // Thêm hiệu ứng rung
          }}

        >
          <FaComment size={34} />
          {/* CSS Animation */}
          <style>
            {`
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-15px);
                }
                60% {
                  transform: translateY(-10px);
                }
              }

              @keyframes pulse {
                0% {
                  transform: scale(1);
                }
                50% {
                  transform: scale(0.9);
                }
                100% {
                  transform: scale(1.1);
                }
              }

              @keyframes rotateIcon {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </button>
      )}

      {/* Cửa sổ Chat thường*/}
      {!isAnonymousChat && isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "370px",
            height: "500px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          {/* Tiêu đề cửa sổ Chat */}
          <div
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 style={{ margin: 0 }}>Cửa hàng sách iu đời (^_^) </h5>
            <button
              // anonymous chat
              onClick={() => { setIsAnonymousChat(true); restartChat(); }}
              style={{
                background: "none",
                border: "none",
                color: "purple",
                cursor: "pointer",
                marginLeft: "45px",
              }}
            >
              <BsIncognito />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn và câu hỏi gợi ý */}
          <div
            className="chat-area"
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor:
                      message.sender === "user" ? "#007bff" : "#e0e0e0",
                    color: message.sender === "user" ? "white" : "black",
                  }}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  {/* Sử dụng ReactMarkdown để hiển thị nội dung Markdown */}
                  {/* Nội dung tin nhắn sẽ được hiển thị dưới dạng Markdown, giúp làm nổi bật các phần quan trọng như in đậm, in nghiêng, danh sách, v.v. */}
                </div>
              </div>
            ))}

            {/* Hiển thị trạng thái "Đang xử lý..." */}
            {isLoading && (
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor: "#e0e0e0",
                    color: "black",
                  }}
                >
                  Đang xử lý...
                </div>
              </div>
            )}

            {/* Hiển thị câu hỏi gợi ý sau câu trả lời cuối cùng của bot */}
            {showSuggestions && (
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {randomQuestions.length > 0
                  ? randomQuestions.map((question, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      style={{
                        backgroundColor: '#e6f0fa',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        color: '#2c3e50',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid #dfe6e9',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e6f0fa';
                        e.target.style.color = '#2c3e50';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {question}
                    </div>
                  ))
                  : demo_sQ.map((question, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      style={{
                        backgroundColor: '#e6f0fa',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        color: '#2c3e50',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid #dfe6e9',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e6f0fa';
                        e.target.style.color = '#2c3e50';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {question}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Ô nhập tin nhắn */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <button
              type="button"
              onClick={restartChat}
              className="restart-button"
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                marginLeft: "0px",
                marginRight: "10px",
              }}
            >
              <FaRedo />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginRight: "10px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              <FaLocationArrow />
            </button>
          </form>
        </div>
      )}

      {/* Cửa sổ Chat ẩn danh localchat*/}
      {isAnonymousChat && isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "370px",
            height: "500px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          {/* Tiêu đề cửa sổ Chat */}
          <div
            style={{
              backgroundColor: "purple",
              color: "white",
              padding: "10px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 style={{ margin: 0 }}>Cửa hàng sách chán đời (∨_∨) </h5>
            <button
              // anonymous chat
              onClick={() => { setIsAnonymousChat(false); restartChat(); }}
              style={{
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <BsIncognito />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              <FaTimes />
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn và câu hỏi gợi ý */}
          <div
            className="chat-area"
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent:
                    message.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor:
                      message.sender === "user" ? "purple" : "#e0e0e0",
                    color: message.sender === "user" ? "white" : "black",
                  }}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  {/* Sử dụng ReactMarkdown để hiển thị nội dung Markdown */}
                  {/* Nội dung tin nhắn sẽ được hiển thị dưới dạng Markdown, giúp làm nổi bật các phần quan trọng như in đậm, in nghiêng, danh sách, v.v. */}
                </div>
              </div>
            ))}

            {/* Hiển thị câu hỏi gợi ý sau câu trả lời cuối cùng của bot */}
            {showSuggestions && (
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {randomQuestions.length > 0
                  ? randomQuestions.map((question, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      style={{
                        backgroundColor: '#e6f0fa',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        color: '#2c3e50',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid #dfe6e9',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'purple';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e6f0fa';
                        e.target.style.color = '#2c3e50';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {question}
                    </div>
                  ))
                  : demo_sQ.map((question, index) => (
                    <div
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      style={{
                        backgroundColor: '#e6f0fa',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        color: '#2c3e50',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid #dfe6e9',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'purple';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#e6f0fa';
                        e.target.style.color = '#2c3e50';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      {question}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Ô nhập tin nhắn */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <button
              type="button"
              onClick={restartChat}
              className="restart-button"
              style={{
                background: "none",
                border: "none",
                color: "purple",
                cursor: "pointer",
                marginLeft: "0px",
                marginRight: "10px",
              }}
            >
              <FaRedo />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginRight: "10px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "purple",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              <FaLocationArrow />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
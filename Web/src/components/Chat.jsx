import React, { useState, useEffect } from "react";
import { FaComment, FaTimes } from "react-icons/fa";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false); 
  // isChatOpen là giá trị boolean để xác định xem cửa sổ chat có đang mở hay không
  // Nếu isChatOpen là true, cửa sổ chat sẽ hiển thị, ngược lại sẽ ẩn đi.
  // setIsChatOpen là hàm để cập nhật giá trị của isChatOpen
  // Khi người dùng nhấp vào nút chat, isChatOpen sẽ được đặt thành true, và cửa sổ chat sẽ mở ra.

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

  // Hàm gửi tin nhắn đến backend và nhận phản hồi từ Gemini API
  const sendMessageToGemini = async (messageText) => {
    // Thêm tin nhắn của người dùng vào state
    const userMessage = {
      id: messages.length + 1,
      text: messageText,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // Khi người dùng gửi tin nhắn, hàm này sẽ được gọi để gửi tin nhắn đến API và nhận phản hồi từ Gemini API
    // Trong hàm này, chúng ta sẽ thêm tin nhắn của người dùng vào state messages
    // và sau đó gọi hàm gửi tin nhắn đến API
    // Đặt trạng thái đang xử lý
    setIsLoading(true);

    // Tạo prompt với ngữ cảnh và thông tin cửa hàng
    const chatHistory = messages.map(msg => `${msg.sender === "user" ? "Người dùng" : "Bot"}: ${msg.text}`).join("\n");
    // Tạo lịch sử hội thoại để gửi đến API
    // Lịch sử hội thoại sẽ bao gồm tất cả các tin nhắn trước đó trong cuộc hội thoại
    // và sẽ được sử dụng để tạo ngữ cảnh cho phản hồi của bot
    // Lịch sử hội thoại sẽ được định dạng theo kiểu "Người dùng: Tin nhắn" hoặc "Bot: Tin nhắn"
    // để dễ dàng phân biệt giữa tin nhắn của người dùng và phản hồi của bot
    // Chúng ta sẽ sử dụng hàm map để duyệt qua từng tin nhắn trong mảng messages


    const lowerCaseMessage = messageText.toLowerCase();


    let prompt = `
      Bạn là một trợ lý bán sách thông minh cho cửa hàng sách tại ${storeAddress}.
      Số điện thoại liên hệ: ${storePhoneNumber}.
      Cửa hàng chuyên bán các loại sách: tiểu thuyết, sách kỹ thuật, sách tiếng Anh, sách thiếu nhi, v.v.
      Chính sách giao hàng: Giao hàng tận nơi trong TP. Hồ Chí Minh với phí 20.000 VNĐ, miễn phí cho đơn từ 500.000 VNĐ.
      Chương trình giảm giá: Giảm 10% cho đơn hàng đầu tiên, giảm 20% cho sách thiếu nhi vào cuối tuần.
      Giờ mở cửa: 8:00 - 20:00 hàng ngày.

      Lịch sử hội thoại:
      ${chatHistory}

      Câu hỏi của người dùng: ${messageText}

      Hãy trả lời ngắn gọn, thân thiện, đúng trọng tâm, và sử dụng thông tin trên nếu cần.
      Sử dụng định dạng Markdown để làm nổi bật thông tin quan trọng (ví dụ: **in đậm**, *in nghiêng*, - danh sách).
    `;
    // training data cho Gemini API
    // Trong prompt, chúng ta sẽ cung cấp thông tin về cửa hàng sách, số điện thoại, chính sách giao hàng, chương trình giảm giá và giờ mở cửa
    // Tạo prompt với ngữ cảnh và thông tin cửa hàng
    // Trong prompt, chúng ta sẽ cung cấp thông tin về cửa hàng sách, số điện thoại, chính sách giao hàng, chương trình giảm giá và giờ mở cửa
    // Sau đó, chúng ta sẽ thêm lịch sử hội thoại vào prompt để tạo ngữ cảnh cho phản hồi của bot


  

    // Kiểm tra nếu người dùng hỏi về địa chỉ hoặc số điện thoại
    if (lowerCaseMessage.includes("địa chỉ")) {
      prompt = `
        Người dùng hỏi về địa chỉ của cửa hàng. Địa chỉ là: ${storeAddress}.
        Hãy trả lời một cách tự nhiên và thông minh.
        Sử dụng định dạng Markdown để làm nổi bật thông tin quan trọng.
      `;
    }
    // Nếu người dùng hỏi về địa chỉ của cửa hàng, chúng ta sẽ tạo một prompt mới chỉ với thông tin địa chỉ
    // lowerCaseMessage.includes là một hàm kiểm tra xem chuỗi messageText có chứa từ "địa chỉ" hay không
    // Nếu có, chúng ta sẽ tạo một prompt mới chỉ với thông tin địa chỉ 

    else if (lowerCaseMessage.includes("số điện thoại")) {
      prompt = `
        Người dùng hỏi về số điện thoại của cửa hàng. Số điện thoại là: ${storePhoneNumber}.
        Hãy trả lời một cách tự nhiên và thông minh.
        Sử dụng định dạng Markdown để làm nổi bật thông tin quan trọng.
      `;
    }

    try {
      // Gửi tin nhắn đến backend (endpoint /api/gemini)
      const response = await axios.post("http://localhost:3005/api/gemini", {
        prompt: prompt,
      });

      // Lấy phản hồi từ Gemini API
      const botResponseText = response.data.candidates[0].content.parts[0].text;
      // Lấy phản hồi từ Gemini API
      // response.data.candidates[0].content.parts[0].text là nơi chứa phản hồi của bot
      // Chúng ta sẽ lấy phản hồi đầu tiên trong danh sách candidates
      // và lấy phần text đầu tiên trong nội dung của phản hồi đó
      // Đoạn mã này sẽ lấy phản hồi từ Gemini API và lưu vào biến botResponseText

      // Thêm phản hồi của bot vào state
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
    // Cuối cùng, chúng ta sẽ cập nhật trạng thái isLoading về false
    // và xóa nội dung ô nhập tin nhắn bằng cách đặt newMessage về chuỗi rỗng
    // finally là một khối mã sẽ luôn được thực thi, bất kể có lỗi hay không
  };

  // Xử lý khi người dùng gửi tin nhắn từ ô nhập
  const handleSendMessage = async (e) => {
    e.preventDefault();
    // e.preventDefault() ngăn chặn hành vi mặc định của form khi gửi tin nhắn
    // Để tránh việc trang web tự động tải lại khi gửi form
    if (newMessage.trim() === "") return;
    // Nếu ô nhập tin nhắn rỗng, không làm gì cả
    await sendMessageToGemini(newMessage);
    // Gọi hàm sendMessageToGemini để gửi tin nhắn đến API và nhận phản hồi từ Gemini API
    // Sau khi gửi tin nhắn, chúng ta sẽ gọi hàm sendMessageToGemini để gửi tin nhắn đến API và nhận phản hồi từ Gemini API
  };

  // Xử lý khi người dùng nhấp vào câu hỏi gợi ý
  const handleSuggestedQuestionClick = async (question) => {
    await sendMessageToGemini(question);
    // Khi người dùng nhấp vào câu hỏi gợi ý, chúng ta sẽ gọi hàm sendMessageToGemini với câu hỏi gợi ý đó
  };

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    const chatArea = document.querySelector(".chat-area");
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [messages]);

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

      {/* Cửa sổ Chat */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
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

          {/* Thông tin cửa hàng */}
          <div
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderBottom: "1px solid #ddd",
              fontSize: "12px",
              color: "#333",
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Địa chỉ:</strong> {storeAddress}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Số điện thoại:</strong> {storePhoneNumber}
            </p>
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
                {suggestedQuestions.map((question, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestedQuestionClick(question)}
                    style={{
                      backgroundColor: "#e6f0fa",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      color: "#2c3e50",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: "1px solid #dfe6e9",
                      whiteSpace: "nowrap",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#007bff";
                      e.target.style.color = "white";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    // Thay đổi màu sắc và kích thước khi hover

                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#e6f0fa";
                      e.target.style.color = "#2c3e50";
                      e.target.style.transform = "scale(1)";
                    }}
                    // Trở về màu sắc và kích thước ban đầu khi không hover
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
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chat;
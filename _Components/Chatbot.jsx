import React, { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import ChatCard from "../_Components/ChatCard";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});
const Chatbot = ({ setEventForm, setShowEventForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threadID, setThreadID] = useState("");
  const [assistantID, setAssistantID] = useState("");
  const [runID, setRunID] = useState("");

  const [messages, setMessages] = useState([
    // { id: 1, sender: "AI", content: "Hi, how can I help you today?" },
    // { id: 2, sender: "You", content: "fewafef" },
    // {
    //   id: 3,
    //   sender: "AI",
    //   content:
    //     "Sorry, I couldn’t find any information in the documentation about that.",
    // },
    // { id: 1, sender: "AI", content: "Hi, how can I help you today?" },
    // { id: 2, sender: "You", content: "fewafef" },
    // {
    //   id: 3,
    //   sender: "AI",
    //   content:
    //     "Sorry, I couldn’t find any information in the documentation about that.",
    // },
    // { id: 1, sender: "AI", content: "Hi, how can I help you today?" },
    // { id: 2, sender: "You", content: "fewafef" },
    // {
    //   id: 3,
    //   sender: "AI",
    //   content:
    //     "Sorry, I couldn’t find any information in the documentation about that.",
    // },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [msgsLoading, setMsgsLoading] = useState(true);
  const [sentMessageProcessed, setSentMessageProcessed] = useState(true);

  const divRef = useRef(null);
  const [currentGoal, setCurrentGoal] = useState({
    Descr: "I want to win",
    Due: "2024-05-31",
    Image: "",
    Reward: null,
    Title: "Soccer Community",
    assistantID: "asst_EiHgeiLbxcs1r1855lryoIe8",
    dateCreated: "March 25, 2024 at 5:28:52 PM UTC+2",
    runID: "run_GuV63F5sRM7OOAFTnZqhOtU3",
    threadID: "thread_Fs2VYok9YAiXZ1qHv5TpDeIZ",
    userID: "tshepo@gmail.com",
  });

  const [pause, setPause] = useState(true);
  const intervalRef = useRef(null); // To store the interval ID

  useEffect(() => {
    console.log("Interval codde....");
    // Start the interval if not paused
    if (!pause) {
      //   intervalRef.current = setInterval(() => {
      //     checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
      //     //setCount((prevCount) => prevCount + 1); // Example: increment the count
      //   }, 1000);
    }

    // Cleanup: clear interval on component unmount or when isPaused changes
    return () => clearInterval(intervalRef.current);
  }, [pause]); // Only run this effect when `isPaused` changes

  // Function to toggle pause/resume
  const togglePause = () => {
    setPause((prevState) => !prevState); // Toggle paused state
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const sendMessageHandler = async () => {
    console.log("sendMessageHandler");
    setLoading(true);
    sendMsgOpenAi();
    scrollToBottom();
  };

  const handleMessageSend = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", content: [{ text: { value: newMessage } }] },
      { sender: "AI", content: [] },
    ]);

    let threadID = "thread_Fs2VYok9YAiXZ1qHv5TpDeIZ";
    let runID = "run_GuV63F5sRM7OOAFTnZqhOtU3";
    let assistantID = "asst_EiHgeiLbxcs1r1855lryoIe8";
    let instructions = `You are an assistant designed to help 
      recommend new events for the Soccer Community. Your primary task is to 
      recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
       to ensure the event's success: Predicted Attendance, Optimal Timing,
       location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
        please respond in a json format ONLY (no other text, only JSON)
         with fields name, description, predicted_attendance, optimal_timing, 
         start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
          an event or just answering a question you can respond normally (NO JSON, JUST TEXT)`;

    try {
      const res = await axios.post(
        "http://localhost:8080/sendMessage",
        { newMessage, threadID, runID, assistantID, instructions },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Returned Messages: ", res.data.messages);
      //setMessages(res.data.messages);
      setMessages([...res.data.messages]); // Ensure this is a new array
      setNewMessage("");
      console.log("New Messages Refreshed");
    } catch (error) {
      console.log(error);
    }
  };

  const sendMoreReccMsg = async () => {
    console.log("sendMessageHandler");
    setLoading(true);
    console.log("Sending message");
    setSentMessageProcessed(false);

    const message = await openai.beta.threads.messages.create(
      currentGoal.threadID,
      {
        role: "user",
        content: "Another one",
      }
    );

    console.log(message);

    const run = await openai.beta.threads.runs.create(currentGoal.threadID, {
      // assistant_id: "asst_TuuWO4MxdsPJPgmdgLkXyeUN",asst_L1rmvjtYlVbgGWk89a53CmP3
      assistant_id: currentGoal.assistantID,
      instructions: `You are an assistant designed to help 
      recommend new events for the Soccer Community. Your primary task is to 
      recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
       to ensure the event's success: Predicted Attendance, Optimal Timing,
       location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
        please respond in a json format ONLY (no other text, only JSON)
         with fields name, description, predicted_attendance, optimal_timing, 
         start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
          an event or just answering a question you can respond normally (NO JSON, JUST TEXT)`,
    });
    //console.log(`run id : ${run.id}`);
    //console.log(run);

    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);

    setNewMessage("");
    setSentMessageProcessed(true);

    scrollToBottom();
  };
  const sendMsgOpenAi = async () => {
    console.log("Sending message");
    setSentMessageProcessed(false);

    const message = await openai.beta.threads.messages.create(
      currentGoal.threadID,
      {
        role: "user",
        content: newMessage,
      }
    );

    console.log(message);

    const run = await openai.beta.threads.runs.create(currentGoal.threadID, {
      // assistant_id: "asst_TuuWO4MxdsPJPgmdgLkXyeUN",asst_L1rmvjtYlVbgGWk89a53CmP3
      assistant_id: currentGoal.assistantID,
      instructions: `You are an assistant designed to help 
      recommend new events for the Soccer Community. Your primary task is to 
      recommend one event (ONLY JSON, NO EXPLANATION OR TEXT) .Provide the following details
       to ensure the event's success: Predicted Attendance, Optimal Timing,
       location suitability, start_date (TIMESTAMP SECONDS PLZ) and end_date (TIMESTAMP SECONDS PLZ). If you're recommending an event 
        please respond in a json format ONLY (no other text, only JSON)
         with fields name, description, predicted_attendance, optimal_timing, 
         start_date,end_date  and location. No matter What, Respond with one event at a time. If you not recommending
          an event or just answering a question you can respond normally (NO JSON, JUST TEXT)`,
    });
    //console.log(`run id : ${run.id}`);
    //console.log(run);

    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);

    setNewMessage("");
    setSentMessageProcessed(true);
  };

  const waitForCompletion = async (threadId, runId) => {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    console.log(`current run status - ${runStatus.status}`);
    while (runStatus.status !== "completed") {
      console.log("The status is :", runStatus.status);
      await delay(4000); // Wait for 1.5 seconds before checking again
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }
    console.log("run status - completed");
    return runStatus;
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    console.log("Messages have changed.");
    console.log(messages);
    scrollToBottom();
  }, [messages]);

  const calculateRows = (text) => {
    const newLines = (text.match(/\n/g) || []).length + 1;
    const rows = Math.min(5, newLines + 1); // Limit to 5 rows
    return rows;
  };

  const checkStatusAndPrintMessages = async (threadId, runId) => {
    console.log("checkStatusAndPrintMessages() starting...");
    await waitForCompletion(threadId, runId);

    let messages;

    messages = await openai.beta.threads.messages.list(threadId);
    let msgList = messages.data;
    console.log(msgList);
    const updatedMsgList = msgList.map((msg) => {
      return {
        ...msg, // Copy existing fields
        sender: msg.role === "user" ? "You" : "AI", // Add "sender" field
      };
    });
    updatedMsgList.sort((a, b) => a.created_at - b.created_at);
    setMessages([...updatedMsgList]); // Ensure a new array is created
    // If you want the messages in reverse chronological order, just sort them as such.

    console.log("Checking the MSG List");
    if (updatedMsgList.length > 0) {
      console.log("Message List length is > 0 : ", updatedMsgList.length);
      const lastMessage = updatedMsgList[msgList.length - 1];

      // Add the "sender" field based on the "role"
      // Add the "sender" field based on the "role"

      if (lastMessage.role === "assistant" || true) {
        setMessages([...updatedMsgList]); // Ensure a new array is created
        console.log("setMessages is updated.");
        console.log("Last Message Belongs to Assistant : ", lastMessage);

        msgList.forEach((msg) => {
          const role = msg.role;
          const content =
            msg.content[0] && msg.content[0].text
              ? msg.content[0].text.value
              : "Content missing";
          console.log(
            `${role.charAt(0).toUpperCase() + role.slice(1)}: ${content}`
          );

          if (!msg.content[0]) {
            console.log(
              "******************************************************************"
            );
            console.log("A message is missing");
            console.log(
              "******************************************************************"
            );
            checkStatusAndPrintMessages(
              currentGoal.threadID,
              currentGoal.runID
            );
          }
          console.log(content.slice(7, -3));
          console.log("\n");
        });

        console.log("Sent message processed...");

        setMsgsLoading(false);
        return; // Exit the function as the assistant has responded
      }
    }

    setMsgsLoading(false); // Ensure loading is set to false to prevent infinite loading state
  };

  useEffect(() => {
    console.log("Chatbot just rendered");
    //localStorageChecker();
    checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
    scrollToBottom();
  }, []);
  const handleToggle = () => {
    setIsOpen(!isOpen);

    scrollToBottom();
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "You", content: inputValue },
      ]);
      setInputValue("");
    }
  };

  const localStorageChecker = async () => {
    if (
      localStorage.getItem("ThreadID") &&
      localStorage.getItem("AssistantID") &&
      localStorage.getItem("RunID")
    ) {
      //check if run status is expired or not
      let runStatus = await openai.beta.threads.runs.retrieve(
        currentGoal.threadID,
        currentGoal.runID
      );

      if (runStatus.status == "expired") {
        createNewAssistant();
      } else {
        setThreadID(localStorage.getItem("ThreadID"));
        setAssistantID(localStorage.getItem("AssistantID"));
        setRunID(localStorage.getItem("RunID"));
        console.log("local storage checker passed");
        checkStatusAndPrintMessages(currentGoal.threadID, currentGoal.runID);
      }
    } else {
      createNewAssistant();
    }
  };

  const createNewAssistant = () => {
    console.log("Creating New Assistant");
  };

  const handleMore = () => {
    // setNewMessage("recommend another event.");
    // sendMessageHandler();

    // sendMoreReccMsg();
    sendMoreReccMsg();
  };

  return (
    <>
      {/* Button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-openbox-green hover:bg-openbox-green m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path
            d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"
            className="border-gray-200"
          ></path>
        </svg>
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div
          style={{
            boxShadow: "0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)",
          }}
          className="  fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px]"
        >
          {/* Heading */}
          <div
            style={{ zIndex: 99 }}
            className="bg-white fixed z-100 border-b-2 w-[240px] border-black p-2 flex flex-col space-y-1.5 pb-6"
          >
            <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
            <p className="text-sm text-[#6b7280] leading-3">Soccer Community</p>
          </div>

          {/* Chat Container */}
          <div
            // className="pr-4 h-[474px]"

            // className="mt-20 z-0 h-[474px]  overflow-y-auto  mb-400"
            // style={{
            //   minWidth: "100%",
            //   height: "200px",
            //   display: "table",
            //   overflowY: "scroll",
            // }}

            className="mt-20  z-0 overflow-y-auto flex-1 mb-4 pr-4"
            style={{ height: "78%" }}
          >
            {/* Chat Messages */}

            {messages.length == 0 ? (
              <>
                <p>No messages</p>
              </>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex gap-3 my-4 text-gray-600 text-sm flex-1"
                  >
                    <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                      <div className="rounded-full bg-gray-100 border p-1">
                        <svg
                          stroke="none"
                          fill="black"
                          strokeWidth={message.sender === "AI" ? "1.5" : "0"}
                          viewBox="0 0 24 24"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={
                              message.sender === "AI"
                                ? "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                : "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
                            }
                          />
                        </svg>
                      </div>
                    </span>
                    <p className="leading-relaxed">
                      <span className="block font-bold text-gray-700">
                        {message.sender}{" "}
                      </span>
                      {/* {message.content[0].text.value} */}
                      {message.sender === "AI" ? (
                        <>
                          {/* {(() => {
                            try {
                              const parsedContent = JSON.parse(
                                message.content[0].text.value.slice(7, -3)
                              );
                              // console.log("Parsed Content :", parsedContent);
                              return (
                                <ChatCard
                                  name={parsedContent.name}
                                  description={parsedContent.description}
                                  date={parsedContent.date}
                                />
                              );
                            } catch (error) {
                              // If JSON parsing fails, render the content as a plain string
                              return (
                                <p className=" bg-white  border w-90 p-2 rounded-lg mb-2 left-0">
                                  {message.content[0].text.value}
                                </p>
                              );
                            }
                          })()} */}

                          {message.content[0] && message.content[0].text ? (
                            (() => {
                              try {
                                const parsedContent = JSON.parse(
                                  message.content[0].text.value.slice(7, -3)
                                );
                                return (
                                  <ChatCard
                                    name={parsedContent.name}
                                    description={parsedContent.description}
                                    date={parsedContent.date}
                                    start_date={parsedContent.start_date}
                                    end_date={parsedContent.end_date}
                                    location={parsedContent.location}
                                    handleMore={handleMore}
                                    setShowEventForm={setShowEventForm}
                                    setEventForm={setEventForm}
                                  />
                                );
                              } catch (error) {
                                //console.log("ERRRRRRRRORRRRRRRRRR");
                                //console.log(error);
                                // If JSON parsing fails, render the content as a plain string
                                return (
                                  <p className=" bg-white  border w-90 p-2 rounded-lg mb-2 left-0">
                                    {message.content[0].text.value}
                                  </p>
                                );
                              }
                            })()
                          ) : (
                            <ThreeDots
                              visible={true}
                              height="20"
                              width="40"
                              color="#bcd727"
                              radius="9"
                              ariaLabel="three-dots-loading"
                              wrapperStyle={{}}
                              wrapperClass=""
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <p className=" bg-openbox-green  border w-90 p-2 rounded-lg mb-2 left-0">
                            {message.content[0].text.value}
                          </p>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div className=" pt-0  w-full p-4">
            <div className="flex items-center justify-center w-full space-x-2">
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                // value={inputValue}
                // onChange={(e) => setInputValue(e.target.value)}

                value={newMessage}
                rows={calculateRows(newMessage)}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-openbox-green hover:bg-bg-openbox-green h-10 px-4 py-2"
                onClick={handleMessageSend}
                // onClick={() => {
                //   setShowEventForm(true);
                // }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

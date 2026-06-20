import { useEffect, useRef, useState } from "react";
import { chatWithStylist } from "../lib/gemini.js";

const QUICK_QUESTIONS = [
  "오늘 코디 중 뭐가 제일 나아?",
  "우산 챙겨야 할까?",
  "오늘 레이어링 어떻게 해?",
  "포인트 컬러 추천해줘",
];

const MIN_W = 280;
const MAX_W = 560;
const MIN_H = 320;
const MAX_H = 700;
const DEFAULT_W = 340;
const DEFAULT_H = 480;

export default function ChatBot({ weather, profile, look, wardrobe, occasion, condition, theme }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `안녕하세요! 저는 WeatherFit AI 스타일리스트예요 ✦\n오늘 코디나 패션에 대해 무엇이든 물어보세요!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [isMobile, setIsMobile] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const resizeRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, messages]);

  const startResize = (e) => {
    if (isMobile) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onMove = (ev) => {
      const newW = Math.min(MAX_W, Math.max(MIN_W, startW - (ev.clientX - startX)));
      const newH = Math.min(MAX_H, Math.max(MIN_H, startH - (ev.clientY - startY)));
      setSize({ w: newW, h: newH });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg = { role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await chatWithStylist({
        message: userText,
        history: messages,
        weather,
        profile,
        look,
        wardrobe,
        occasion,
        condition,
      });
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: `오류가 발생했어요: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = isMobile
    ? {
        background: "#FFFDF7",
        bottom: 0,
        left: 0,
        right: 0,
        height: "75vh",
        maxHeight: "75vh",
        width: "100%",
      }
    : {
        background: "#FFFDF7",
        width: `${size.w}px`,
        height: `${size.h}px`,
        maxWidth: "calc(100vw - 3rem)",
        bottom: "6rem",
        right: "1.5rem",
      };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed z-40 flex h-14 w-14 items-center justify-center border-2 text-xl shadow-lg transition hover:scale-105"
        style={{
          background: open ? "#1A1A1A" : theme?.accent || "#E8543B",
          borderColor: "#1A1A1A",
          color: "#FFFDF7",
          bottom: isMobile ? (open ? "75vh" : "1.5rem") : "1.5rem",
          right: "1.5rem",
          transition: "bottom 0.3s ease, background 0.2s ease",
        }}
        title="AI 스타일리스트에게 물어보기"
      >
        {open ? "✕" : "✦"}
      </button>

      {/* 채팅 패널 */}
      {open && (
        <div
          className="fixed z-40 flex flex-col border-2 border-[#1A1A1A] shadow-2xl"
          style={panelStyle}
        >
          {/* 리사이즈 핸들 (데스크탑 전용) */}
          {!isMobile && (
            <div
              ref={resizeRef}
              onMouseDown={startResize}
              className="absolute left-0 top-0 z-50 flex items-center justify-center"
              style={{
                width: "18px",
                height: "18px",
                cursor: "nw-resize",
                background: "#1A1A1A",
              }}
              title="드래그해서 크기 조절"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 7L7 1M1 4L4 1" stroke="#FFFDF7" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          )}

          {/* 헤더 */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "#1A1A1A" }}
          >
            <div>
              <div className="wf-label text-[10px] text-[#E8543B]">AI 스타일리스트</div>
              <div className="text-sm font-semibold text-[#FFFDF7]">WeatherFit 스타일리스트</div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="h-2 w-2 rounded-full"
                style={{ background: "#4CAF50" }}
                title="온라인"
              />
              {isMobile && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-[#A8A296] transition hover:text-[#FFFDF7]"
                >
                  닫기
                </button>
              )}
            </div>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-3" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[82%] px-3 py-2 text-sm leading-6"
                  style={
                    msg.role === "user"
                      ? { background: "#1A1A1A", color: "#FFFDF7" }
                      : { background: "#F0EBE0", color: "#1A1A1A", borderLeft: `2px solid ${theme?.accent || "#E8543B"}` }
                  }
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 px-3 py-2" style={{ background: "#F0EBE0" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 rounded-full animate-bounce"
                      style={{ background: theme?.accent || "#E8543B", animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 빠른 질문 */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-[#E5DED1] px-3 py-2 flex-shrink-0">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="border border-[#D7D0C4] px-2 py-1 text-[11px] text-[#6B665C] transition hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div className="flex border-t border-[#1A1A1A] flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="질문을 입력하세요..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-[#A8A296]"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40"
              style={{ background: theme?.accent || "#E8543B", color: "#FFFDF7" }}
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}

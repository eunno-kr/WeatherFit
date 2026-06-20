import { useState } from "react";

export default function NotificationSettings({ notifTime, onSave, condition, temp }) {
  const [time, setTime] = useState(notifTime || "07:30");
  const [status, setStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const requestAndSave = async () => {
    if (typeof Notification === "undefined") {
      alert("이 브라우저는 알림을 지원하지 않아요.");
      return;
    }
    const perm = await Notification.requestPermission();
    setStatus(perm);
    if (perm === "granted") {
      onSave(time);
    }
  };

  const cancel = () => onSave(null);

  return (
    <div className="mt-4 border-t border-[#E5DED1] pt-4">
      <div className="wf-label mb-2 text-[#6B665C]">DAILY REMINDER</div>
      <p className="mb-3 text-xs leading-5 text-[#8F897D]">
        매일 설정한 시간에 날씨 코디 알림을 받아요.
        {notifTime && <span className="ml-1 font-semibold text-[#E8543B]">{notifTime} 설정됨</span>}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border border-[#D7D0C4] bg-transparent px-3 py-2 text-sm outline-none"
        />
        {status === "granted" ? (
          <>
            <button
              type="button"
              onClick={() => onSave(time)}
              className="bg-[#1A1A1A] px-4 py-2 text-xs font-semibold text-white"
            >
              저장
            </button>
            {notifTime && (
              <button
                type="button"
                onClick={cancel}
                className="border border-[#D7D0C4] px-4 py-2 text-xs text-[#6B665C]"
              >
                해제
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={requestAndSave}
            className="bg-[#E8543B] px-4 py-2 text-xs font-semibold text-white"
          >
            알림 허용 & 저장
          </button>
        )}
      </div>
      {status === "denied" && (
        <p className="mt-2 text-xs text-[#C9443E]">
          브라우저 설정에서 알림을 허용해야 사용할 수 있어요.
        </p>
      )}
    </div>
  );
}

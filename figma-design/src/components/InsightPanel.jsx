import { useState } from "react";

export default function InsightPanel({ look }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="wf-card-soft mt-6 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <div className="wf-label text-[#6B665C]" style={{ fontSize: "13px" }}>이 코디를 추천한 이유</div>
        <span style={{ fontSize: "13px", border: "0.5px solid #D7D0C4", borderRadius: "4px", padding: "2px 8px", color: "#6B665C" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="mt-3 grid gap-2">
          {look.insights.map((item) => (
            <p key={item} className="border-l-2 pl-3 text-sm leading-6 text-[#3A362E]" style={{ borderColor: "#A8A296" }}>
              {item}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

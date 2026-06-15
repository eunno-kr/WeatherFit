export default function InsightPanel({ look }) {
  return (
    <section className="wf-card-soft mt-6 p-5">
      <div className="wf-label text-[#6B665C]">WHY THIS LOOK</div>
      <div className="mt-3 grid gap-2">
        {look.insights.map((item) => (
          <p key={item} className="border-l-2 pl-3 text-sm leading-6 text-[#3A362E]" style={{ borderColor: "#A8A296" }}>
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

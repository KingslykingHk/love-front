export default function Hearts() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-float text-pink-500 opacity-70"
          style={{
            left: Math.random() * 100 + "%",
            animationDelay: Math.random() * 6 + "s",
            fontSize: Math.random() * 18 + 12 + "px",
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}

import { useState } from "react";
import { toast } from "react-toastify";

export default function FunBox({ submissionId }) {
  const [lovelyMessage, setLovelyMessage] = useState("");
  const [thoughts, setThoughts] = useState("");

  const sendMessage = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/just-for-fun-hurrshini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId,
            lovelyMessage,
            hurrshiniThoughts: thoughts,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("💖 Message sent successfully");
        setLovelyMessage("");
        setThoughts("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Backend not reachable 😢");
    }
  };

  return (
    <div className="z-10 w-full max-w-md mx-auto px-4 py-6 space-y-4">
      <textarea
        className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/30"
        placeholder="A lovely message 💌"
        value={lovelyMessage}
        onChange={(e) => setLovelyMessage(e.target.value)}
      />

      <textarea
        className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/30"
        placeholder="Hurrshini’s thoughts 🌷"
        value={thoughts}
        onChange={(e) => setThoughts(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="w-full py-3 bg-pink-600 text-white rounded-xl text-lg"
      >
        Send with ❤️
      </button>
    </div>
  );
}

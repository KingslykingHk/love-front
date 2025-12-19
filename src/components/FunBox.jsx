import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function FunBox({ submissionId }) {
  const [lovelyMessage, setLovelyMessage] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  // 🔹 send text message
  const sendMessage = async () => {
    try {
      const res = await fetch(
        "https://love-f9y2.onrender.com/just-for-fun-hurrshini",
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

  // 🔹 upload image to cloudinary
  const uploadImage = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "YOUR_UPLOAD_PRESET");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      setImage(result.secure_url);
      setPreview(result.secure_url);

      toast.success("📸 Image uploaded with love");

      // optional: send image url to backend
      await axios.post("https://love-f9y2.onrender.com/api/emotion", {
        submissionId,
        imageUrl: result.secure_url,
      });
    } catch (err) {
      toast.error("Image upload failed 😢");
    }
  };

  return (
    <div className="z-10 w-full max-w-md mx-auto px-4 py-6 space-y-4">
      {/* 💌 Lovely message */}
      <textarea
        className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/30"
        placeholder="A lovely message 💌"
        value={lovelyMessage}
        onChange={(e) => setLovelyMessage(e.target.value)}
      />

      {/* 🌷 Thoughts */}
      <textarea
        className="w-full p-3 rounded-xl bg-white/40 backdrop-blur-md border border-white/30"
        placeholder="Hurrshini’s thoughts 🌷"
        value={thoughts}
        onChange={(e) => setThoughts(e.target.value)}
      />

      {/* ❤️ Send button */}
      <button
        onClick={sendMessage}
        className="w-full py-3 bg-pink-600 text-white rounded-xl text-lg"
      >
        Send with ❤️
      </button>

      {/* 📸 Image upload section */}
      <div className="mt-6 text-center space-y-2">
        <h3 className="text-lg font-semibold text-pink-500">
          Add your image right now 💖
        </h3>

        <p className="text-sm text-gray-500">
          So I can feel something new… love mari 🥹
        </p>

        <input
          type="file"
          accept="image/*"
          className="mx-auto mt-2"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mx-auto mt-4 w-44 rounded-xl shadow-lg"
          />
        )}
      </div>
    </div>
  );
}

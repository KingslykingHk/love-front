import { useState } from "react";
import { toast } from "react-toastify";

export default function FunBox({ submissionId }) {
  const [lovelyMessage, setLovelyMessage] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // SEND MESSAGE (text + image url)
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
            imageUrl,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("💖 Message sent successfully");
        setLovelyMessage("");
        setThoughts("");
        setPreview(null);
        setImageUrl(null);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Backend not reachable 😢");
    }
  };

  // CAMERA → CLOUDINARY (mobile / HTTPS)
  const handleCamera = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // 🔴 CHANGE THESE 2 WHEN READY
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // eg: cool_pic
    const CLOUD_NAME = "YOUR_CLOUD_NAME"; // eg: dtnuqhcrq

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        toast.error("Upload failed");
        return;
      }

      setPreview(data.secure_url);
      setImageUrl(data.secure_url);
      toast.success("📸 Pic captured ❤️");
    } catch (e) {
      toast.error("Camera upload failed 😢");
    }
  };

  return (
    <div className="z-10 w-full max-w-md mx-auto px-4 py-6 space-y-4">
      {/* TEXT AREA */}
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

      {/* SEND BUTTON */}
      <button
        onClick={sendMessage}
        className="w-full py-3 bg-pink-600 text-white rounded-xl text-lg"
      >
        Send with ❤️
      </button>

      {/* CAMERA SECTION */}
      <div className="pt-4 text-center space-y-2">
        <p className="text-pink-600 font-medium">
          Click your pic to cool me down ❤️
        </p>

        <label className="inline-block cursor-pointer bg-pink-500 text-white px-4 py-2 rounded-xl">
          Open Camera 📸 (Say cheeeese 😄)
          <input
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => handleCamera(e.target.files[0])}
          />
        </label>

        {preview && (
          <>
            <img
              src={preview}
              alt="preview"
              className="mx-auto mt-3 w-40 rounded-xl shadow-lg"
            />
            <p className="text-sm text-gray-500 mt-1">
              Is this okay? Then submit ❤️
            </p>
          </>
        )}
      </div>
    </div>
  );
}

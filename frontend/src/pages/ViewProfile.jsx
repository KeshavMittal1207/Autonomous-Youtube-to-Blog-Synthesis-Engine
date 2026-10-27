import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setProfileData } from "../../utils/redux/slice/profileDataSlice.js";
import { Edit2, History, ExternalLink, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const ViewProfile = () => {
  const { email } = useParams();
  const dispatch = useDispatch();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4800";
  const profileData = useSelector((state) => state.profileData?.value);
  const [copiedId, setCopiedId] = useState(null);

  const user = profileData?.payload || {
    name: "User",
    userName: "user",
    email: email || localStorage.getItem("email"),
    profilePic: "/profile-logo.png",
    history: []
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const targetEmail = email || localStorage.getItem("email");
      if (!targetEmail) return;

      try {
        const response = await fetch(`${VITE_BACKEND_URL}/profile/${targetEmail}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            dispatch(setProfileData(data.result));
          }
        }
      } catch (err) {
        console.warn("Could not fetch profile:", err);
      }
    };

    fetchProfile();
  }, [email]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Blog markdown copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const historyList = user.history || [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="max-w-5xl w-full mx-auto p-4 md:p-8 flex-1">
        {/* Profile Header Card */}
        <div className="bg-white border-4 border-red-600 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img
              src={user.profilePic || "/profile-logo.png"}
              alt="Profile"
              className="h-32 w-32 md:h-40 md:md:w-40 border-4 border-black rounded-full object-cover shadow"
              onError={(e) => { e.target.src = "/profile-logo.png"; }}
            />
            <div>
              <h1 className="font-extrabold text-3xl md:text-4xl text-black">
                {user.name}
              </h1>
              <p className="text-gray-600 font-semibold text-lg mt-1">
                @{user.userName}
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          <Link to="/edit-profile">
            <button className="bg-black hover:bg-gray-800 text-white rounded-xl flex items-center px-6 py-3 font-bold gap-x-2 transition cursor-pointer shadow">
              <Edit2 size={18} />
              <span>Edit Profile</span>
            </button>
          </Link>
        </div>

        {/* History Section Card */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-3 text-black">
              <History size={28} className="text-red-600" />
              <h2 className="font-bold text-2xl">Generated Blog History</h2>
            </div>
            <Link to="/blog-creation">
              <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition">
                <Sparkles size={14} />
                <span>New Blog</span>
              </button>
            </Link>
          </div>

          {historyList.length > 0 ? (
            <div className="space-y-4">
              {historyList.map((item, index) => {
                const title = item.title || "Synthesized Blog Article";
                const videoId = item.videoId || "N/A";
                const draft = item.blogDraft || "";
                const id = item._id || index;

                return (
                  <div
                    key={id}
                    className="bg-gray-50 border border-gray-200 hover:border-red-300 rounded-xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          Video: {videoId}
                        </span>
                        {item.published && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Published to Dev.to
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-black">{title}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 font-semibold">
                        <span>Readability: {item.readabilityScore || 8}/10</span>
                        <span>•</span>
                        <span>SEO Score: {item.seoScore || 8}/10</span>
                        {item.createdAt && (
                          <>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {draft && (
                        <button
                          onClick={() => handleCopy(draft, id)}
                          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 transition"
                          title="Copy Markdown"
                        >
                          {copiedId === id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          <span>{copiedId === id ? "Copied" : "Copy"}</span>
                        </button>
                      )}

                      {item.publishedUrl ? (
                        <a
                          href={item.publishedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                        >
                          <span>Dev.to Post</span>
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <Link
                          to="/blog-creation"
                          state={{ initialVideoUrl: videoId }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition"
                        >
                          <span>Re-open</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <History size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No Generated Articles Yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto mt-1 mb-5">
                Paste a YouTube video link to generate your first AI synthesized blog post with full reflection loops.
              </p>
              <Link to="/blog-creation">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition">
                  Create Your First Blog
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;

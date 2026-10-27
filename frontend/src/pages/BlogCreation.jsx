import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import LogOut from "../components/LogOut";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Send,
  RefreshCw,
  Share2,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Terminal,
  FileText,
  Sliders,
  ExternalLink,
  ChevronRight,
  StopCircle,
  BookmarkCheck,
  Check,
} from "lucide-react";

const BlogCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("email") || "guest@user.com";
  const signInButton = useSelector((state) => state.signInButton?.value);
  const logOutButton = useSelector((state) => state.logOutButton?.value);

  // Environment endpoints
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4800";
  const VITE_AI_BACKEND_URL = import.meta.env.VITE_AI_BACKEND_URL || "http://localhost:8000";

  // Form inputs
  const [videoInput, setVideoInput] = useState(location.state?.initialVideoUrl || "");
  const [threadId, setThreadId] = useState(`session-${Math.random().toString(36).substring(2, 8)}`);
  const [maxIterations, setMaxIterations] = useState(3);
  const [showSettings, setShowSettings] = useState(false);

  // Agent State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "markdown" | "logs"
  const [blogState, setBlogState] = useState(null);

  // Revision state
  const [isRevising, setIsRevising] = useState(false);
  const [revisionInstructions, setRevisionInstructions] = useState("");
  const [showRevisionBox, setShowRevisionBox] = useState(false);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToHistory, setSavedToHistory] = useState(false);

  // Auto-run if video URL was passed from Hero section
  useEffect(() => {
    if (location.state?.initialVideoUrl && !blogState && !isLoading) {
      handleGenerate();
    }
  }, [location.state]);

  // Call generation endpoint with fallback
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    const cleanInput = videoInput.trim();
    if (!cleanInput) {
      toast.warning("Please enter a YouTube video URL or ID.");
      return;
    }

    setIsLoading(true);
    setLoadingStep("Extracting transcript and orchestrating LangGraph agents...");
    setSavedToHistory(false);
    setShowRevisionBox(false);

    try {
      // First try Express backend proxy endpoint
      let response = null;
      let data = null;

      try {
        response = await fetch(`${VITE_BACKEND_URL}/api/blog/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            video_id: cleanInput,
            thread_id: threadId,
            max_iteration: maxIterations,
            email: userEmail,
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          data = resJson.data || resJson;
        }
      } catch (proxyError) {
        console.warn("Backend proxy unavailable, falling back to direct AI Agent service:", proxyError);
      }

      // Fallback: call AI Agent directly (port 8000)
      if (!data) {
        response = await fetch(`${VITE_AI_BACKEND_URL}/generate-blog`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            video_id: cleanInput,
            thread_id: threadId,
            max_iteration: maxIterations,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || errData.message || "Failed to generate blog draft");
        }
        data = await response.json();
      }

      setBlogState(data);
      if (data.status === "interrupted") {
        toast.info("⏸️ Workflow paused at Human Review interrupt! Review and approve draft.");
      } else {
        toast.success("Blog draft successfully synthesized!");
      }
    } catch (error) {
      console.error("Error generating blog:", error);
      toast.error(error.message || "An error occurred while generating the blog.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  // Human-in-the-Loop decision actions
  const handleResumeAction = async (action, instructions = "") => {
    if (!blogState) return;

    if (action === "revise") {
      setIsRevising(true);
    } else if (action === "publish") {
      setIsPublishing(true);
    }

    try {
      let data = null;

      // Try Express proxy first
      try {
        const response = await fetch(`${VITE_BACKEND_URL}/api/blog/resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thread_id: blogState.thread_id || threadId,
            action,
            instructions,
            email: userEmail,
          }),
        });

        if (response.ok) {
          const resJson = await response.json();
          data = resJson.data || resJson;
        }
      } catch (proxyErr) {
        console.warn("Backend proxy resume unavailable, falling back to direct AI agent:", proxyErr);
      }

      // Fallback direct AI agent call
      if (!data) {
        const response = await fetch(`${VITE_AI_BACKEND_URL}/resume-workflow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thread_id: blogState.thread_id || threadId,
            action,
            instructions,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || errData.message || "Action execution failed");
        }
        data = await response.json();
      }

      setBlogState(data);

      if (action === "publish") {
        if (data.published) {
          toast.success("🎉 Article successfully published to Dev.to!");
        } else {
          toast.error(data.error || "Dev.to publication failed.");
        }
      } else if (action === "revise") {
        toast.success("✨ Draft revised as per your instructions!");
        setShowRevisionBox(false);
        setRevisionInstructions("");
      } else if (action === "stop") {
        toast.info("Workflow stopped.");
      }
    } catch (error) {
      console.error("Resume Action Error:", error);
      toast.error(error.message || "Failed to complete action.");
    } finally {
      setIsRevising(false);
      setIsPublishing(false);
    }
  };

  // Copy Markdown to clipboard
  const handleCopy = () => {
    if (!blogState?.blog_draft) return;
    navigator.clipboard.writeText(blogState.blog_draft);
    setCopied(true);
    toast.success("Markdown copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Download Markdown file
  const handleDownload = () => {
    if (!blogState?.blog_draft) return;
    const blob = new Blob([blogState.blog_draft], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedTitle = (blogState.title || "blog-draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 40);
    link.download = `${sanitizedTitle}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded .md file!");
  };

  // Save to user history in MongoDB
  const handleSaveToHistory = async () => {
    if (!blogState?.blog_draft) return;
    try {
      const response = await fetch(`${VITE_BACKEND_URL}/api/blog/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          videoId: videoInput,
          title: blogState.title || "Generated Blog",
          blogDraft: blogState.blog_draft,
          readabilityScore: blogState.readability_score || 0,
          seoScore: blogState.seo_score || 0,
          feedback: blogState.feedback || "",
          evaluation: blogState.evaluation || "approved",
          published: blogState.published || false,
          publishedUrl: blogState.published_url || null,
        }),
      });

      if (response.ok) {
        setSavedToHistory(true);
        toast.success("Saved to your search history!");
      } else {
        toast.info("Blog draft stored locally in session.");
      }
    } catch (err) {
      console.warn("Could not save to remote database:", err);
      toast.info("Blog draft stored in current session.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col text-gray-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-red-600 font-medium">Home</Link>
            <ChevronRight size={16} />
            <span className="font-semibold text-black">Autonomous Blog Synthesis Engine</span>
          </div>
          <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full border border-red-200">
            LangGraph Multi-Agent Loops
          </span>
        </div>

        {/* Input & Control Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black flex items-center gap-2">
                <Sparkles className="text-red-600" size={24} />
                YouTube Video to Publication-Ready Article
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Fetches transcripts, generates structured markdown, grades SEO & readability, and supports live human refinement.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition cursor-pointer self-start md:self-auto"
            >
              <Sliders size={16} />
              {showSettings ? "Hide Settings" : "Agent Settings"}
            </button>
          </div>

          {/* Expandable Settings */}
          {showSettings && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Session Thread ID (State Persistence)
                </label>
                <input
                  type="text"
                  value={threadId}
                  onChange={(e) => setThreadId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. thread-1"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Max Optimization Iterations: {maxIterations}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer mt-2"
                />
                <span className="text-xs text-gray-500 flex justify-between">
                  <span>1 (Fast)</span>
                  <span>3 (Balanced)</span>
                  <span>5 (Deep Refine)</span>
                </span>
              </div>
            </div>
          )}

          {/* URL Input Form */}
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="Paste YouTube Video URL or ID (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl p-4 text-base outline-none focus:bg-white focus:ring-2 focus:ring-red-600 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !videoInput.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-md text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Synthesize Blog</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-red-600" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">LangGraph Multi-Agent Pipeline Active</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">{loadingStep}</p>
            <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-600" /> Transcript Fetcher
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-600" /> Writer Agent
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-600" /> Quality Evaluator
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-green-600" /> Self-Reflection Loop
              </span>
            </div>
          </div>
        )}

        {/* Generated Workspace */}
        {blogState && (
          <div className="space-y-6">
            {/* Published Success Banner */}
            {blogState.published && blogState.published_url && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 text-white p-3 rounded-full">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-950">
                      🎉 Successfully Published to Dev.to!
                    </h3>
                    <p className="text-sm text-green-800">
                      Your article is live on Dev.to and ready for public reading.
                    </p>
                  </div>
                </div>
                <a
                  href={blogState.published_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 text-sm shadow transition"
                >
                  <span>View Published Post</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            )}

            {/* Quality Metrics Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Generated Article Title
                  </span>
                  <h1 className="text-2xl font-black text-black mt-1">
                    {blogState.title || "Untitled Article"}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  {/* Verdict Badge */}
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      blogState.evaluation === "approved"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {blogState.evaluation === "approved" ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertCircle size={16} className="text-amber-600" />
                    )}
                    Verdict: {blogState.evaluation || "APPROVED"}
                  </span>

                  {/* Readability Score */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Readability</span>
                    <span className="text-base font-black text-black">
                      {blogState.readability_score ?? 8} <span className="text-xs text-gray-500">/ 10</span>
                    </span>
                  </div>

                  {/* SEO Score */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">SEO Score</span>
                    <span className="text-base font-black text-black">
                      {blogState.seo_score ?? 8} <span className="text-xs text-gray-500">/ 10</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Feedback Note */}
              {blogState.feedback && (
                <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-700 flex items-start gap-2">
                  <span className="font-bold text-black whitespace-nowrap">Evaluator Critique:</span>
                  <span>{blogState.feedback}</span>
                </div>
              )}
            </div>

            {/* Human-in-the-Loop Actions Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase text-gray-500 mr-2 flex items-center gap-1">
                  <Clock size={14} /> Human Action:
                </span>

                {/* Publish Button */}
                <button
                  type="button"
                  onClick={() => handleResumeAction("publish")}
                  disabled={isPublishing || blogState.published}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition shadow-sm"
                >
                  {isPublishing ? (
                    <RefreshCw className="animate-spin" size={16} />
                  ) : (
                    <Share2 size={16} />
                  )}
                  <span>{blogState.published ? "Published" : "🚀 Publish to Dev.to"}</span>
                </button>

                {/* Revise Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowRevisionBox(!showRevisionBox)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition shadow-sm"
                >
                  <RefreshCw size={16} />
                  <span>✏️ Revise Draft</span>
                </button>

                {/* Stop Button */}
                <button
                  type="button"
                  onClick={() => handleResumeAction("stop")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition"
                >
                  <StopCircle size={16} />
                  <span>Stop</span>
                </button>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  title="Copy Markdown"
                >
                  {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  title="Download .md"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  disabled={savedToHistory}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  title="Save to User Search History"
                >
                  <BookmarkCheck size={14} className={savedToHistory ? "text-green-600" : ""} />
                  <span>{savedToHistory ? "Saved" : "Save History"}</span>
                </button>
              </div>
            </div>

            {/* Revision Instruction Form */}
            {showRevisionBox && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-red-950 mb-2 flex items-center gap-2">
                  <Sparkles size={18} className="text-red-600" />
                  Human-in-the-Loop Revision Instructions
                </h3>
                <p className="text-xs text-red-800 mb-3">
                  Guide the reviser agent with explicit changes (e.g. "Add concrete code snippets", "Explain the trade-offs in bullet points", "Make the introduction punchier").
                </p>
                <textarea
                  rows={3}
                  value={revisionInstructions}
                  onChange={(e) => setRevisionInstructions(e.target.value)}
                  placeholder="Enter revision instructions for the agent..."
                  className="w-full bg-white border border-red-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-600 transition"
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowRevisionBox(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isRevising || !revisionInstructions.trim()}
                    onClick={() => handleResumeAction("revise", revisionInstructions.trim())}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow"
                  >
                    {isRevising ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    <span>Apply Revision</span>
                  </button>
                </div>
              </div>
            )}

            {/* Workspace Tabs: Preview vs Raw Markdown vs Agent Execution Logs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50 px-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`py-4 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === "preview"
                      ? "border-red-600 text-red-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-black"
                  }`}
                >
                  <FileText size={18} />
                  <span>Formatted Article Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("markdown")}
                  className={`py-4 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === "markdown"
                      ? "border-red-600 text-red-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-black"
                  }`}
                >
                  <Copy size={18} />
                  <span>Raw Markdown Source</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className={`py-4 px-6 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
                    activeTab === "logs"
                      ? "border-red-600 text-red-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-black"
                  }`}
                >
                  <Terminal size={18} />
                  <span>Agent Logs ({blogState.logs?.length || 0})</span>
                </button>
              </div>

              <div className="p-6 md:p-8">
                {/* Formatted Preview */}
                {activeTab === "preview" && (
                  <article className="prose prose-red max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl">
                    <ReactMarkdown>{blogState.blog_draft || ""}</ReactMarkdown>
                  </article>
                )}

                {/* Raw Markdown Source */}
                {activeTab === "markdown" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500 font-semibold">
                        Markdown text area (editable for quick adjustments):
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        {copied ? "Copied!" : "Copy all text"}
                      </button>
                    </div>
                    <textarea
                      rows={20}
                      value={blogState.blog_draft || ""}
                      onChange={(e) =>
                        setBlogState((prev) => ({ ...prev, blog_draft: e.target.value }))
                      }
                      className="w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-xl p-4 outline-none focus:bg-white focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                )}

                {/* Agent Execution Logs */}
                {activeTab === "logs" && (
                  <div className="bg-gray-950 text-emerald-400 font-mono text-xs rounded-xl p-5 overflow-x-auto shadow-inner space-y-2">
                    <div className="text-gray-500 pb-2 border-b border-gray-800">
                      // LangGraph Execution Trace & Node Logs
                    </div>
                    {blogState.logs && blogState.logs.length > 0 ? (
                      blogState.logs.map((log, index) => (
                        <div key={index} className="flex gap-2 leading-relaxed">
                          <span className="text-gray-600 select-none">[{index + 1}]</span>
                          <span>{log}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No logs captured.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Profile and Logout Modals from Redux */}
      {signInButton && <Profile />}
      {logOutButton && <LogOut />}
    </div>
  );
};

export default BlogCreation;

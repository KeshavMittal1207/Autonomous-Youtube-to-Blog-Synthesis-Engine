import streamlit as st
import os
import sys
from langgraph.types import Command

# Ensure src modules are resolvable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.graph.workflow import build_blog_workflow

st.set_page_config(
    page_title="YouTube → Blog Agentic AI",
    page_icon="🧠",
    layout="wide"
)

# Display toast notification if queued in session state
if "toast_msg" in st.session_state:
    st.toast(st.session_state.pop("toast_msg"))

st.title("🧠 YouTube → 📝 Blog Agentic AI Workflow")
st.caption("Powered by LangGraph Human-in-the-Loop (`interrupt` & `Command`), Groq LLMs & Multi-Agent Loops")

# Sidebar Configuration
with st.sidebar:
    st.header("⚙️ Settings")
    thread_id = st.text_input("Thread Session ID", value="session-1")
    max_iters = st.slider("Max Optimization Iterations", min_value=1, max_value=5, value=3)

# Workflow session state
if "workflow" not in st.session_state:
    st.session_state.workflow = build_blog_workflow()
if "state" not in st.session_state:
    st.session_state.state = None

# Input Section
st.header("📥 Start Workflow")
video_input = st.text_input("Enter YouTube Video URL or ID", placeholder="e.g. dQw4w9WgXcQ")

if st.button("🚀 Run Workflow", type="primary") and video_input.strip():
    with st.spinner("Running agent workflow (fetching transcript, drafting, evaluating, optimizing)..."):
        config = {"configurable": {"thread_id": thread_id}}
        initial_state = {
            "video_id": video_input.strip(),
            "iteration": 1,
            "max_iteration": max_iters,
            "logs": []
        }
        
        # Invoke workflow — pauses at interrupt() when draft is ready
        result = st.session_state.workflow.invoke(initial_state, config=config)
        st.session_state.state = result
        st.session_state.show_revision = False
        
        if result.get("error"):
            st.error(f"❌ Error: {result['error']}")
        else:
            st.success("⏸️ Workflow paused at Human Review interrupt! Review draft below.")

# Display Workspace when graph is paused or finished
if st.session_state.state:
    state = st.session_state.state
    config = {"configurable": {"thread_id": thread_id}}
    
    tab1, tab2, tab3 = st.tabs(["📝 Blog Draft & Actions", "📊 Quality Metrics", "📜 Execution Logs"])
    
    with tab1:
        st.subheader("Generated Article Title")
        st.write(f"**{state.get('title', 'N/A')}**")
        
        st.subheader("Current Blog Draft (Markdown)")
        st.text_area("Draft Content", value=state.get("blog_draft", ""), height=400)
        
        if state.get("published"):
            st.balloons()
            st.success(f"🎉 Article Published to Dev.to! [View Published Post]({state.get('published_url')})")
        elif state.get("user_action") == "stop":
            st.info("Workflow has been stopped.")
        else:
            st.divider()
            st.subheader("🤝 Choose Action")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("🛑 Stop", use_container_width=True):
                    with st.spinner("Stopping workflow..."):
                        res = st.session_state.workflow.invoke(Command(resume={"action": "stop"}), config=config)
                        st.session_state.state = res
                        st.session_state.show_revision = False
                        st.info("Workflow stopped.")
                        st.rerun()

            with col2:
                if st.button("🚀 Publish to Dev.to", type="primary", use_container_width=True):
                    with st.spinner("Publishing to Dev.to..."):
                        res = st.session_state.workflow.invoke(Command(resume={"action": "publish"}), config=config)
                        st.session_state.state = res
                        st.session_state.show_revision = False
                        st.rerun()

            with col3:
                if st.button("✏️ Revise", use_container_width=True):
                    st.session_state.show_revision = not st.session_state.get("show_revision", False)

            if st.session_state.get("show_revision", False):
                st.markdown("---")
                st.subheader("✨ Revision Instructions")
                instructions = st.text_area(
                    "Enter instructions for revision:",
                    placeholder="e.g. Add technical code examples, improve SEO keywords, or adjust tone...",
                    key="revision_instructions_input"
                )
                if st.button("✨ Revise Draft", type="primary"):
                    if instructions.strip():
                        with st.spinner("Revising draft based on your instructions..."):
                            res = st.session_state.workflow.invoke(
                                Command(resume={"action": "revise", "instructions": instructions.strip()}),
                                config=config
                            )
                            st.session_state.state = res
                            st.session_state.toast_msg = "Draft revised as per the instructions! 🎉"
                            st.session_state.show_revision = False
                            st.rerun()
                    else:
                        st.warning("Please enter revision instructions before submitting.")

    with tab2:
        st.subheader("Evaluation Feedback")
        col_a, col_b, col_c = st.columns(3)
        col_a.metric("Verdict", state.get("evaluation", "N/A").upper())
        col_b.metric("Readability Score", f"{state.get('readability_score', 'N/A')} / 10")
        col_c.metric("SEO Score", f"{state.get('seo_score', 'N/A')} / 10")
        
        st.info(f"**Feedback:** {state.get('feedback', 'None')}")

    with tab3:
        st.subheader("Agent Execution Logs")
        for log in state.get("logs", []):
            st.code(log, language="text")

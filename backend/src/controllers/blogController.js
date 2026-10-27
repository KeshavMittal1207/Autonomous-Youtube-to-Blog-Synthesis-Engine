import historyModel from "../model/historyModel.js";
import registeredUsersModel from "../model/registeredUsersModel.js";

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8000";

export async function generateBlogProxy(req, resp) {
  try {
    const { video_id, thread_id, max_iteration, email } = req.body;

    if (!video_id) {
      return resp.status(400).send({ message: "video_id is required", success: false });
    }

    const aiResponse = await fetch(`${AI_BACKEND_URL}/generate-blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_id,
        thread_id: thread_id || `thread-${Date.now()}`,
        max_iteration: max_iteration || 3,
      }),
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return resp.status(aiResponse.status).send({
        message: data.detail || "Error generating blog from AI agent",
        success: false,
        error: data.detail,
      });
    }

    // Save to history if email provided
    if (email && data.blog_draft) {
      try {
        const historyItem = await historyModel.create({
          userEmail: email,
          videoId: video_id,
          title: data.title || "Untitled Blog",
          blogDraft: data.blog_draft,
          readabilityScore: data.readability_score || 0,
          seoScore: data.seo_score || 0,
          feedback: data.feedback || "",
          evaluation: data.evaluation || "approved",
          published: data.published || false,
          publishedUrl: data.published_url || null,
        });

        await registeredUsersModel.updateOne(
          { email },
          { $push: { history: historyItem._id } }
        );
      } catch (saveErr) {
        console.warn("Could not save to history:", saveErr.message);
      }
    }

    return resp.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI Generate Blog Error:", error);
    return resp.status(500).send({
      message: `Failed to connect to AI Agent backend: ${error.message}`,
      success: false,
    });
  }
}

export async function resumeWorkflowProxy(req, resp) {
  try {
    const { thread_id, action, instructions, email, historyId } = req.body;

    if (!thread_id || !action) {
      return resp.status(400).send({ message: "thread_id and action are required", success: false });
    }

    const aiResponse = await fetch(`${AI_BACKEND_URL}/resume-workflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_id,
        action,
        instructions: instructions || "",
      }),
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return resp.status(aiResponse.status).send({
        message: data.detail || "Error resuming workflow from AI agent",
        success: false,
      });
    }

    // Update history item if needed
    if (historyId && (data.blog_draft || data.published_url)) {
      try {
        await historyModel.findByIdAndUpdate(historyId, {
          ...(data.blog_draft && { blogDraft: data.blog_draft }),
          ...(data.published !== undefined && { published: data.published }),
          ...(data.published_url && { publishedUrl: data.published_url }),
          ...(data.readability_score && { readabilityScore: data.readability_score }),
          ...(data.seo_score && { seoScore: data.seo_score }),
        });
      } catch (updateErr) {
        console.warn("Could not update history item:", updateErr.message);
      }
    }

    return resp.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI Resume Workflow Error:", error);
    return resp.status(500).send({
      message: `Failed to connect to AI Agent backend: ${error.message}`,
      success: false,
    });
  }
}

export async function saveBlogHistory(req, resp) {
  try {
    const { email, videoId, title, blogDraft, readabilityScore, seoScore, feedback, evaluation, published, publishedUrl } = req.body;

    if (!email || !blogDraft) {
      return resp.status(400).send({ message: "email and blogDraft are required", success: false });
    }

    const historyItem = await historyModel.create({
      userEmail: email,
      videoId: videoId || "N/A",
      title: title || "Generated Blog",
      blogDraft,
      readabilityScore: readabilityScore || 0,
      seoScore: seoScore || 0,
      feedback: feedback || "",
      evaluation: evaluation || "approved",
      published: published || false,
      publishedUrl: publishedUrl || null,
    });

    await registeredUsersModel.updateOne(
      { email },
      { $push: { history: historyItem._id } }
    );

    return resp.status(201).send({
      message: "Blog saved to history",
      success: true,
      historyItem,
    });
  } catch (error) {
    console.error("Save Blog History Error:", error);
    return resp.status(500).send({ message: error.message || error, success: false });
  }
}

export async function getUserHistory(req, resp) {
  try {
    const { email } = req.params;
    const historyList = await historyModel.find({ userEmail: email }).sort({ createdAt: -1 });
    return resp.status(200).send({
      success: true,
      history: historyList,
    });
  } catch (error) {
    console.error("Get User History Error:", error);
    return resp.status(500).send({ message: error.message || error, success: false });
  }
}

export async function deleteUserHistory(req, resp) {
  try {
    const { id } = req.params;
    const item = await historyModel.findByIdAndDelete(id);
    if (item) {
      await registeredUsersModel.updateOne(
        { email: item.userEmail },
        { $pull: { history: item._id } }
      );
    }
    return resp.status(200).send({ message: "History item deleted", success: true });
  } catch (error) {
    console.error("Delete User History Error:", error);
    return resp.status(500).send({ message: error.message || error, success: false });
  }
}

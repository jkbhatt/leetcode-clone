"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ThumbsUp, Reply, Trash2, Send, MessageCircle } from "lucide-react";

export default function Discussion({ problemId, currentUser }) {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    fetchDiscussions();
  }, [problemId]);

  const fetchDiscussions = async () => {
    try {
      const res = await api.get(`/problems/${problemId}/discussions`);
      setDiscussions(res.data.discussions);
    } catch {
      toast.error("Failed to fetch discussions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Please write something!");
    setSubmitting(true);
    try {
      const res = await api.post(`/problems/${problemId}/discussions`, {
        content,
      });
      setDiscussions([res.data.discussion, ...discussions]);
      setContent("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (discussionId) => {
    try {
      const res = await api.post(
        `/problems/${problemId}/discussions/${discussionId}/upvote`
      );
      setDiscussions(
        discussions.map((d) =>
          d._id === discussionId
            ? {
                ...d,
                upvotes: res.data.isUpvoted
                  ? [...d.upvotes, currentUser._id]
                  : d.upvotes.filter((id) => id !== currentUser._id),
              }
            : d
        )
      );
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyContent.trim()) return toast.error("Please write a reply!");
    try {
      const res = await api.post(
        `/problems/${problemId}/discussions/${discussionId}/reply`,
        { content: replyContent }
      );
      setDiscussions(
        discussions.map((d) =>
          d._id === discussionId ? { ...d, replies: res.data.replies } : d
        )
      );
      setReplyContent("");
      setReplyingTo(null);
      setExpandedReplies({ ...expandedReplies, [discussionId]: true });
      toast.success("Reply added!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (discussionId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.delete(
        `/problems/${problemId}/discussions/${discussionId}`
      );
      setDiscussions(discussions.filter((d) => d._id !== discussionId));
      toast.success("Comment deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Write comment */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <MessageCircle size={16} className="text-yellow-400" />
          Share your thoughts
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your approach, ask questions, or discuss solutions..."
            rows={3}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">{content.length}/2000</span>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              <Send size={14} />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Discussions list */}
      {loading ? (
        <p className="text-gray-400 text-sm text-center">Loading discussions...</p>
      ) : discussions.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle size={32} className="text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((discussion) => {
            const isUpvoted = discussion.upvotes?.includes(currentUser?._id);
            const isAuthor = discussion.author?._id === currentUser?._id;

            return (
              <div key={discussion._id} className="bg-gray-800 rounded-xl p-4">
                {/* Comment header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 rounded-full w-7 h-7 flex items-center justify-center">
                      <span className="text-black text-xs font-bold">
                        {discussion.author?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-white text-sm font-medium">
                      {discussion.author?.username}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDate(discussion.createdAt)}
                    </span>
                    {discussion.isEdited && (
                      <span className="text-gray-500 text-xs">(edited)</span>
                    )}
                  </div>

                  {/* Delete button */}
                  {(isAuthor || currentUser?.role === "admin") && (
                    <button
                      onClick={() => handleDelete(discussion._id)}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Comment content */}
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {discussion.content}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {/* Upvote */}
                  <button
                    onClick={() => handleUpvote(discussion._id)}
                    className={`flex items-center gap-1.5 text-xs transition ${
                      isUpvoted
                        ? "text-yellow-400"
                        : "text-gray-400 hover:text-yellow-400"
                    }`}
                  >
                    <ThumbsUp size={13} />
                    <span>{discussion.upvotes?.length || 0}</span>
                  </button>

                  {/* Reply */}
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === discussion._id ? null : discussion._id
                      )
                    }
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
                  >
                    <Reply size={13} />
                    <span>Reply</span>
                  </button>

                  {/* Show replies */}
                  {discussion.replies?.length > 0 && (
                    <button
                      onClick={() =>
                        setExpandedReplies({
                          ...expandedReplies,
                          [discussion._id]: !expandedReplies[discussion._id],
                        })
                      }
                      className="text-xs text-gray-400 hover:text-white transition"
                    >
                      {expandedReplies[discussion._id] ? "Hide" : "Show"}{" "}
                      {discussion.replies.length} repl
                      {discussion.replies.length === 1 ? "y" : "ies"}
                    </button>
                  )}
                </div>

                {/* Reply input */}
                {replyingTo === discussion._id && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    />
                    <button
                      onClick={() => handleReply(discussion._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                )}

                {/* Replies */}
                {expandedReplies[discussion._id] &&
                  discussion.replies?.length > 0 && (
                    <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-700">
                      {discussion.replies.map((reply) => (
                        <div key={reply._id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {reply.author?.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-white text-xs font-medium">
                              {reply.author?.username}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm pl-8">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

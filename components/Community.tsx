"use client";

import React, { useState } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Users,
  Trophy,
  Share2,
  MessageSquare,
  Heart,
  Send,
  Globe,
  Lock,
  Medal,
  TrendingUp,
  Award,
} from "lucide-react";

export const Community: React.FC = () => {
  const {
    communityPosts,
    leaderboard,
    isPublicProfile,
    togglePublicProfile,
    addCommunityPost,
  } = useTradingStore();
  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    addCommunityPost({
      userId: "me",
      userName: "Trader",
      type: "THOUGHT",
      content: newPost,
    });
    setNewPost("");
  };

  return (
    <div className="community-screen">
      <div className="community-columns">
        <div className="main-feed">
          <div className="share-card">
            <div className="share-user">
              <div className="avatar">S</div>
              <textarea
                placeholder="What's your market outlook for tomorrow?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </div>
            <div className="share-actions">
              <button className="attach-trade-btn">
                <Share2 size={16} /> Attach Last Trade
              </button>
              <button className="post-btn" onClick={handlePostSubmit}>
                <Send size={16} /> Share
              </button>
            </div>
          </div>

          <div className="feed-list">
            {communityPosts.map((post) => (
              <div key={post.id} className="feed-item">
                <div className="item-header">
                  <div className="user-info">
                    <div className="avatar-small">
                      {post.userName.charAt(0)}
                    </div>
                    <div>
                      <span className="username">{post.userName}</span>
                      <span className="time">
                        {post.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {post.type === "TRADE" && (
                    <span className="type-tag trade">TRADE</span>
                  )}
                </div>

                <p className="post-content">{post.content}</p>

                {post.stats && (
                  <div className="post-stats-box">
                    <div className="st">
                      <span className="lbl">Session P&L</span>
                      <span className="val text-green">
                        ₹{post.stats.pnl.toLocaleString()}
                      </span>
                    </div>
                    <div className="st">
                      <span className="lbl">Win Rate</span>
                      <span className="val">{post.stats.winRate}%</span>
                    </div>
                  </div>
                )}

                <div className="item-actions">
                  <button className="act-btn">
                    <Heart size={16} /> {post.likes}
                  </button>
                  <button className="act-btn">
                    <MessageSquare size={16} /> {post.comments}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="community-sidebar">
          <div className="profile-privacy-card">
            <div className="title">
              {isPublicProfile ? (
                <Globe size={18} className="text-blue" />
              ) : (
                <Lock size={18} className="text-gray" />
              )}
              <span>
                {isPublicProfile ? "Public Profile" : "Private Session"}
              </span>
            </div>
            <p>
              Your performance history and leaderboard status are currently{" "}
              {isPublicProfile ? "visible to everyone" : "hidden"}.
            </p>
            <button
              className={`toggle-privacy ${isPublicProfile ? "off" : "on"}`}
              onClick={togglePublicProfile}
            >
              {isPublicProfile ? "Go Private" : "Enable Public Sharing"}
            </button>
          </div>

          <div className="leaderboard-card">
            <h3>
              <Trophy size={20} className="text-gold" /> Global Leaderboard
            </h3>
            <div className="leader-list">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`leader-row rank-${entry.rank}`}
                >
                  <div className="rank">#{entry.rank}</div>
                  <div className="name-stats">
                    <span className="un">{entry.userName}</span>
                    <span className="detail">
                      ₹{entry.totalPnL.toLocaleString()} • {entry.winRate}% SR
                    </span>
                  </div>
                  {entry.rank === 1 && (
                    <Medal size={18} className="text-gold" />
                  )}
                </div>
              ))}
            </div>
            <button className="view-rank-btn">View My Detailed Ranking</button>
          </div>

          <div className="achievement-card">
            <h3>
              <Award size={20} className="text-purple" /> My Badges
            </h3>
            <div className="badge-icons">
              <div
                className="b-icon active"
                title="Nifty Alpha - 5 profitable trades in a row"
              >
                <TrendingUp size={24} />
              </div>
              <div
                className="b-icon locked"
                title="Centurion - Complete 100 manual trades"
              >
                <Users size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

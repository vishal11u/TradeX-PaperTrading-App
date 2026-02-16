import React, { useState, useMemo } from "react";
import { useTradingStore } from "@/store/tradingStore";
import {
  Plus,
  Trash2,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit3,
  BookOpen,
} from "lucide-react";
import { JournalEntry } from "@/types/trading";

export const Journal: React.FC = () => {
  const { portfolio, addJournalEntry, deleteJournalEntry } = useTradingStore();
  const [isAdding, setIsAdding] = useState(false);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [marketMood, setMarketMood] =
    useState<JournalEntry["marketMood"]>("SIDEWAYS");
  const [mistakes, setMistakes] = useState("");
  const [goodWork, setGoodWork] = useState("");
  const [notes, setNotes] = useState("");
  const [pnlReflection, setPnlReflection] = useState(0);

  const handleAdd = () => {
    if (!title) return;
    addJournalEntry({
      date: new Date().toISOString().split("T")[0],
      title,
      marketMood,
      mistakes,
      goodWork,
      notes,
      pnlReflection,
    });
    setIsAdding(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setMarketMood("SIDEWAYS");
    setMistakes("");
    setGoodWork("");
    setNotes("");
    setPnlReflection(0);
  };

  const sortedJournal = useMemo(() => {
    return [...portfolio.journal].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [portfolio.journal]);

  return (
    <div className="journal-screen">
      <div className="journal-sidebar">
        <div className="sidebar-header">
          <h3>Daily Notes</h3>
          <button
            className="add-btn"
            onClick={() => {
              setIsAdding(true);
              setViewingEntry(null);
            }}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="entries-list">
          {sortedJournal.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={40} className="text-gray" />
              <p>No journal entries yet</p>
              <span>Start recording your trading journey</span>
            </div>
          ) : (
            sortedJournal.map((entry) => (
              <div
                key={entry.id}
                className={`entry-item ${viewingEntry?.id === entry.id ? "active" : ""}`}
                onClick={() => {
                  setViewingEntry(entry);
                  setIsAdding(false);
                }}
              >
                <div className="entry-icon">
                  {entry.marketMood === "BULLISH" && (
                    <TrendingUp size={16} className="text-green" />
                  )}
                  {entry.marketMood === "BEARISH" && (
                    <TrendingDown size={16} className="text-red" />
                  )}
                  {entry.marketMood === "SIDEWAYS" && (
                    <Minus size={16} className="text-blue" />
                  )}
                  {entry.marketMood === "VOLATILE" && (
                    <AlertCircle size={16} className="text-orange" />
                  )}
                </div>
                <div className="entry-info">
                  <div className="entry-title">{entry.title}</div>
                  <div className="entry-date">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteJournalEntry(entry.id);
                    if (viewingEntry?.id === entry.id) setViewingEntry(null);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="journal-content">
        {isAdding ? (
          <div className="journal-form premium-form">
            <div className="form-header">
              <h2>New Daily Journal</h2>
              <button className="close-btn" onClick={() => setIsAdding(false)}>
                ×
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Entry Title</label>
                <input
                  type="text"
                  placeholder="e.g., Post-Monthly Expiry Reflection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Market Sentiment</label>
                <div className="mood-selector">
                  {(
                    ["BULLISH", "BEARISH", "SIDEWAYS", "VOLATILE"] as const
                  ).map((mood) => (
                    <button
                      key={mood}
                      className={`mood-btn ${marketMood === mood ? "selected" : ""}`}
                      onClick={() => setMarketMood(mood)}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Estimated Daily P&L</label>
                <input
                  type="number"
                  value={pnlReflection}
                  onChange={(e) => setPnlReflection(Number(e.target.value))}
                />
              </div>

              <div className="form-group full">
                <label>
                  <AlertCircle size={14} /> Mistakes (Lessons Learnt)
                </label>
                <textarea
                  placeholder="What went wrong today? Did you overtrade? Revenge trade?"
                  value={mistakes}
                  onChange={(e) => setMistakes(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>
                  <CheckCircle2 size={14} /> Good Execution (Victories)
                </label>
                <textarea
                  placeholder="What did you do well? Strict SL follow? Patience?"
                  value={goodWork}
                  onChange={(e) => setGoodWork(e.target.value)}
                />
              </div>

              <div className="form-group full">
                <label>
                  <MessageSquare size={14} /> General Notes
                </label>
                <textarea
                  placeholder="Any other observations about stock behavior or market news..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={handleAdd}>
                Save Journal Entry
              </button>
            </div>
          </div>
        ) : viewingEntry ? (
          <div className="journal-view-panel">
            <div className="view-header">
              <div>
                <h1>{viewingEntry.title}</h1>
                <div className="meta">
                  <Calendar size={14} />{" "}
                  <span>
                    {new Date(viewingEntry.date).toLocaleDateString()}
                  </span>
                  <span
                    className={`mood-badge ${viewingEntry.marketMood.toLowerCase()}`}
                  >
                    {viewingEntry.marketMood}
                  </span>
                </div>
              </div>
              <div
                className={`pnl-summary ${viewingEntry.pnlReflection >= 0 ? "positive" : "negative"}`}
              >
                ₹{viewingEntry.pnlReflection.toLocaleString()}
              </div>
            </div>

            <div className="view-sections">
              <div className="view-card mistakes">
                <h3>
                  <AlertCircle size={18} /> Mistakes & Lessons
                </h3>
                <p>
                  {viewingEntry.mistakes ||
                    "No mistakes recorded - clean trading day!"}
                </p>
              </div>

              <div className="view-card good-work">
                <h3>
                  <CheckCircle2 size={18} /> Victories & Good Execution
                </h3>
                <p>{viewingEntry.goodWork || "No specific victories noted."}</p>
              </div>

              <div className="view-card general">
                <h3>
                  <MessageSquare size={18} /> General Notes
                </h3>
                <p>{viewingEntry.notes || "No additional notes."}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="journal-placeholder">
            <div className="placeholder-content">
              <div className="icon-stack">
                <BookOpen size={60} />
                <Edit3 size={30} className="overlay-icon" />
              </div>
              <h2>Select an Entry or Create New</h2>
              <p>
                Maintaining a trading journal is the fastest way to become a
                profitable trader.
              </p>
              <button
                className="create-first-btn"
                onClick={() => setIsAdding(true)}
              >
                <Plus size={18} /> Create New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

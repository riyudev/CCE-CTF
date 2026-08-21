import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import InputField from "./InputField";
import { api } from "../services/api";

export default function AdminChallenges({ currentPath, navigateTo, onLogout, setChallenges }) {
  const [challengesList, setChallengesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "WEB",
    difficulty: "EASY",
    points: 100,
    description: "",
    flag: "",
    fileUrl: "",
    originalFileName: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Delete Confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchAdminChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getChallenges();
      if (res.challenges) {
        setChallengesList(res.challenges);
        if (setChallenges) setChallenges(res.challenges);
      }
    } catch (err) {
      console.error("[ADMIN CHALLENGES] Fetch error:", err.message);
      setErrorMsg(err.message || "Failed to load challenges from MongoDB.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminChallenges();
  }, []);

  const handleOpenAddModal = () => {
    setEditingChallenge(null);
    setFormData({
      title: "",
      category: "WEB",
      difficulty: "EASY",
      points: 100,
      description: "",
      flag: "",
      fileUrl: "",
      originalFileName: "",
      isActive: true,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (c) => {
    setEditingChallenge(c);
    setFormData({
      title: c.title || "",
      category: c.category || "WEB",
      difficulty: c.difficulty || "EASY",
      points: c.points || 100,
      description: c.description || "",
      flag: c.flag || "",
      fileUrl: c.fileUrl || "",
      originalFileName: c.originalFileName || "",
      isActive: c.isActive !== undefined ? c.isActive : true,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleToggleActive = async (c) => {
    const targetId = c._id || c.id;
    const currentActive = c.isActive !== false;
    const nextActive = !currentActive;

    // Optimistic state update
    setChallengesList((prev) =>
      prev.map((item) =>
        (item._id || item.id) === targetId ? { ...item, isActive: nextActive } : item
      )
    );

    try {
      await api.admin.updateChallenge(targetId, { isActive: nextActive });
      fetchAdminChallenges();
    } catch (err) {
      // Revert on error
      setChallengesList((prev) =>
        prev.map((item) =>
          (item._id || item.id) === targetId ? { ...item, isActive: currentActive } : item
        )
      );
      setErrorMsg(err.message || "Failed to toggle challenge status.");
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.flag.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("category", formData.category);
      formPayload.append("difficulty", formData.difficulty);
      formPayload.append("points", String(Number(formData.points)));
      formPayload.append("description", formData.description.trim());
      formPayload.append("flag", formData.flag.trim());
      formPayload.append("isActive", String(formData.isActive));

      if (selectedFile) {
        formPayload.append("file", selectedFile);
      } else if (formData.fileUrl.trim()) {
        formPayload.append("fileUrl", formData.fileUrl.trim());
        if (formData.originalFileName.trim()) {
          formPayload.append("originalFileName", formData.originalFileName.trim());
        }
      } else if (editingChallenge) {
        formPayload.append("fileUrl", formData.fileUrl.trim());
        if (formData.originalFileName.trim()) {
          formPayload.append("originalFileName", formData.originalFileName.trim());
        }
      }

      if (editingChallenge) {
        await api.admin.updateChallenge(editingChallenge._id || editingChallenge.id, formPayload);
      } else {
        await api.admin.createChallenge(formPayload);
      }

      setShowModal(false);
      fetchAdminChallenges();
    } catch (err) {
      setErrorMsg(err.message || "Failed to save challenge to MongoDB.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.admin.deleteChallenge(deleteTargetId);
      setDeleteTargetId(null);
      fetchAdminChallenges();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete challenge.");
      setDeleteTargetId(null);
    }
  };

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      {/* Header */}
      <div className="border-b border-[#242424] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
            CHALLENGES MANAGEMENT
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Create, update, toggle, and manage CTF challenges in MongoDB.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_12px_rgba(57,255,20,0.4)] transition-all cursor-pointer self-start sm:self-auto"
        >
          + ADD CHALLENGE
        </button>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

      {/* Challenges Table */}
      <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080808] border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3 px-4">CHALLENGE</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">DIFFICULTY</th>
                <th className="py-3 px-4">POINTS</th>
                <th className="py-3 px-4">FLAG</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; LOADING CHALLENGES FROM MONGODB...
                  </td>
                </tr>
              ) : challengesList.length > 0 ? (
                challengesList.map((c) => (
                  <tr key={c._id || c.id} className="hover:bg-[#080808]/50 transition-colors">
                    <td className="py-3 px-4 font-minecraftBold text-[#F5F5F5]">
                      {c.title}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#8A8A8A]">{c.category}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono border border-[#242424] px-1.5 py-0.5 rounded uppercase">
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#39FF14] font-minecraftBold">
                      {c.points} PTS
                    </td>
                    <td className="py-3 px-4 font-mono text-[#8A8A8A] text-[10px]">
                      {c.flag || "HIDDEN"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase cursor-pointer border ${
                          c.isActive !== false
                            ? "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/30"
                            : "text-[#FF4D4D] bg-[#FF4D4D]/10 border-[#FF4D4D]/30"
                        }`}
                      >
                        {c.isActive !== false ? "ENABLED" : "DISABLED"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(c)}
                        className="px-2.5 py-1 bg-[#080808] text-[#F5F5F5] border border-[#242424] hover:border-[#39FF14] hover:text-[#39FF14] text-[10px] uppercase font-bold rounded-sm cursor-pointer"
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(c._id || c.id)}
                        className="px-2.5 py-1 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:border-[#FF4D4D] hover:text-[#FF4D4D] text-[10px] uppercase font-bold rounded-sm cursor-pointer"
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8A8A8A]">
                    No challenges found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- ADD / EDIT FORM MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#39FF14] rounded-sm p-6 max-w-lg w-full space-y-4 my-8 box-glow-neon">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="text-lg font-minecraftBold text-[#39FF14]">
                {editingChallenge ? "EDIT CHALLENGE" : "ADD CHALLENGE"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#8A8A8A] hover:text-[#FF4D4D] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <InputField
                id="cTitle"
                label="Title *"
                placeholder="Enter challenge title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4 text-xs font-spaceMonoBold">
                <div>
                  <label className="text-[#8A8A8A] uppercase tracking-wider block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] rounded-sm px-3 py-2.5 outline-none"
                  >
                    <option value="WEB">Web</option>
                    <option value="CRYPTO">Crypto</option>
                    <option value="FORENSICS">Forensics</option>
                    <option value="REVERSE">Reverse</option>
                    <option value="MISC">Misc</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8A8A8A] uppercase tracking-wider block mb-1">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] rounded-sm px-3 py-2.5 outline-none"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <InputField
                id="cPoints"
                label="Points *"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="text-xs uppercase text-[#8A8A8A] tracking-wider block">
                  Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter challenge description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] rounded-sm p-3 text-xs outline-none"
                  required
                />
              </div>

              <InputField
                id="cFlag"
                label="Flag / Answer *"
                placeholder="CCE{enter_flag_here}"
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                required
              />

              <div className="space-y-1">
                <label className="text-xs uppercase text-[#8A8A8A] tracking-wider block">
                  Challenge File (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                    if (file) setFormData((prev) => ({ ...prev, fileUrl: "" }));
                  }}
                  className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] text-xs rounded-sm px-3 py-2 outline-none file:mr-3 file:py-1 file:px-2 file:rounded-sm file:border-0 file:bg-[#39FF14] file:text-[#080808] file:font-bold file:text-[10px] file:uppercase"
                />
                {selectedFile && (
                  <p className="text-[10px] text-[#39FF14] font-mono pt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
                {!selectedFile && formData.fileUrl && (
                  <p className="text-[10px] text-[#8A8A8A] font-mono pt-1">
                    Current file: {formData.originalFileName || formData.fileUrl.split("/").pop()}
                  </p>
                )}
                <p className="text-[10px] text-[#555555] pt-1">
                  Upload .zip, .txt, .pcap, binaries, or other challenge assets (max 50MB).
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#39FF14]"
                />
                <label htmlFor="isActiveToggle" className="text-xs text-[#F5F5F5] cursor-pointer">
                  Enable Challenge for Participants
                </label>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "SAVING TO DB..." : "SAVE CHALLENGE"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] text-xs font-bold uppercase rounded-sm cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- CONFIRMATION DIALOG ---------------- */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#FF4D4D] rounded-sm p-6 max-w-sm w-full space-y-4 box-glow-neon">
            <h3 className="text-base font-minecraftBold text-[#FF4D4D] uppercase">
              CONFIRM DELETION
            </h3>
            <p className="text-xs text-[#F5F5F5] leading-relaxed font-spaceMonoBold">
              Are you sure you want to delete this challenge from MongoDB? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-[#FF4D4D] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#FF4D4D]/90 cursor-pointer"
              >
                DELETE
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] font-bold text-xs uppercase rounded-sm cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

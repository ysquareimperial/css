import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ReviewerDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [assignedPapers, setAssignedPapers] = useState([]);

  // Fetch papers function
  const fetchMyPapers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://yaji.onrender.com/api/reviewers/papers",
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Transform API response into your expected structure
        const transformedPapers = data.map((item) => ({
          id: item.paper.id,
          title: item.paper.title,
          abstract: item.paper.abstract,
          keywords: item.paper.keywords,
          authors: item.paper.author?.email,
          date: new Date(item.paper.uploaded_at).toISOString().split("T")[0],
          status:
            item.paper.status.charAt(0).toUpperCase() +
            item.paper.status.slice(1),
          version: item.paper.version,
          uploadedAt: new Date(item.paper.uploaded_at)
            .toISOString()
            .split("T")[0],
          fileUrl: "/Hello.pdf", // update when API gives file
        }));

        setAssignedPapers(transformedPapers);
      } else {
        console.error("Failed to fetch papers");
      }
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch papers on component mount
  useEffect(() => {
    fetchMyPapers();
  }, []);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const [reviewForm, setReviewForm] = useState({
    feedback: "",
    file: null,
    recommendation: "Accept",
  });

  const handleOpenReview = (paper) => {
    setSelectedPaper(paper);
    setReviewForm({ feedback: "", file: null, recommendation: "Accept" });
    setReviewModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedPaper) return;
    setLoading(true);
    try {
      // Convert recommendation value to lowercase since API expects
      // pending | accept | reject | revise
      const status = reviewForm.recommendation.toLowerCase();

      const response = await fetch(
        `https://yaji.onrender.com/api/reviewers/papers/${selectedPaper.id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // ✅ Update UI after successful patch
        setAssignedPapers((prev) =>
          prev.map((p) => (p.id === selectedPaper.id ? { ...p, status } : p))
        );

        alert(`Status updated to: ${status}`);
        setReviewModalOpen(false);
      } else {
        console.error("Failed to update status");
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Logout icon SVG
  const LogoutIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );

  const getStatusColor = (status) => {
    if (status.includes("pending"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (status.includes("Accept"))
      return "bg-green-100 text-green-800 border-green-200";
    if (status.includes("Reject"))
      return "bg-red-100 text-red-800 border-red-200";
    if (status.includes("Revise"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusLabel = (status) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending";
      case "accept":
        return "Accepted";
      case "reject":
        return "Rejected";
      case "revise":
        return "Revised";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reviewer Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and evaluate assigned research papers
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.email}</p>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Logout"
              >
                <LogoutIcon />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Assigned Papers
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Papers Grid */}
        <div className="grid gap-6">
          {assignedPapers.length > 0 ? (
            assignedPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {paper.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>By {paper.authors}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Uploaded {paper.uploadedAt}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {paper.abstract}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper?.keywords?.split(", ").map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span
                      className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(
                        paper?.status
                      )}`}
                    >
                      {getStatusLabel(paper?.status)}
                    </span>

                    <div className="flex gap-3">
                      <a
                        href={paper.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download
                      </a>
                      <button
                        onClick={() => handleOpenReview(paper)}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Papers Assigned
              </h3>
              <p className="text-gray-500">
                You don't have any papers to review at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Review Modal */}
      {reviewModalOpen && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Review Paper
                  </h2>
                  <h3 className="text-lg text-gray-700 font-medium">
                    {selectedPaper.title}
                  </h3>
                </div>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Review Feedback *
                  </label>
                  <textarea
                    name="feedback"
                    placeholder="Provide detailed feedback on the paper's methodology, findings, and overall quality..."
                    value={reviewForm.feedback}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                    rows="6"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Attach Review Document (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div> */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Recommendation *
                  </label>
                  <select
                    name="recommendation"
                    value={reviewForm.recommendation}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Accept">
                      ✅ Accept - Ready for publication
                    </option>
                    <option value="Reject">
                      ❌ Reject - Does not meet standards
                    </option>
                    <option value="Revise">
                      🔄 Revise - Needs improvements
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white 
             hover:from-emerald-600 hover:to-emerald-700
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting Review...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

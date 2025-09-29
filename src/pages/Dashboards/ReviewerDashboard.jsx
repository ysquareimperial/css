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

        // Remove duplicates by paper_id and keep only the latest assignment
        const uniquePapers = Object.values(
          data.reduce((acc, item) => {
            if (!acc[item.paper_id] || new Date(item.assigned_date) > new Date(acc[item.paper_id].assigned_date)) {
              acc[item.paper_id] = item;
            }
            return acc;
          }, {})
        );

        // Transform API response based on the actual structure
        const transformedPapers = uniquePapers.map((item) => ({
          id: item.paper_id,
          assignmentId: item.id,
          title: `Research Paper #${item.paper_id}`,
          date: new Date(item.assigned_date).toISOString().split("T")[0],
          status: "Pending",
          uploadedAt: new Date(item.assigned_date).toISOString().split("T")[0],
          fileUrl: item.file_url?.replace("http://127.0.0.1:8000", "https://yaji.onrender.com") || item.file_url,
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
      const status = reviewForm.recommendation.toLowerCase();

      const response = await fetch(
        `https://yaji.onrender.com/api/reviewers/papers/${selectedPaper?.id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAssignedPapers((prev) =>
          prev.map((p) => (p?.id === selectedPaper?.id ? { ...p, status } : p))
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
        return "Pending Review";
      case "accept":
        return "Accepted";
      case "reject":
        return "Rejected";
      case "revise":
        return "Needs Revision";
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
            Assigned Papers ({assignedPapers.length})
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        {loading && assignedPapers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600">Loading papers...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignedPapers.length > 0 ? (
              assignedPapers.map((paper) => (
                <div
                  key={paper?.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {paper.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              paper?.status
                            )}`}
                          >
                            {getStatusLabel(paper?.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
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
                          <span>Assigned on {paper.uploadedAt}</span>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold text-gray-700">Paper ID:</span> {paper.id}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-700">Assignment ID:</span> {paper.assignmentId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-3">
                        <a
                          href={paper.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-200 font-medium"
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
                          View Paper
                        </a>
                        <button
                          onClick={() => handleOpenReview(paper)}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Submit Review
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
        )}
      </div>

      {/* Enhanced Review Modal */}
      {reviewModalOpen && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Submit Review
                  </h2>
                  <h3 className="text-lg text-gray-700 font-medium">
                    {selectedPaper.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Paper ID: {selectedPaper.id}
                  </p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Review Decision *
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

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-blue-800">
                      Your review decision will update the paper's status. Please ensure you've thoroughly reviewed the paper before submitting.
                    </p>
                  </div>
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
                        Submitting...
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
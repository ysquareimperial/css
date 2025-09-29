import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthorDashboard() {
  const { user, logout } = useAuth();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Add loading state
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  // Fetch papers function
  const fetchMyPapers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://yaji.onrender.com/api/authors/papers",
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log(response);

        const papers = await response.json();

        // Transform API response to match your component structure
        const transformedPapers = papers.map((paper) => ({
          id: paper.id,
          title: paper.title,
          abstract: paper.abstract,
          keywords: paper.keywords,
          authors: user?.email || "You",
          date: new Date(paper.uploaded_at).toISOString().split("T")[0],
          status: paper.status.charAt(0).toUpperCase() + paper.status.slice(1),
          version: paper.version,
          uploadedAt: new Date(paper.uploaded_at).toISOString().split("T")[0],
          fileUrl: paper.file_url, // Keep the original file_url from API
        }));

        setSubmissions(transformedPapers);
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

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    keywords: "",
    file: null,
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("file", form.file);

      // Build query parameters
      const queryParams = new URLSearchParams({
        title: form.title,
        abstract: form.abstract,
        keywords: form.keywords,
      });

      const response = await fetch(
        `https://yaji.onrender.com/api/authors/papers?${queryParams}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Add new submission to state
        const newSubmission = {
          id: data.id,
          title: form.title,
          abstract: form.abstract,
          keywords: form.keywords,
          authors: user?.email || "You",
          date: new Date(data.uploaded_at).toISOString().split("T")[0],
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          version: data.version,
          uploadedAt: new Date(data.uploaded_at).toISOString().split("T")[0],
          fileUrl: data.file_url, // Use the actual file_url from response
        };

        setSubmissions([newSubmission, ...submissions]);
        setForm({ title: "", abstract: "", keywords: "", file: null });
        setShowModal(false);
        alert("Paper submitted successfully!");

        // Refresh the papers list to get updated data
        fetchMyPapers();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Failed to submit paper");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setViewModalOpen(true);
  };

  // Function to handle file download
  const handleDownload = (fileUrl, fileName) => {
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "document";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to check if file can be previewed
  const canPreviewFile = (fileUrl) => {
    if (!fileUrl) return false;
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    return ["pdf"].includes(extension);
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
    if (status.includes("Pending"))
      return "bg-orange-100 text-orange-800 border-orange-200";
    if (status.includes("Accept"))
      return "bg-green-100 text-green-800 border-green-200";
    if (status.includes("Reject"))
      return "bg-red-100 text-red-800 border-red-200";
    if (status.includes("Revise"))
      return "bg-blue-100 text-blue-800 border-blue-200";
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
                Author Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and track your paper submissions
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
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              My Submissions
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Submit New Paper</span>
          </button>
        </div>

        {/* Submissions Grid */}
        <div className="grid gap-6">
          {loading && submissions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your submissions...</p>
            </div>
          ) : submissions.length > 0 ? (
            submissions.map((paper) => (
              <div
                key={paper.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {paper.title}
                        </h3>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          v{paper.version}
                        </span>
                      </div>
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
                          <span>Submitted {paper.uploadedAt}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {paper.abstract}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.keywords.split(", ").map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
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
                      <button
                        onClick={() => handleView(paper)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View Details
                      </button>

                      <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors duration-200 border border-emerald-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                          <path
                            fillRule="evenodd"
                            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        New Version
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Submissions Yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start by submitting your first research paper.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Submit Your First Paper
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Submit New Paper
                  </h2>
                  <p className="text-gray-600">
                    Upload your research paper for review
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter your paper title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    placeholder="Provide a brief summary of your research..."
                    value={form.abstract}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors"
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    placeholder="Machine Learning, AI, Deep Learning, etc."
                    value={form.keywords}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Document *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleChange}
                      className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 focus:border-purple-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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
                      "Submit Paper"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced View Modal */}
      {viewModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedSubmission.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Version {selectedSubmission.version}</span>
                    <span>•</span>
                    <span>Submitted {selectedSubmission.date}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Paper Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Authors
                        </label>
                        <p className="text-gray-900 mt-1">
                          {selectedSubmission.authors}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Abstract
                        </label>
                        <p className="text-gray-900 mt-1 leading-relaxed">
                          {selectedSubmission.abstract}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Keywords
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedSubmission.keywords
                            .split(", ")
                            .map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
                              >
                                {keyword}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Document
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    {selectedSubmission.fileUrl ? (
                      <>
                        {canPreviewFile(selectedSubmission.fileUrl) ? (
                          <div className="mb-4">
                            <iframe
                              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                                selectedSubmission.fileUrl
                              )}&embedded=true`}
                              title="Document Preview"
                              className="w-full h-96 rounded-lg border border-gray-200"
                              onError={(e) => {
                                console.log(
                                  "Iframe failed to load, showing fallback"
                                );
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "block";
                              }}
                            />
                            <div
                              style={{ display: "none" }}
                              className="w-full h-96 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center"
                            >
                              <div className="text-center">
                                <svg
                                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <p className="text-gray-600 mb-2">
                                  Preview not available
                                </p>
                                <p className="text-sm text-gray-500">
                                  Click download to view the document
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-96 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center mb-4">
                            <div className="text-center">
                              <svg
                                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="text-gray-600 mb-2">
                                Document Preview
                              </p>
                              <p className="text-sm text-gray-500">
                                Click download to view the document
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              handleDownload(
                                selectedSubmission.fileUrl,
                                selectedSubmission.title
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
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
                            Download Document
                          </button>

                          <button
                            onClick={() =>
                              window.open(selectedSubmission.fileUrl, "_blank")
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                                clipRule="evenodd"
                              />
                              <path
                                fillRule="evenodd"
                                d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Open in New Tab
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-96 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-16 h-16 text-gray-400 mx-auto mb-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-gray-600 mb-2">
                            No document available
                          </p>
                          <p className="text-sm text-gray-500">
                            The document could not be found
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

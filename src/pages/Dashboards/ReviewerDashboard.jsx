import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ReviewerDashboard() {
  const { logout } = useAuth();

  const [assignedPapers, setAssignedPapers] = useState([
    {
      id: 1,
      title: "AI in Education",
      abstract:
        "This paper explores how AI is shaping education systems worldwide.",
      authors: "John Doe, Jane Smith",
      keywords: "AI, Education, Machine Learning",
      uploadedAt: "2025-08-21",
      fileUrl: "/Hello.pdf",
      status: "Pending Review",
    },
    {
      id: 2,
      title: "Blockchain for Healthcare",
      abstract: "This research studies blockchain use cases in healthcare.",
      authors: "Alice Johnson",
      keywords: "Blockchain, Healthcare, Security",
      uploadedAt: "2025-08-15",
      fileUrl: "/Hello.pdf",
      status: "Pending Review",
    },
  ]);

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

  const handleSubmitReview = (e) => {
    e.preventDefault();

    console.log("Submitting review for:", selectedPaper);
    console.log(reviewForm);

    // TODO: Send review to API
    alert(`Review submitted with recommendation: ${reviewForm.recommendation}`);

    // Update paper status locally
    setAssignedPapers((prev) =>
      prev.map((p) =>
        p.id === selectedPaper.id
          ? { ...p, status: `Reviewed - ${reviewForm.recommendation}` }
          : p
      )
    );

    setReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Reviewer Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Assigned Papers Table */}
      <div className="p-4">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Authors</th>
              <th className="py-2 px-4 text-left">Uploaded At</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedPapers.length > 0 ? (
              assignedPapers.map((paper) => (
                <tr key={paper.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{paper.title}</td>
                  <td className="py-2 px-4">{paper.authors}</td>
                  <td className="py-2 px-4">{paper.uploadedAt}</td>
                  <td className="py-2 px-4">{paper.status}</td>
                  <td className="py-2 px-4">
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline mr-4"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleOpenReview(paper)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No papers assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 relative">
            <h2 className="text-xl font-bold mb-4">
              Review: {selectedPaper.title}
            </h2>

            <form onSubmit={handleSubmitReview}>
              <textarea
                name="feedback"
                placeholder="Enter feedback"
                value={reviewForm.feedback}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                rows="4"
                required
              />

              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full mb-3"
              />

              <select
                name="recommendation"
                value={reviewForm.recommendation}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
              >
                <option value="Accept">Accept</option>
                <option value="Reject">Reject</option>
                <option value="Revise">Revise</option>
              </select>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

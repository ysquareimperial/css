import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthorDashboard() {
  const { logout } = useAuth();

  // Temporary dummy submissions
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      title: "AI in Education",
      status: "Pending Review",
      version: 1,
      uploadedAt: "2025-08-21",
    },
    {
      id: 2,
      title: "Blockchain for Healthcare",
      status: "Accepted",
      version: 2,
      uploadedAt: "2025-08-15",
    },
  ]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.file) {
      alert("Please select a file");
      return;
    }

    // TODO: Replace with API call
    console.log("Uploading submission:", form);

    // Simulate adding new submission
    const newSubmission = {
      id: submissions.length + 1,
      title: form.title || "Untitled Paper",
      status: "Pending Review",
      version: 1,
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setSubmissions([newSubmission, ...submissions]);
    setForm({ title: "", abstract: "", keywords: "", file: null });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Author Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Upload Button */}
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload New Version
        </button>
      </div>

      {/* Submissions Table */}
      <div className="p-4">
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Version</th>
              <th className="py-2 px-4 text-left">Uploaded At</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((paper) => (
                <tr key={paper.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{paper.title}</td>
                  <td
                    className={`py-2 px-4 font-semibold ${
                      paper.status === "Accepted"
                        ? "text-green-600"
                        : paper.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {paper.status}
                  </td>
                  <td className="py-2 px-4">v{paper.version}</td>
                  <td className="py-2 px-4">{paper.uploadedAt}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => setShowModal(true)}
                      className="text-green-500 hover:underline"
                    >
                      Upload New Version
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
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
            <h2 className="text-xl font-bold mb-4">Upload New Paper</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Paper Title"
                value={form.title}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />

              <textarea
                name="abstract"
                placeholder="Abstract"
                value={form.abstract}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                rows="3"
              />

              <input
                type="text"
                name="keywords"
                placeholder="Keywords (comma separated)"
                value={form.keywords}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
              />

              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full mb-3"
                required
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

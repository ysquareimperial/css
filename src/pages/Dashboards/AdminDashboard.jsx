import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reviewersLoading, setReviewersLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewersError, setReviewersError] = useState(null);

  // Fetch papers from API
  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://yaji.onrender.com/api/admins/papers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setAllPapers(data); // Assuming API returns an array of papers
      } catch (err) {
        console.error("Failed to fetch papers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.access_token) {
      fetchPapers();
    }
  }, [user?.access_token]);

  useEffect(() => {
    const fetchReviewers = async () => {
      setReviewersLoading(true);
      setReviewersError(null);

      try {
        const res = await fetch(
          "https://yaji.onrender.com/api/admins/reviewers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Reviewers response:", data);
        setReviewers(Array.isArray(data) ? data : data.reviewers || []);
      } catch (err) {
        console.error("Failed to fetch reviewers:", err);
        setReviewersError(err.message);
      } finally {
        setReviewersLoading(false);
      }
    };

    if (user?.access_token) {
      fetchReviewers();
    }
  }, [user?.access_token]);

  // Mock data for all submitted papers
  const [reviewers, setReviewers] = useState([]);
  const [allPapers, setAllPapers] = useState([
    //   {
    //     id: 1,
    //     title: "AI in Education: Transforming Learning Experiences",
    //     abstract:
    //       "This paper explores how artificial intelligence is revolutionizing education systems worldwide through personalized learning and adaptive assessment.",
    //     authors: "John Doe, Jane Smith",
    //     keywords: "AI, Education, Machine Learning, Personalized Learning",
    //     submittedAt: "2025-08-21",
    //     status: "Pending Assignment",
    //     assignedReviewer: null,
    //     version: 1,
    //     fileUrl: "/Hello.pdf",
    //   },
    //   {
    //     id: 2,
    //     title: "Blockchain Technology in Healthcare Systems",
    //     abstract:
    //       "This research studies the implementation of blockchain technology for secure patient data management and healthcare interoperability.",
    //     authors: "Alice Johnson",
    //     keywords: "Blockchain, Healthcare, Security, Privacy",
    //     submittedAt: "2025-08-15",
    //     status: "Under Review",
    //     assignedReviewer: "Dr. Sarah Wilson",
    //     version: 2,
    //     fileUrl: "/Hello.pdf",
    //   },
    //   {
    //     id: 3,
    //     title: "Quantum Computing Applications in Cryptography",
    //     abstract:
    //       "An analysis of quantum computing's impact on current cryptographic methods and future security protocols.",
    //     authors: "Bob Martinez, Carol Lee",
    //     keywords: "Quantum Computing, Cryptography, Security, Algorithms",
    //     submittedAt: "2025-08-10",
    //     status: "Review Completed",
    //     assignedReviewer: "Prof. Michael Chen",
    //     version: 1,
    //     fileUrl: "/Hello.pdf",
    //   },
    //   {
    //     id: 4,
    //     title: "Machine Learning for Climate Change Prediction",
    //     abstract:
    //       "Investigating the use of advanced machine learning models for accurate climate change forecasting and environmental impact assessment.",
    //     authors: "Emma Davis",
    //     keywords:
    //       "Machine Learning, Climate Change, Environmental Science, Prediction Models",
    //     submittedAt: "2025-08-05",
    //     status: "Accepted",
    //     assignedReviewer: "Dr. James Rodriguez",
    //     version: 3,
    //     fileUrl: "/Hello.pdf",
    //   },
    // ]);
    // // Mock reviewers data
    // const [reviewers] = useState([
    //   {
    //     id: 1,
    //     name: "Dr. Sarah Wilson",
    //     email: "sarah.wilson@university.edu",
    //     expertise: "AI, Machine Learning",
    //     workload: 3,
    //   },
    //   {
    //     id: 2,
    //     name: "Prof. Michael Chen",
    //     email: "m.chen@university.edu",
    //     expertise: "Cryptography, Security",
    //     workload: 2,
    //   },
    //   {
    //     id: 3,
    //     name: "Dr. James Rodriguez",
    //     email: "j.rodriguez@university.edu",
    //     expertise: "Environmental Science, Data Science",
    //     workload: 4,
    //   },
    //   {
    //     id: 4,
    //     name: "Dr. Lisa Thompson",
    //     email: "l.thompson@university.edu",
    //     expertise: "Blockchain, Healthcare IT",
    //     workload: 1,
    //   },
    //   {
    //     id: 5,
    //     name: "Prof. David Kumar",
    //     email: "d.kumar@university.edu",
    //     expertise: "Quantum Computing, Algorithms",
    //     workload: 2,
    //   },
  ]);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState("");

  // Handle assignment
  const handleAssign = (paper) => {
    setSelectedPaper(paper);
    setSelectedReviewer(paper.assignedReviewer || "");
    setAssignModalOpen(true);
  };

  // const handleAssignSubmit = () => {
  //   if (!selectedReviewer) {
  //     alert("Please select a reviewer");
  //     return;
  //   }

  //   const reviewerName = reviewers.find(
  //     (r) => r.name === selectedReviewer
  //   )?.name;

  //   setAllPapers((prev) =>
  //     prev.map((paper) =>
  //       paper.id === selectedPaper.id
  //         ? {
  //             ...paper,
  //             assignedReviewer: reviewerName,
  //             status: "Under Review",
  //           }
  //         : paper
  //     )
  //   );

  //   setAssignModalOpen(false);
  //   setSelectedPaper(null);
  //   setSelectedReviewer("");
  // };
  const handleAssignSubmit = async () => {
    if (!selectedReviewer) {
      alert("Please select a reviewer");
      return;
    }
    setLoading(true); // ✅ start loading

    try {
      // find the reviewer object by email (not name, since you're setting email in state)
      const reviewer = reviewers.find((r) => r.email === selectedReviewer);

      if (!reviewer) {
        alert("Reviewer not found");
        return;
      }

      const res = await fetch("https://yaji.onrender.com/api/admins/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          paper_id: selectedPaper.id,
          reviewer_id: reviewer.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to assign reviewer");
      }

      // optional: get updated paper from API response
      // const updatedPaper = await res.json();

      // update local state optimistically
      setAllPapers((prev) =>
        prev.map((paper) =>
          paper.id === selectedPaper.id
            ? {
                ...paper,
                assignedReviewer: reviewer.email, // or reviewer.name if API returns it
                status: "Under Review",
              }
            : paper
        )
      );

      // close modal and reset
      setAssignModalOpen(false);
      setSelectedPaper(null);
      setSelectedReviewer("");
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      alert("Something went wrong assigning reviewer");
    } finally {
      setLoading(false); // ✅ stop loading always
    }
  };

  // Handle removal
  const handleRemoveReviewer = (paperId) => {
    if (
      window.confirm("Are you sure you want to remove the assigned reviewer?")
    ) {
      setAllPapers((prev) =>
        prev.map((paper) =>
          paper.id === paperId
            ? {
                ...paper,
                assignedReviewer: null,
                status: "Pending Assignment",
              }
            : paper
        )
      );
    }
  };

  // Logout icon
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
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800 border-red-200";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Review Completed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  const getWorkloadColor = (workload) => {
    if (workload <= 2) return "bg-green-100 text-green-800";
    if (workload <= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage paper submissions and reviewer assignments
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Papers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPapers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Assignment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    allPapers.filter((p) => p.status === "pending")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Under Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {allPapers.filter((p) => p.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    allPapers.filter(
                      (p) =>
                        p.status === "accept" ||
                        p.status === "Review Completed"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Papers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            All Submitted Papers
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>

        {/* Papers Grid */}
        <div className="grid gap-6">
          {allPapers.map((paper) => (
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
                        <span>By {paper.author.email}</span>
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
                        <span>Submitted {paper.uploaded_at}</span>
                      </div>
                      {paper.assignedReviewer && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Assigned to {paper.assignedReviewer}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.keywords.split(", ").map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  {/* <span
                    className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(
                      paper.status
                    )}`}
                  >
                    {paper.status}
                  </span> */}

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
                      View Paper
                    </a>

                    {paper.assignedReviewer ? (
                      <>
                        <button
                          onClick={() => handleAssign(paper)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Reassign
                        </button>
                        <button
                          onClick={() => handleRemoveReviewer(paper.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors duration-200 border border-red-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAssign(paper)}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Assign Reviewer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedPaper.assignedReviewer
                      ? "Reassign Reviewer"
                      : "Assign Reviewer"}
                  </h2>
                  <h3 className="text-lg text-gray-700 font-medium">
                    {selectedPaper.title}
                  </h3>
                </div>
                <button
                  onClick={() => setAssignModalOpen(false)}
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

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Reviewer
                  </label>
                  <div className="space-y-3">
                    {reviewers.map((reviewer) => (
                      <div
                        key={reviewer.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedReviewer === reviewer.email
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedReviewer(reviewer.email)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            {/* <h4 className="font-semibold text-gray-900">
                              {reviewer.name}
                            </h4> */}
                            <h4 className="font-semibold text-gray-900">
                              {reviewer.email}
                            </h4>
                            {/* <p className="text-sm text-gray-600">
                              {reviewer.email}
                            </p> */}
                            {/* <p className="text-sm text-gray-500 mt-1">
                              Expertise: {reviewer.expertise}
                            </p> */}
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkloadColor(
                                reviewer.workload
                              )}`}
                            >
                              {reviewer.assigned_papers_count} papers
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubmit}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white 
             hover:from-indigo-600 hover:to-indigo-700 
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
                      {selectedPaper.assignedReviewer
                        ? "Reassigning..."
                        : "Assigning..."}
                    </>
                  ) : (
                    <>
                      {selectedPaper.assignedReviewer ? "Reassign" : "Assign"}{" "}
                      Reviewer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

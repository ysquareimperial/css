import { useState } from "react";
import { Menu, Search, ChevronDown, X } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Import images at the top of your file
// import s1 from "../assets/s1.JPG";
// import s2 from "../assets/s2.JPEG";
// import s3 from "../assets/s3.JPEG";
// import s4 from "../assets/s4.JPEG";
// import s5 from "../assets/s5.JPEG";
// import s6 from "../assets/s6.JPEG";
import { useNavigate } from "react-router-dom";

export default function Home() {
  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <Navbar />

      {/* Image Slider */}
      <ImageSlider />

      {/* Main Section */}
      <main className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left (2/3 width on desktop) */}
        <div className="md:col-span-2 space-y-8">
          <WelcomeSection />
          <KeyPages />
          <LatestNews />
        </div>

        {/* Right (1/3 width on desktop) */}
        <div className="space-y-6">
          <TracksCard />
          <ImportantDatesCard />
          <FeaturedNewsCard />
          <PostsCard />
          <SupportersCard />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Navbar() {
  const menus = [
  {
    label: "Attending",
    options: [
      "Venue: Main Auditorium, Aliko Dangote University, Wudil",
      "Reception Venue: Faculty of Computing Complex",
      "Registration",
      "Virtual Attendance",
      "Presenting at the Conference",
      "Food & Refreshments",
      "Campus Tour & Fun Activities",
      "Hotels and Accommodation",
      "Getting Around Wudil",
      "Visa and Travel Information",
      "Travel Support",
      "Code of Conduct",
      "Equity, Diversity, and Inclusion",
      "FAQ",
    ],
  },
  {
    label: "Sponsors",
    options: [
      "Conference Sponsors",
      "Aliko Dangote University",
      "Faculty of Computing and Mathematical Sciences",
      "Corporate Partners",
      "Industry Collaborators",
      "Becoming a Sponsor",
    ],
  },
  {
    label: "Program",
    options: [
      "Conference Program",
      "My Schedule",
      "Proceedings",
      "Program Overview",
      "Keynotes",
      "Panels",
      "Tutorials",
      "Technical Sessions",
      "Workshops",
      "Poster Sessions",
      "Networking Events",
      "Student Innovation Challenge",
      "Recreational Activities",
      "Filter by Day",
    ],
  },
  {
    label: "Tracks",
    options: [
      "Opening Plenary Sessions",
      "Keynote Addresses",
      "Research Paper Presentations",
      "Postgraduate Symposium",
      "Student Research Track",
      "Workshops on Emerging Technologies",
      "Panel Discussions",
      "Poster Sessions",
      "Mathematical Modelling and Applied Sciences",
      "Artificial Intelligence and Data Science",
      "Cybersecurity and Networks",
      "Mathematics Education",
      "Tutorials and Technical Sessions",
      "Roundtable on Innovation and Entrepreneurship",
      "Community Engagement and Outreach",
      "Faculty–Industry Collaboration Track",
      "Closing Ceremony & Awards",
    ],
  },
  {
    label: "Organization",
    options: [
      "Conference Steering Committee",
      "Organizing Committee",
      "Track Committees",
      "Reviewers and Volunteers",
      "Local Arrangements Committee",
      "Workshops & Tutorials Committee",
      "Student Activities Committee",
    ],
  },
  {
    label: "Past Conferences",
    options: [
      "Faculty Conference 2025",
      "Faculty Conference 2024",
      "Faculty Conference 2023",
      "Faculty Conference 2022",
      "Faculty Conference 2021",
    ],
  },
];


  const [openMenu, setOpenMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleToggle = (menu) => {
    setSearchOpen(false);
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const handleSearchToggle = () => {
    setOpenMenu(null);
    setSearchOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md relative z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left Section: Logo + Menus */}
        <div className="flex items-center space-x-8">
          {/* ✅ Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://res.cloudinary.com/dx5ilizca/image/upload/v1758417637/logo_s3nzhd.png"
              alt="ICSE 2025"
              className="h-10 w-auto"
            />
          </div>

          {/* Menus */}
          <div className="flex items-center space-x-6">
            {menus.map((item) => (
              <Dropdown
                key={item.label}
                label={item.label}
                options={item.options}
                isOpen={openMenu === item.label}
                onToggle={() => handleToggle(item.label)}
              />
            ))}

            {/* Search */}
            <button
              onClick={handleSearchToggle}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Right Section: Auth Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-md text-gray-600 hover:text-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Inline Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md px-4 py-3 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="ml-2 text-gray-600 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </nav>
  );
}

function Dropdown({ label, options, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
      >
        <span>{label}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-md shadow-lg w-48 p-2 space-y-2 z-10">
          {options.map((opt, i) => (
            <a key={i} href="#" className="block hover:text-blue-600">
              {opt}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- IMAGE SLIDER WITH REACT-MULTI-CAROUSEL ---------------- */
function ImageSlider() {
  const slides = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=400&fit=crop&crop=center",
      caption: "Welcome to the Conference",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&h=400&fit=crop&crop=center",
      caption: "Submit Your Papers Today",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop&crop=center",
      caption: "Join Keynote Sessions",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&crop=center",
      caption: "Network with Experts",
    },
    {
      id: 5,
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center",
      caption: "Explore Innovation",
    },
    {
      id: 6,
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop&crop=center",
      caption: "Future Technologies",
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="w-full h-64 md:h-96">
      <Carousel
        swipeable={true}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={4000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={500}
        containerClass="carousel-container h-full"
        removeArrowOnDeviceType={["mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item h-full"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative w-full h-64 md:h-96">
            <img
              src={slide.img}
              alt={slide.caption}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Failed to load image:", slide.img);
                e.target.parentElement.style.background =
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                e.target.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h2 className="text-white text-xl md:text-3xl font-bold text-center px-4">
                {slide.caption}
              </h2>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

/* ---------------- LEFT SECTIONS ---------------- */
// Welcome Section
function WelcomeSection() {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-3 font-semibold text-lg">
        Welcome to the Faculty of Computing and Mathematical Sciences Conference
      </div>
      <div className="p-4 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          The Faculty of Computing and Mathematical Sciences,{" "}
          <span className="font-semibold">Aliko Dangote University, Wudil</span>
          , proudly welcomes you to its Annual Conference on Computing and
          Applied Research. This event provides a platform for students, faculty
          members, and researchers to share ideas, present findings, and discuss
          emerging trends in the fields of computing and mathematics.
        </p>

        <p>
          The conference will be held from{" "}
          <span className="font-semibold">June 10–14, 2025</span> at the
          University’s Main Auditorium. Core conference days are{" "}
          <span className="font-semibold">
            Wednesday June 11 to Friday June 13
          </span>
          .
        </p>

        <p>
          This page serves as an information hub for all participants. Details
          of accepted papers and the digital proceedings will be made available
          here after the conference.
        </p>

        <p>
          Registration begins at{" "}
          <span className="font-semibold">
            8:00 a.m. on Tuesday June 10, 2025
          </span>{" "}
          at the Faculty of Computing registration desk located on the first
          floor of the ICT Complex. The desk will open daily at 8:00 a.m. and
          close by 5:30 p.m.
        </p>

        <p>
          The conference brings together scholars, practitioners, and students
          to exchange knowledge, explore innovations, and promote collaboration
          in advancing computing and mathematical sciences within the region and
          beyond.
        </p>

        <p>
          We look forward to your participation and contribution toward making
          this year’s conference a remarkable success.
        </p>
      </div>
    </div>
  );
}

function KeyPages() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Key Pages:</h2>

      <div className="space-y-2">
        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Conference Program (Filter by Day, Session, and Activity)
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Links to Key Conference Sessions
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            My Schedule
          </a>
          <span className="text-sm text-gray-600">
            (if you have selected activities)
          </span>
        </p>

        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Social Media Updates
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Guidelines for Presenters
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Virtual Participation
          </a>
        </p>

        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Registration Information
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Getting Around Wudil
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Conference Policies
          </a>
        </p>
      </div>

      <p className="text-sm text-gray-700 mt-3">
        Use the navigation menus above to explore more resources, updates, and
        important information about the Faculty Conference at Aliko Dangote
        University, Wudil.
      </p>
    </div>
  );
}

// Latest News
function LatestNews() {
  const news = [
    {
      date: "Mon 12 May 2025",
      author: "Conference Secretariat",
      title: "Conference Keynote Presentations Now Available",
      desc: "Videos of keynote presentations from the Faculty of Computing and Mathematical Sciences Annual Conference are now available on our official YouTube channel. Other session recordings will be uploaded in the coming weeks.",
    },
    {
      date: "Fri 9 May 2025",
      author: "Local Organizing Committee",
      title: "Conference 2025 Wrap-up",
      desc: "The 2025 Faculty Conference at Aliko Dangote University, Wudil concluded successfully with a rich program of paper presentations, workshops, and keynote lectures. Participants engaged in thought-provoking discussions on computing, AI, and applied mathematics.",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-3 font-semibold text-lg">Latest News</div>
      <div className="p-4 space-y-4">
        {news.map((item, index) => (
          <div key={index} className="text-gray-700 text-sm">
            <p className="text-xs text-gray-500">
              {item.date} by {item.author}
            </p>
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-sm">{item.desc}</p>
            <a href="#" className="text-blue-600 hover:underline text-xs">
              read full article
            </a>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          All News Articles
        </a>
      </div>
    </div>
  );
}

/* ---------------- RIGHT CARDS ---------------- */
function TracksCard() {
  const tracks = [
    "Opening Plenary Sessions",
    "Keynote Addresses",
    "Research Paper Presentations",
    "Student Research Track",
    "Postgraduate Symposium",
    "Workshops on Emerging Technologies",
    "Panel Discussions",
    "Poster Sessions",
    "Mathematical Modelling and Applied Sciences",
    "Artificial Intelligence and Data Science",
    "Software Engineering and Information Systems",
    "Cybersecurity and Networks",
    "Mathematics Education",
    "Tutorials and Technical Sessions",
    "Roundtable on Innovation and Entrepreneurship",
    "Community Engagement and Outreach Sessions",
    "Faculty–Industry Collaboration Track",
    "Student Innovation Challenge",
    "Closing Ceremony and Awards",
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        ADUW Faculty Conference Tracks 2025
      </div>

      {/* Tracks List */}
      <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {tracks.map((track, index) => (
          <p
            key={index}
            className="text-gray-700 text-sm border-b border-gray-200 pb-1 last:border-0"
          >
            {track}
          </p>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Show all tracks
        </a>
      </div>
    </div>
  );
}

function ImportantDatesCard() {
  const dates = [
    { date: "Mon 10 Mar 2025", event: "Paper Submission Deadline" },
    { date: "Mon 14 Apr 2025", event: "Notification of Acceptance" },
    { date: "Mon 28 Apr 2025", event: "Camera-Ready Paper Submission" },
    { date: "Tue 6 May 2025", event: "Author Registration Deadline" },
    { date: "Tue 10 Jun 2025", event: "Conference Opening Ceremony" },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        Important Dates (Faculty Conference 2025)
      </div>

      {/* Dates List */}
      <div className="p-4 space-y-3">
        {dates.map((item, index) => (
          <div key={index} className="text-gray-700 text-sm">
            <p className="font-medium text-gray-900">{item.date}</p>
            <p>{item.event}</p>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View all important dates
        </a>
      </div>
    </div>
  );
}

function FeaturedNewsCard() {
  const news = [
    {
      title: "Keynote Talks Now Available Online",
      date: "Wed 14 May 2025",
    },
    {
      title: "2025 Faculty Conference Wrap-up",
      date: "Mon 12 May 2025",
    },
    {
      title: "Final Conference Program Released",
      date: "Mon 5 May 2025",
    },
    {
      title: "Early Registration Closes April 28",
      date: "Mon 28 Apr 2025",
    },
    {
      title: "Best Paper Awards Announced",
      date: "Fri 25 Apr 2025",
    },
    {
      title: "Workshops and Tutorials Confirmed",
      date: "Mon 14 Apr 2025",
    },
    {
      title: "Travel and Accommodation Guide Published",
      date: "Fri 4 Apr 2025",
    },
    {
      title: "Conference Call for Papers Extended",
      date: "Tue 11 Mar 2025",
    },
    {
      title: "Keynote Speakers Announced",
      date: "Mon 17 Feb 2025",
    },
    {
      title: "Call for Papers Opens for 2025 Faculty Conference",
      date: "Mon 6 Jan 2025",
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        Featured News
      </div>

      {/* News List */}
      <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
        {news.map((item, index) => (
          <div key={index} className="text-gray-700 text-sm">
            <p className="font-medium text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{item.date}</p>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          More news
        </a>
      </div>
    </div>
  );
}

function PostsCard() {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg flex items-center space-x-2">
        <i className="fab fa-facebook-square"></i>
        <span>Faculty Conference Posts</span>
      </div>

      {/* Facebook Page Section */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src="/post.jpeg"
            alt="Faculty Logo"
            className="w-10 h-10 rounded"
          />
          <div>
            <p className="font-semibold text-gray-900">
              ADUW Computing & Math Sciences Conference
            </p>
            <p className="text-sm text-gray-500">1.2K followers</p>
          </div>
          <button className="ml-auto bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
            Follow
          </button>
        </div>

        {/* Example Post */}
        <div className="border rounded-md overflow-hidden">
          <img src="/s2.jpeg" alt="Conference Banner" className="w-full" />
          <div className="p-3 text-gray-700 text-sm">
            <p className="font-medium text-gray-900">Call for Papers</p>
            <p>
              Submit your research papers for the 2025 Faculty Conference at
              Aliko Dangote University, Wudil. Deadline: 10 March 2025.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View more posts
        </a>
      </div>
    </div>
  );
}

function SupportersCard() {
  const supporters = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.png",
    "/7.png",
    "/8.png",
    "/9.png",
    "/10.png",
    "/11.png",
    "/12.png",
    "/13.png",
    "/14.png",
    "/15.png",
    "/16.png",
  ]; // adjust paths to match your public folder

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        Supporters
      </div>

      {/* Logos Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 place-items-center">
        {supporters.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Supporter ${index + 1}`}
            className="max-h-12 object-contain grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          All supporters
        </a>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Contact */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">
            ADUW Faculty Conference
          </h3>
          <p>Email: conference@aduw.edu.ng</p>
          <p>Phone: +234 701 234 5678</p>
          <p>Aliko Dangote University, Wudil, Kano State, Nigeria</p>
        </div>

        {/* Tracks */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Tracks</h3>
          <ul className="space-y-1">
            <li>Artificial Intelligence</li>
            <li>Data Science & Analytics</li>
            <li>Cybersecurity & Networks</li>
            <li>Mathematical Modelling</li>
          </ul>
        </div>

        {/* Co-hosted */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">
            Co-located Events
          </h3>
          <ul className="space-y-1">
            <li>Student Innovation Challenge</li>
            <li>Workshops & Tutorials</li>
            <li>Postgraduate Symposium</li>
          </ul>
        </div>

        {/* Attending */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Attending</h3>
          <ul className="space-y-1">
            <li>Registration</li>
            <li>Venue Information</li>
            <li>Travel & Accommodation</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Follow Us</h3>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-white">
              Facebook
            </a>
            <a href="#" className="hover:text-white">
              Twitter (X)
            </a>
            <a href="#" className="hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

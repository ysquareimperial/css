import { useState } from "react";
import { Menu, Search, ChevronDown, X } from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// Import images at the top of your file
import s1 from "../assets/s1.JPG";
import s2 from "../assets/s2.JPEG";
import s3 from "../assets/s3.JPEG";
import s4 from "../assets/s4.JPEG";
import s5 from "../assets/s5.JPEG";
import s6 from "../assets/s6.JPEG";
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
        "Venue: Rogers Centre, Ottawa (formerly Shaw Centre)",
        "Venue: Offsite Special Venue",
        "Reception venue: National Arts Centre",
        "Registration",
        "Virtual Attendance",
        "Presenting at ICSE 2025",
        "Food at ICSE2025",
        "Fun Activities",
        "Social media",
        "Hotels",
        "Getting Around Ottawa",
        "Visa and Travel Authorization",
        "Travelling to Ottawa",
        "Travel Support",
        "Code of Conduct",
        "Equity, Diversity, and Inclusion",
        "Sustainability",
        "FAQ",
      ],
    },
    {
      label: "Sponsors",
      options: [
        "ICSE 2025 Sponsors",
        "IEEE Computer Society and TCSE",
        "ACM and SIGSOFT",
        "University of Ottawa",
        "Carleton University",
        "IBM",
        "Elsevier",
        "Applying to Be a Sponsor of ICSE 2025",
      ],
    },
    {
      label: "Program",
      options: [
        "ICSE Program",
        " Your Program",
        "Proceedings",
        "Program Overview",
        "Keynotes",
        "Panels",
        "Tutorials",
        "Technical Briefings",
        "Meetings and BOF events",
        "Receptions and Banquet",
        "Networking Events",
        "Recreational Activities",
        "SWEBOK Summit",
        "CyBOK BOF",
        "IEEE TSE 50th Anniversary",
        "EU Horizon Program Session",
        "Filter by Day",
      ],
    },
    {
      label: "Tracks",
      options: [
        "Main Plenaries",
        "Panels and Special Sessions",
        "Research Track",
        "SE In Practice (SEIP)",
        "SE in Society (SEIS)",
        "New Ideas and Emerging Results (NIER)",
        "Journal-first Papers",
        "Demonstrations",
        "Artifact Evaluation",
        "Industry Challenge Track",
        "Software Engineering Education",
        "Posters",
        "Doctoral Symposium",
        "Shadow PC",
        "Workshops",
        "Tutorials and Technical Briefings",
        "New Faculty Symposium",
        "Symposium on Software Engineering in the Global South (SEiGS)",
        "SRC - ACM Student Research Competition",
        "Social, Networking and Special Rooms",
        "Meetings and BOFs",
        "Student Mentoring Workshop (SMeW)",
        "Student Volunteers",
      ],
    },
    {
      label: "Organization",
      options: [
        "ICSE Steering Committee",
        "ICSE 2025 Committees",
        "Organizing Committee",
        "Track Committees",
        "Research Track",
        "SE In Practice (SEIP)",
        "SE in Society (SEIS)",
        "New Ideas and Emerging Results (NIER)",
        "Journal-first Papers",
        "Demonstrations",
        "Artifact Evaluation",
        "Industry Challenge Track",
        "Posters",
        "Doctoral Symposium",
        "Shadow PC",
        "Workshops",
        "Tutorials and Technical Briefings",
        "New Faculty Symposium",
        "Symposium on Software Engineering in the Global South (SEiGS)",
        "SRC - ACM Student Research Competition",
        "Student Mentoring Workshop (SMeW)",
        "Student Volunteers",
      ],
    },
    {
      label: "Series",
      options: [
        "Series",
        "ICSE 2026",
        "ICSE 2025",
        "ICSE 2024",
        "ICSE 2023",
        "ICSE 2022",
        "ICSE 2021",
        "ICSE 2020",
        "ICSE 2019",
        "ICSE 2018",
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
            <img src='https://res.cloudinary.com/dx5ilizca/image/upload/v1758417637/logo_s3nzhd.png' alt="ICSE 2025" className="h-10 w-auto" />
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
      img: s1,
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
      <div className=" px-4 py-3 font-semibold text-lg">
        Welcome to ICSE 2025
      </div>
      <div className="p-4 space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          ICSE, the IEEE/ACM International Conference on Software Engineering,
          is the premier software engineering conference. It was held April
          27–May 3 2025 in Ottawa. Core conference days were Wednesday April 30
          to Friday May 2.
        </p>
        <p>
          This page is for the historical record. The proceedings are available
          here.
        </p>
        <p>See you all in 2026 in Rio.</p>
        <p>
          2025 marks the 50th anniversary of ICSE, which was first held in 1975!
        </p>
        <p>
          If you are registered, pick up your badge and envelope at the
          registration desk which opens at 8 a.m. Sunday April 27th in the RCC
          area of the second floor of the Rogers Centre. It will open at 8 a.m.
          every morning throughout the conference, except Wednesday April 30th
          when it will open at 7:30 a.m.. It will remain open until about 5:30
          most days. If you are not registered yet, you can register online or
          in person at the registration desk.
        </p>
        <p>
          ICSE provides a forum where researchers, practitioners, and educators
          gather together to present and discuss research results, innovations,
          trends, experiences and issues in the field of software engineering.
        </p>
      </div>
    </div>
  );
}

function KeyPages() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Key pages:</h2>

      <div className="space-y-2">
        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Program Filterable by Day, Room and Activity
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Links to Key Program Elements
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Your Program
          </a>
          <span className="text-sm text-gray-600">
            (if you have selected choices)
          </span>
        </p>

        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Social Media
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Presenting
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Virtual Attendance
          </a>
        </p>

        <p className="flex flex-wrap gap-x-3">
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Registration
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Getting around Ottawa
          </a>
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            Sustainability
          </a>
        </p>
      </div>

      <p className="text-sm text-gray-700 mt-3">
        Browse the menus above for many other useful pages.
      </p>
    </div>
  );
}

// Latest News
function LatestNews() {
  const news = [
    {
      date: "Wed 7 May 2025",
      author: "Timothy Lethbridge",
      title: "ICSE Keynote talks are on our Youtube Channel",
      desc: "Videos of ICSE2025 keynote presentations are now on our YouTube Channel! Other session videos will follow in the coming weeks, as we receive requests.",
    },
    {
      date: "Thu 1 May 2025",
      author: "Christian Cabrera",
      title: "SEAMS 2025 Wrap-up",
      desc: "We had a fantastic SEAMS 2025 in Ottawa with a high-quality program comprising eleven long, six short, and two artifact papers, two outstanding keynotes, and a highly interactive panel on self-adaptive systems and AI.",
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
    "Main Plenaries",
    "Panels and Special Sessions",
    "Research Track",
    "Software Engineering in Practice (SEIP)",
    "Software Engineering in Society (SEIS)",
    "New Ideas and Emerging Results (NIER)",
    "Journal-first Papers",
    "Demonstrations",
    "Artifact Evaluation",
    "Industry Challenge Track",
    "Software Engineering Education",
    "Posters",
    "Doctoral Symposium",
    "Shadow Research Track Program Committee",
    "Workshops",
    "Tutorials and Technical Briefings",
    "New Faculty Symposium",
    "Symposium on Software Engineering in the Global South (SEiGS)",
    "SRC - ACM Student Research Competition",
    "Social, Networking and Special Rooms",
    "Meetings and BOFs",
    "Student Mentoring Workshop (SMeW)",
    "Student Volunteers",
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        ICSE 2025 Tracks
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
    { date: "Mon 20 Oct 2025", event: "SESoS Paper submission" },
    { date: "Mon 24 Nov 2025", event: "SESoS Notification of acceptance" },
    { date: "Mon 8 Dec 2025", event: "SESoS Camera-ready copies" },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold text-lg">
        Important Dates up till Mon 8 Dec 2025
      </div>

      {/* Dates List */}
      <div className="p-4 space-y-3">
        {dates.map((item, index) => (
          <div key={index} className="text-gray-700 text-sm">
            <p className="font-medium text-gray-900">{item.date}</p>
            <p className="">{item.event}</p>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="px-4 py-2 bg-gray-50 text-right">
        <a
          href="#"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          All important dates
        </a>
      </div>
    </div>
  );
}

function FeaturedNewsCard() {
  const news = [
    {
      title: "ICSE Keynote talks are on our Youtube Channel",
      date: "Wed 7 May 2025",
    },
    { title: "SEAMS 2025 Wrap-up", date: "Thu 1 May 2025" },
    { title: "ICSE2025 Program is now Final!", date: "Thu 10 Apr 2025" },
    {
      title: "Last chance for most ICSE hotels is March 25th!",
      date: "Fri 21 Mar 2025",
    },
    {
      title:
        "Ten authors to share the N-10 best paper award for their 2015 ICSE paper on Android Privacy Leaks",
      date: "Fri 21 Feb 2025",
    },
    { title: "SWEBOK Summit to be held at ICSE 2025", date: "Fri 31 Jan 2025" },
    { title: "Travel information for ICSE 2025", date: "Sat 18 Jan 2025" },
    { title: "Tutorials for ICSE 2025 are announced", date: "Fri 8 Nov 2024" },
    { title: "Keynote Speakers Confirmed!", date: "Tue 3 Sep 2024" },
    {
      title:
        "CHASE 2025 Keynotes announced: Prof Margaret-Ann Storey and Prof Alexander Serebrenik will be giving two exciting keynotes at CHASE 2025",
      date: "Sun 5 May 2024",
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
        <span>Posts</span>
      </div>

      {/* Facebook Page Section */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img src="/post.png" alt="ICSE Logo" className="w-10 h-10 rounded" />
          <div>
            <p className="font-semibold text-gray-900">ICSE Conferences</p>
            <p className="text-sm text-gray-500">2.8K followers</p>
          </div>
          <button className="ml-auto bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700">
            Follow Page
          </button>
        </div>

        {/* Example Post */}
        <div className="border rounded-md overflow-hidden">
          <img src="/banner.png" alt="Post Banner" className="w-full" />
          <div className="p-3 text-gray-700 text-sm">
            <p className="font-medium text-gray-900">Call for Demonstrations</p>
            <p>Call for Tutorials and Technical Briefings</p>
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
          <h3 className="text-lg font-bold mb-2 text-white">Conference</h3>
          <p>Email: info@conference.org</p>
          <p>Phone: +123 456 789</p>
        </div>

        {/* Tracks */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Tracks</h3>
          <ul className="space-y-1">
            <li>AI</li>
            <li>Data Science</li>
            <li>Cybersecurity</li>
          </ul>
        </div>

        {/* Cohosted */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">
            Co-hosted Conferences
          </h3>
          <ul className="space-y-1">
            <li>Workshop A</li>
            <li>Workshop B</li>
          </ul>
        </div>

        {/* Attending */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">Attending</h3>
          <ul className="space-y-1">
            <li>Registration</li>
            <li>Venue</li>
            <li>Travel Info</li>
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
              Twitter
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

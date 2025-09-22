import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const ImageGallery = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: "/s1.jpg",
      title: "Call for Papers",
      subtitle: "Submit your research papers for the 2025 Faculty Conference at Aliko Dangote University, Wudil.",
      cta: "Submit Now"
    },
    {
      id: 2,
      image: "s2.jpeg",
      title: "Keynote Speakers",
      subtitle: "Renowned scholars in Computing and Mathematical Sciences will share their insights.",
      cta: "View Keynotes"
    },
    {
      id: 3,
      image: "/s3.jpeg",
      title: "Workshops & Tutorials",
      subtitle: "Hands-on sessions on Artificial Intelligence, Data Science, and Cybersecurity.",
      cta: "Join a Workshop"
    },
    {
      id: 4,
      image: "s4.jpeg",
      title: "Networking & Collaboration",
      subtitle: "Engage with faculty, industry, and fellow researchers to build future opportunities.",
      cta: "Connect Now"
    },
    {
      id: 5,
      image: "/s5.jpeg",
      title: "Student Research Showcase",
      subtitle: "Undergraduate and postgraduate students present innovative projects in Computing.",
      cta: "Explore Projects"
    },
    {
      id: 6,
      image: "/s6.jpeg",
      title: "Panel Discussions",
      subtitle: "Experts debate on the future of technology, ethics, and the role of AI in society.",
      cta: "Join the Discussion"
    },
    {
      id: 7,
      image: "/s2.jpeg",
      title: "Industry Collaboration",
      subtitle: "Partnership opportunities with leading tech companies and startups.",
      cta: "Partner With Us"
    },
    {
      id: 8,
      image: "/s3.jpeg",
      title: "Closing Ceremony",
      subtitle: "Celebrate achievements, award winners, and key takeaways from the conference.",
      cta: "View Highlights"
    }
  ];


  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => setCurrentSlide(index);

  const toggleAutoPlay = () => setIsAutoPlaying((prev) => !prev);

  return (
    <div className="relative w-full h-screen overflow-hidden group">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div> */}
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white px-6 max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-1xl mb-8 opacity-90">
            {slides[currentSlide].subtitle}
          </p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-md hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            {slides[currentSlide].cta}
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>

      {/* Auto-play Control */}
      <button
        onClick={toggleAutoPlay}
        className="absolute top-6 right-6 bg-black bg-opacity-40 hover:bg-opacity-60 rounded-full p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 z-30"
      >
        {isAutoPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20 z-30">
        <div
          className={`h-full bg-white ${
            isAutoPlaying ? "animate-[progress_4s_linear_infinite]" : "w-0"
          }`}
        />
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;

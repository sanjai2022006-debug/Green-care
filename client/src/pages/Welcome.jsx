import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const quotes = [
  "🌱 To plant a garden is to believe in tomorrow.",
  "🌿 Every plant is a soul blossoming in nature.",
  "💧 Water your plants and your dreams.",
  "🌞 Grow through what you go through.",
  "🍃 A little dirt never hurt anyone.",
  "🌼 Bloom where you are planted.",
];

const Welcome = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick random quote
    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);

    // Redirect after 3.5 seconds
    const timer = setTimeout(() => {
      navigate("/feed");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-300 to-green-500 text-white">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-6 animate-pulse">
          🌿 Welcome to GreenCare
        </h1>

        <p className="text-xl italic max-w-xl mx-auto">
          {quote}
        </p>

        <p className="mt-6 text-sm opacity-80">
          Redirecting to your garden...
        </p>
      </div>
    </div>
  );
};

export default Welcome;
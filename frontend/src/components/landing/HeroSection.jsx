import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Safe commuting decisions powered by real-world evidence.
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          SafeCommute helps employees prove unsafe travel conditions and helps
          managers make fair Work From Home decisions using location, weather,
          traffic, and risk analysis.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition shadow-sm"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
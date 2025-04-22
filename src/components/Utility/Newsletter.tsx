import React from "react";

const Newsletter = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-900 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white tracking-wide">
          Join Our Newsletter
        </h2>
        <p className="text-lg mb-8 text-gray-300 max-w-md mx-auto">
          Stay updated with the latest deals and exclusive offers. We respect
          your privacy.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-80 transition-all duration-300"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;

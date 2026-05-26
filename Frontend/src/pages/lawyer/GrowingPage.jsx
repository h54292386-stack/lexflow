import Footer from "../../components/Footer.jsx";

export default function GrowingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">

      <section className="flex-1 flex items-center justify-center px-6 py-20">
        
        <div className="w-full max-w-7xl bg-[#d8bf4a] rounded-[30px] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl min-h-[600px]">

          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Growing Your Practice
            </h1>

            <p className="mt-6 text-white/90 text-lg leading-relaxed">
              You’ve successfully handled 137 cases with a
              4.7 rating. Keep up the excellent work!
            </p>

            <button className="mt-10 bg-white text-[#d8bf4a] px-8 py-4 rounded-2xl font-semibold shadow-md hover:scale-105 hover:shadow-xl transition duration-300">
              Your Performance Overview →
            </button>
          </div>

          {/* RIGHT STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">

            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition duration-300">
              <h2 className="text-5xl font-bold text-white">
                137
              </h2>

              <p className="mt-3 text-white/90 text-lg font-medium">
                Cases Completed
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition duration-300">
              <h2 className="text-5xl font-bold text-white">
                4.7
              </h2>

              <p className="mt-3 text-white/90 text-lg font-medium">
                Client Rating
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition duration-300">
              <h2 className="text-5xl font-bold text-white">
                98%
              </h2>

              <p className="mt-3 text-white/90 text-lg font-medium">
                Success Rate
              </p>
            </div>

            <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:-translate-y-1 transition duration-300">
              <h2 className="text-5xl font-bold text-white">
                ₹300k
              </h2>

              <p className="mt-3 text-white/90 text-lg font-medium">
                Total Earned
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
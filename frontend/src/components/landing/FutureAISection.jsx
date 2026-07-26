const upcoming = ['AI flood detection', 'AI image verification', 'Fake image detection', 'Smart recommendations'];

export default function FutureAISection() {
  return (
    <section className="py-16 px-6 bg-primary-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm font-semibold text-primary-300 mb-2">COMING SOON</p>
        <h2 className="text-2xl font-bold mb-8">Future AI Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcoming.map((item) => (
            <div key={item} className="p-4 rounded-xl bg-white/10 border border-white/10">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
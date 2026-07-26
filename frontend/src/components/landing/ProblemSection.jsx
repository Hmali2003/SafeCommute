export default function ProblemSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-primary-700 mb-2">EMPLOYEE</p>
          <p className="text-xl text-gray-800 italic">
            "Why do I have to prove my safety?"
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="text-sm font-semibold text-primary-700 mb-2">MANAGER</p>
          <p className="text-xl text-gray-800 italic">
            "How do I know the situation is real?"
          </p>
        </div>
      </div>
    </section>
  );
}
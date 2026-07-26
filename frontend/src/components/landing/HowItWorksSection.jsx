const steps = [
  'Employee submits WFH request',
  'GPS location verification',
  'Weather and traffic analysis',
  'Risk score calculation',
  'Manager receives recommendation',
  'Approve or reject decision',
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          How It Works
        </h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold shrink-0">
                {i + 1}
              </div>
              <p className="text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
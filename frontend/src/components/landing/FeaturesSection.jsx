import Card from '../common/Card';

const features = [
  { icon: '📍', title: 'GPS Verification', description: 'Real-time location capture to confirm where the request originates.' },
  { icon: '🌧', title: 'Weather Monitoring', description: 'Live weather data automatically pulled for the employee\'s location.' },
  { icon: '🚦', title: 'Traffic Analysis', description: 'Traffic conditions factored into the overall safety picture.' },
  { icon: '📷', title: 'Road Evidence Upload', description: 'Photo evidence of unsafe road or travel conditions.' },
  { icon: '📊', title: 'Safety Risk Score', description: 'A 0–100 score combining all evidence into one clear number.' },
  { icon: '📧', title: 'Notifications', description: 'Automatic email updates the moment a decision is made.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          Everything you need to make the call
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
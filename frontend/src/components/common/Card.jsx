export default function Card({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
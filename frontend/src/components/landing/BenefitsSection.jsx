const employeeBenefits = ['Easy WFH requests', 'Safety-focused decisions', 'Transparent process'];
const managerBenefits = ['Evidence-based decisions', 'Less confusion', 'Request history', 'Better planning'];

export default function BenefitsSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">For Employees</h3>
          <ul className="space-y-3">
            {employeeBenefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-gray-700">
                <span className="text-success-600">✓</span> {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">For Managers</h3>
          <ul className="space-y-3">
            {managerBenefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-gray-700">
                <span className="text-success-600">✓</span> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
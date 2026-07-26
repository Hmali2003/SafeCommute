export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">SafeCommute</h3>
          <p className="text-sm text-gray-400">
            Evidence-based WFH decisions for safer teams.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">About</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Project</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">GitHub</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SafeCommute. Built as a student capstone project.
      </div>
    </footer>
  );
}
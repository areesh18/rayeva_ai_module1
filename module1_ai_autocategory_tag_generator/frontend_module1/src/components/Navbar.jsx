import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav style={{ backgroundColor: '#FAFAF7' }}
      className="border-b border-stone-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#1C3A2A' }}>
          <span className="text-white text-xs">✦</span>
        </div>
        <span className="font-display font-600 text-lg tracking-tight"
          style={{ color: '#1C3A2A' }}>
          Rayeva
          <span className="font-300 ml-1" style={{ color: '#6B8F71' }}>AI</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        {[
          { path: "/", label: "Catalog" },
          { path: "/analyze", label: "Analyze" },
          { path: "/logs", label: "AI Logs" },
        ].map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: isActive(path) ? '#1C3A2A' : 'transparent',
              color: isActive(path) ? '#FAFAF7' : '#4B6B55',
            }}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
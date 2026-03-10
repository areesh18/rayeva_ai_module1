import { useState } from "react";

export default function Analyze() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!description.trim()) { setError("Description is required."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-14" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{ color: '#6B8F71' }}>
            ✦ AI-Powered
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight mb-3"
            style={{ color: '#1C3A2A' }}>
            Analyze Product
          </h1>
          <p className="text-base" style={{ color: '#6B7280' }}>
            Describe your product and let AI assign categories, tags, and sustainability filters instantly.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl p-8 border animate-fade-up-delay-1"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(28,58,42,0.06)' }}>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Product Name <span style={{ color: '#9CA3AF' }}>(optional)</span>
            </label>
            <input
              placeholder="e.g. Bamboo Toothbrush"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                backgroundColor: '#F9FAFB',
                border: '1.5px solid #E5E7EB',
                color: '#1C3A2A',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1C3A2A'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
              Product Description <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <textarea
              placeholder="Describe materials, packaging, certifications, and sustainability features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 resize-none"
              style={{
                backgroundColor: '#F9FAFB',
                border: '1.5px solid #E5E7EB',
                color: '#1C3A2A',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={(e) => e.target.style.borderColor = '#1C3A2A'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: loading ? '#6B8F71' : '#1C3A2A',
              color: '#FAFAF7',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing product...
              </span>
            ) : "Analyze Product →"}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl px-4 py-3 text-sm animate-fade-up"
            style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}>
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 animate-fade-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#DCFCE7' }}>
                <span className="text-xs" style={{ color: '#16A34A' }}>✓</span>
              </div>
              <p className="text-sm font-medium" style={{ color: '#16A34A' }}>
                Saved to catalog
              </p>
              <span className="text-xs ml-auto" style={{ color: '#9CA3AF' }}>{result.created_at}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="rounded-xl p-4 border"
                style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: '#6B8F71' }}>Primary Category</p>
                <p className="font-display text-lg font-semibold" style={{ color: '#1C3A2A' }}>
                  {result.primary_category}
                </p>
              </div>
              <div className="rounded-xl p-4 border"
                style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                <p className="text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: '#92400E' }}>Sub Category</p>
                <p className="font-display text-lg font-semibold" style={{ color: '#1C3A2A' }}>
                  {result.sub_category}
                </p>
              </div>
            </div>

            <div className="rounded-xl p-4 border mb-3"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
              <p className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: '#6B7280' }}>SEO Tags</p>
              <div className="flex flex-wrap gap-2">
                {result.seo_tags.map((tag) => (
                  <span key={tag}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-4 border"
              style={{ backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
              <p className="text-xs font-medium uppercase tracking-wider mb-3"
                style={{ color: '#6B8F71' }}>Sustainability Filters</p>
              <div className="flex flex-wrap gap-2">
                {result.sustainability_filters.map((f) => (
                  <span key={f}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0' }}>
                    ♻ {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
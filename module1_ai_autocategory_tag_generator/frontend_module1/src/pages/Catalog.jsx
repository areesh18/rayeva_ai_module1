import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const CATEGORIES = [
  "All", "Personal Care", "Kitchen & Dining", "Home & Living",
  "Fashion & Apparel", "Baby & Kids", "Office & Stationery",
  "Food & Beverages", "Garden & Outdoors", "Pet Care", "Travel & Accessories",
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products").select("*").order("id", { ascending: false });
      if (!error) {
        setProducts(data);
        let result = data;
        if (activeCategory !== "All") result = result.filter((p) => p.primary_category === activeCategory);
        if (search.trim()) result = result.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.seo_tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        );
        setFiltered(result);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen px-6 py-14" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#6B8F71' }}>
            ✦ Product Intelligence
          </p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl font-semibold" style={{ color: '#1C3A2A' }}>
              Product Catalog
            </h1>
            <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
              {products.length} products indexed
            </p>
          </div>
          <div className="mt-3 h-px" style={{ backgroundColor: '#E5E7EB' }} />
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-fade-up-delay-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">⌕</span>
          <input
            placeholder="Search by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              color: '#1C3A2A',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onFocus={(e) => e.target.style.borderColor = '#1C3A2A'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-up-delay-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: activeCategory === cat ? '#1C3A2A' : '#FFFFFF',
                color: activeCategory === cat ? '#FAFAF7' : '#6B7280',
                border: `1.5px solid ${activeCategory === cat ? '#1C3A2A' : '#E5E7EB'}`,
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#9CA3AF' }}>
            <div className="inline-block w-6 h-6 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl mb-2" style={{ color: '#1C3A2A' }}>No products found</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden animate-fade-up-delay-2"
            style={{ borderColor: '#E5E7EB', boxShadow: '0 1px 3px rgba(28,58,42,0.06)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  {['Name', 'Category', 'Sub Category', 'SEO Tags', 'Sustainability', 'Saved At'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#6B7280' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id}
                    onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                    className="cursor-pointer transition-colors duration-150"
                    style={{
                      backgroundColor: expandedRow === p.id ? '#F0FDF4' : (i % 2 === 0 ? '#FFFFFF' : '#FAFAF7'),
                      borderBottom: '1px solid #F3F4F6',
                    }}
                    onMouseEnter={(e) => { if (expandedRow !== p.id) e.currentTarget.style.backgroundColor = '#F9FAFB' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = expandedRow === p.id ? '#F0FDF4' : (i % 2 === 0 ? '#FFFFFF' : '#FAFAF7') }}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-sm" style={{ color: '#1C3A2A' }}>{p.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: '#F0FDF4', color: '#166534' }}>
                        {p.primary_category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: '#6B7280' }}>
                      {p.sub_category}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(expandedRow === p.id ? p.seo_tags : p.seo_tags.slice(0, 2)).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                            #{tag}
                          </span>
                        ))}
                        {expandedRow !== p.id && p.seo_tags.length > 2 && (
                          <span className="text-xs font-medium" style={{ color: '#1C3A2A' }}>
                            +{p.seo_tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.sustainability_filters.slice(0, 2).map((f) => (
                          <span key={f} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                            {f}
                          </span>
                        ))}
                        {p.sustainability_filters.length > 2 && (
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>
                            +{p.sustainability_filters.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: '#9CA3AF' }}>
                      {p.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
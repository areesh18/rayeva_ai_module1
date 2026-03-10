import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("ai_logs").select("*").order("id", { ascending: false });
      if (!error) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen px-6 py-14" style={{ backgroundColor: '#FAFAF7' }}>
      <div className="max-w-4xl mx-auto">

        <div className="mb-10 animate-fade-up">
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#6B8F71' }}>
            ✦ Audit Trail
          </p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-4xl font-semibold" style={{ color: '#1C3A2A' }}>
              AI Logs
            </h1>
            <p className="text-sm mb-1" style={{ color: '#9CA3AF' }}>
              {logs.length} interactions logged
            </p>
          </div>
          <div className="mt-3 h-px" style={{ backgroundColor: '#E5E7EB' }} />
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: '#9CA3AF' }}>
            <div className="inline-block w-6 h-6 border-2 border-stone-200 border-t-stone-400 rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading logs...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-up-delay-1">
            {logs.map((log) => (
              <div key={log.id}
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                className="rounded-2xl border cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: expandedLog === log.id ? '#1C3A2A' : '#E5E7EB',
                  boxShadow: expandedLog === log.id ? '0 4px 12px rgba(28,58,42,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                }}>

                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#F0FDF4', color: '#166534' }}>
                      #{log.id}
                    </span>
                    {log.response?.primary_category && (
                      <span className="text-sm font-medium" style={{ color: '#1C3A2A' }}>
                        {log.response.primary_category}
                      </span>
                    )}
                    {log.response?.sub_category && (
                      <span className="text-sm" style={{ color: '#6B7280' }}>
                        — {log.response.sub_category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>{log.created_at}</span>
                    <span className="text-xs" style={{ color: '#9CA3AF' }}>
                      {expandedLog === log.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Tags preview */}
                <div className="px-6 pb-4 flex flex-wrap gap-2">
                  {log.response?.sustainability_filters?.slice(0, 4).map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#DCFCE7', color: '#166534' }}>
                      ♻ {f}
                    </span>
                  ))}
                </div>

                {expandedLog === log.id && (
                  <div className="border-t mx-6 mb-6 pt-4" style={{ borderColor: '#F3F4F6' }}>
                    <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#FAFAF7' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: '#9CA3AF' }}>Prompt</p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: '#374151', fontFamily: 'DM Sans, sans-serif' }}>
                        {log.prompt}
                      </p>
                    </div>
                    <div className="rounded-xl p-4" style={{ backgroundColor: '#F0FDF4' }}>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: '#6B8F71' }}>Response</p>
                      <pre className="text-xs leading-relaxed overflow-x-auto"
                        style={{ color: '#166534', fontFamily: 'monospace' }}>
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
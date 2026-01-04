'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if(!query) return;
    setLoading(true);
    
    const res = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    
    setLoading(false);
    
    if (data.success && data.data) {
      // Encode data to pass to guidance page
      const params = new URLSearchParams({
        url: data.data.official_url,
        name: data.data.name
      });
      router.push(`/guide?${params.toString()}`);
    } else {
      alert("No matching service found in our demo database.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800">Saarthi AI</h1>
        <p className="text-gray-600">Your Government Service Assistant</p>
        
        <div className="space-y-4">
          <textarea
            className="w-full p-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:border-blue-600"
            rows={3}
            placeholder="Tell me what you need? (e.g., 'I want a driving license')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Asking Saarthi..." : "Find Service"}
          </button>
        </div>
      </div>
    </main>
  );
}
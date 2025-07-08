'use client';
import { useState } from 'react';
export default function Home() {
  const [inputType, setInputType] = useState<'blog' | 'video'>('blog');
  const [blogText, setBlogText] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('tone', tone);
    if (inputType === 'blog') {
      formData.append('blog', blogText);
    } else if (videoFile) {
      formData.append('video', videoFile);
    }
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };
  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-4">Content Repurposer</h1>
        <select
          value={inputType}
          onChange={(e) => setInputType(e.target.value as 'blog' | 'video')}
          className="mb-4 border p-2 rounded w-full"
        >
          <option value="blog">Blog Post</option>
          <option value="video">Video File</option>
        </select>
        {inputType === 'blog' ? (
          <textarea
            className="w-full h-40 p-2 border rounded mb-4"
            placeholder="Paste your blog post here..."
            value={blogText}
            onChange={(e) => setBlogText(e.target.value)}
          />
        ) : (
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="mb-4"
          />
        )}
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="mb-4 border p-2 rounded w-full"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="funny">Funny</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Generate Snippets'}
        </button>
        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="font-semibold">Tweet:</h2>
              <p>{result.tweet}</p>
            </div>
            <div>
              <h2 className="font-semibold">Instagram Caption:</h2>
              <p>{result.instagram}</p>
            </div>
            <div>
              <h2 className="font-semibold">TikTok Script:</h2>
              <p>{result.tiktok}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

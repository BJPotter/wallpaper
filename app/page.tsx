'use client';

import { useState } from 'react';
import axios from 'axios';

const styles = [
  { name: 'Anime', prompt: 'anime style, vibrant colors, detailed' },
  { name: 'Realistic', prompt: 'photorealistic, highly detailed, professional photography' },
  { name: 'Fantasy', prompt: 'fantasy art style, magical, ethereal' },
  { name: 'Abstract', prompt: 'abstract art, non-representational, colorful' },
];

const resolutions = [
  '512x512',
  '768x768',
  '1024x1024',
];

export default function Home() {
  const [content, setContent] = useState('');
  const [style, setStyle] = useState(styles[0]);
  const [resolution, setResolution] = useState(resolutions[0]);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/pages/api', { content, style: style.prompt, resolution });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setImage(`data:image/jpeg;base64,${response.data}`);
    } catch (error) {
      console.error('Error generating image:', error);
      if (error instanceof Error) {
        alert(`Failed to generate image: ${error.message}`);
      } else {
        alert('Failed to generate image. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = 'wallpaper.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex">
          {/* Left Column */}
          <div className="w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-4">AI Wallpaper Generator</h1>
            <p className="mb-4">Create personalized wallpapers with your own text or theme.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text or theme"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Style</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={style.name}
                onChange={(e) => setStyle(styles.find(s => s.name === e.target.value) || styles[0])}
              >
                {styles.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Resolution</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              >
                {resolutions.map((res) => (
                  <option key={res} value={res}>{res}</option>
                ))}
              </select>
            </div>

            <button
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Right Column */}
          <div className="w-1/2 bg-gray-100 p-6 flex flex-col justify-center items-center">
            {image ? (
              <>
                <img src={image} alt="Generated Wallpaper" className="max-w-full max-h-[400px] object-contain rounded-md shadow-lg" />
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No image generated</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by generating a new image.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
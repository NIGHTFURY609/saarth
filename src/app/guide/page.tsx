'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GuidePage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const name = searchParams.get('name');
  
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (name) {
      fetch('/api/guidance', {
        method: 'POST',
        body: JSON.stringify({ serviceName: name, language: 'English' })
      })
      .then(res => res.json())
      .then(data => setSteps(data.steps));
    }
  }, [name]);

  if (!url) return <div>Invalid URL</div>;

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">
      {/* 1. Header */}
      <div className="bg-blue-800 text-white p-2 text-center text-sm">
        Viewing: {name} | <span className="text-yellow-300">Demo Mode</span>
      </div>

      {/* 2. Iframe (The Official Site) */}
      <div className="flex-1 w-full relative">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          title="Government Service"
          // Note: sandbox attributes might be needed depending on the site, 
          // but strict sandboxing breaks navigation. Keep it open for demo.
        />
      </div>

      {/* 3. The Saarthi Overlay */}
      {steps.length > 0 && (
        <div className={`absolute bottom-0 left-0 right-0 bg-white border-t-4 border-blue-600 shadow-2xl transition-transform duration-300 ${minimized ? 'translate-y-[80%]' : ''}`}>
          
          {/* Controls */}
          <div className="flex justify-between items-center p-2 bg-blue-50 border-b">
            <h3 className="font-bold text-blue-800">Saarthi Guide</h3>
            <button onClick={() => setMinimized(!minimized)} className="text-sm text-gray-500">
              {minimized ? "▲ Expand" : "▼ Minimize"}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 text-center">
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                STEP {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6 leading-snug">
              {steps[currentStep]}
            </h2>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-gray-200 rounded-lg font-bold text-gray-600 disabled:opacity-50"
              >
                Back
              </button>
              
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next Step"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
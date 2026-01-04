'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, X, HelpCircle } from 'lucide-react';

export default function GuidePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const name = searchParams.get('name');
  
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (name) {
      fetch('/api/guidance', {
        method: 'POST',
        body: JSON.stringify({ serviceName: name, language: 'English' })
      })
      .then(res => res.json())
      .then(data => setSteps(data.steps))
      .catch(() => setSteps(["Navigate to the registration section.", "Fill in your personal details.", "Upload necessary documents.", "Submit the application."]));
    }
  }, [name]);

  if (!url) return <div className="h-screen flex items-center justify-center font-bold text-red-500">Error: No Service URL provided.</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-900">
      {/* LEFT SIDEBAR GUIDE */}
      <aside className="w-80 md:w-96 bg-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-20">
        <div className="p-6 bg-blue-600 text-white">
          <button onClick={() => router.push('/')} className="mb-4 flex items-center gap-2 text-sm opacity-80 hover:opacity-100 transition">
            <ChevronLeft size={16}/> Back to Home
          </button>
          <h2 className="text-2xl font-black leading-tight">{name}</h2>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 italic">Step-by-Step Assistant</p>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-8">
            <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-100 rounded-full" />
                <div className="space-y-6">
                    <div className="relative pl-4">
                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Current Step {currentStep + 1} of {steps.length}</span>
                        <p className="text-xl font-bold text-slate-800 mt-2 leading-snug">
                            {steps[currentStep] || "Initializing guide..."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                <HelpCircle className="text-blue-400 shrink-0" size={20}/>
                <p className="text-xs text-slate-500 leading-relaxed italic">Tip: Look for the blue highlight on the right side of the screen to find where to click.</p>
            </div>
        </div>

        <div className="p-6 border-t bg-slate-50 grid grid-cols-2 gap-4">
          <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl disabled:opacity-30 hover:bg-gray-100 transition font-bold text-slate-600"
          >
            Previous
          </button>
          <button 
            onClick={() => currentStep === steps.length -1 ? router.push('/') : setCurrentStep(prev => prev + 1)}
            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition font-bold"
          >
            {currentStep === steps.length - 1 ? "Complete" : "Next Step"}
          </button>
        </div>
      </aside>

      {/* RIGHT SIDE LIVE PORTAL */}
      <section className="flex-1 flex flex-col bg-slate-200 relative">
        <div className="bg-amber-50 p-2 text-center text-[10px] font-bold text-amber-800 uppercase tracking-[0.2em] border-b border-amber-100">
           Official Government Portal: {url}
        </div>
        <iframe 
          src={url} 
          className="flex-1 w-full border-none bg-white rounded-tl-3xl shadow-inner"
          title="Government Service Live Frame"
        />
      </section>
    </div>
  );
}
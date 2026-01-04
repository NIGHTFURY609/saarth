'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mic, Search, Info, Grid, CreditCard, 
  Car, HeartPulse, GraduationCap, ArrowRight,
  ShieldCheck, Smartphone, Globe, Lock, Mail, X, CheckCircle
} from 'lucide-react';

export default function SaarthiUnifiedApp() {
  const router = useRouter();
  
  // View State: 'home' | 'login' | 'services' | 'about'
  const [view, setView] = useState('home');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const CATEGORIES = [
    { 
      name: 'Identification', 
      icon: <CreditCard />, 
      services: [
        { name: 'Aadhar Card', url: 'https://uidai.gov.in/' }, 
        { name: 'PAN Card', url: 'https://www.pan.utiitsl.com/' }
      ] 
    },
    { 
      name: 'Transport', 
      icon: <Car />, 
      services: [
        { name: 'Driving License', url: 'https://sarathi.parivahan.gov.in/' }, 
        { name: 'Vehicle RC', url: 'https://vahan.parivahan.gov.in/' }
      ] 
    },
    { 
      name: 'Health', 
      icon: <HeartPulse />, 
      services: [{ name: 'Ayushman Bharat', url: 'https://pmjay.gov.in/' }] 
    },
    { 
      name: 'Education', 
      icon: <GraduationCap />, 
      services: [{ name: 'Scholarships', url: 'https://scholarships.gov.in/' }] 
    },
  ];

  const handleSearch = async (searchQuery = query) => {
    if(!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const params = new URLSearchParams({ url: data.data.official_url, name: data.data.name });
        router.push(`/guide?${params.toString()}`);
      } else {
        alert("Service not found. Try 'Aadhar' or 'License'.");
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search not supported in this browser.");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };
    recognition.start();
  };

  const Nav = () => (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
        <div className="bg-blue-600 p-1.5 rounded-lg"><Globe className="text-white" size={20} /></div>
        <h1 className="text-2xl font-bold text-blue-900 tracking-tighter">Saarthi AI</h1>
      </div>
      <div className="flex gap-6 font-semibold text-gray-600 items-center text-sm md:text-base">
        <button onClick={() => setView('services')} className="hover:text-blue-600">Services</button>
        <button onClick={() => setView('about')} className="hover:text-blue-600">About</button>
        <button onClick={() => setView('login')} className="bg-blue-600 text-white px-5 py-2 rounded-full hover:shadow-lg transition">Login</button>
      </div>
    </nav>
  );

  if (view === 'login') return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
      <Nav />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-2">Welcome</h2>
          <p className="text-slate-500 text-center mb-8">Login to save your application progress</p>
          <div className="space-y-4">
            <div className="relative"><Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/><input className="w-full pl-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email" /></div>
            <div className="relative"><Lock className="absolute left-3 top-3.5 text-slate-400" size={18}/><input className="w-full pl-10 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="Password" /></div>
            <button onClick={() => setView('home')} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === 'services') return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <Nav />
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Service Directory</h2>
        <p className="text-slate-500 mb-10">Select a category to explore available government portals.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-blue-600 font-bold text-lg border-b pb-4">
                {cat.icon} {cat.name}
              </div>
              <div className="space-y-3">
                {cat.services.map(s => (
                  <button key={s.name} onClick={() => router.push(`/guide?url=${s.url}&name=${s.name}`)} className="w-full text-left p-3 hover:bg-blue-50 text-slate-700 rounded-xl transition flex justify-between group">
                    {s.name} <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform"/>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (view === 'about') return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <Nav />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black text-slate-900">Empowering Every Citizen.</h2>
          <p className="text-xl text-slate-600">Saarthi AI is built to bridge the gap between complex government procedures and the common man.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Voice First", desc: "No typing required. Just tell Saarthi what you need.", icon: <Mic /> },
            { title: "Step-by-Step", desc: "Live guidance overlaid on official government sites.", icon: <CheckCircle /> },
            { title: "Multilingual", desc: "Breaking language barriers across India.", icon: <Globe /> }
          ].map(item => (
            <div key={item.title} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-blue-600 mb-4">{item.icon}</div>
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-900 p-10 rounded-3xl text-white flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold">Try Saarthi Today</h3>
                <p className="text-blue-100">Experience a hassle-free way to interact with the Digital India ecosystem.</p>
                <button onClick={() => setView('home')} className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold">Get Started</button>
            </div>
            <Smartphone size={120} className="text-blue-400 opacity-50"/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-3xl w-full text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
              <ShieldCheck size={16}/> Official Demo Version
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none">
                Your <span className="text-blue-600">Digital</span> <br/>Govt Assistant.
            </h2>
          </div>

          <div className="relative group shadow-2xl rounded-[2rem]">
            <textarea
              className="w-full p-8 pr-40 border-none rounded-[2rem] text-xl focus:ring-4 focus:ring-blue-100 outline-none resize-none bg-white min-h-[160px] placeholder:text-slate-300"
              placeholder="What do you need help with?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute right-6 bottom-6 flex gap-3">
              <button onClick={startVoiceSearch} className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-100 text-slate-600'}`}><Mic size={24} /></button>
              <button onClick={() => handleSearch()} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold flex items-center gap-2">
                {loading ? "..." : <><Search size={24} /> <span className="hidden md:block">Find Service</span></>}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-slate-400 font-medium">
             <span>Try searching:</span>
             <button onClick={() => {setQuery("Aadhar Card"); handleSearch("Aadhar Card")}} className="hover:text-blue-600 underline">Aadhar Card</button>
             <button onClick={() => {setQuery("Driving License"); handleSearch("Driving License")}} className="hover:text-blue-600 underline">Driving License</button>
          </div>
        </div>
      </main>
    </div>
  );
}
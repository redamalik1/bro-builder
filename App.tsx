import React, { useState, useRef, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import ChatWidget from './components/ChatWidget';
import { EXAMPLE_CARDS, SEO_CATEGORIES, STATS, LEMON_SQUEEZY_CHECKOUT_URL, SHOWCASE_APPS } from './constants';
import { generateAppCode, updateAppCode } from './services/geminiService';

const MAX_FREE_PREVIEWS = 5;

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  // Edit Mode State
  const [editInstruction, setEditInstruction] = useState('');

  // Paywall & Usage State
  const [state, setState] = useState({
    builds: parseInt(localStorage.getItem('builds') || '0'),
    paid: localStorage.getItem('paid') === 'true'
  });
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<'limit' | 'download'>('limit');
  const [showSuccess, setShowSuccess] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Check URL for successful payment callback
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' || params.get('checkout') === 'success') {
      localStorage.setItem('paid', 'true');
      setState(prev => ({ ...prev, paid: true }));
      setShowSuccess(true);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  // Initialize Lemon Squeezy when paywall shows
  useEffect(() => {
    if (showPaywall && (window as any).createLemonSqueezy) {
      (window as any).createLemonSqueezy();
    }
  }, [showPaywall]);

  // Logic Helpers
  const canPreview = () => {
    return state.paid || state.builds < MAX_FREE_PREVIEWS;
  };

  const usePreviewCount = () => {
    if (!state.paid) {
      const newBuilds = state.builds + 1;
      localStorage.setItem('builds', newBuilds.toString());
      setState(prev => ({ ...prev, builds: newBuilds }));
    }
  };

  const handleBuild = async () => {
    if (!prompt.trim()) return;

    // Check Logic
    if (!canPreview()) {
      setPaywallReason('limit');
      setShowPaywall(true);
      return;
    }
    
    // Increment counter
    usePreviewCount();
    
    setIsGenerating(true);
    setGeneratedCode(null); // Reset previous
    setEditInstruction(''); // Reset edit input
    
    // Scroll to preview placeholder
    setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const code = await generateAppCode(prompt);
    
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const handleUpdate = async () => {
    if (!editInstruction.trim() || !generatedCode) return;
    
    // Edits are free to keep them engaged
    setIsUpdating(true);
    const updated = await updateAppCode(generatedCode, editInstruction);
    setGeneratedCode(updated);
    setIsUpdating(false);
    setEditInstruction('');
  };

  const handleDownload = () => {
    // Check Logic: STRICTLY PAID ONLY
    if (!state.paid) {
        setPaywallReason('download');
        setShowPaywall(true);
        return;
    }

    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bro-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadShowcase = (showcasePrompt: string) => {
    setPrompt(showcasePrompt);
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const remainingFree = Math.max(0, MAX_FREE_PREVIEWS - state.builds);

  return (
    <div className="min-h-screen w-full relative font-sans text-gray-100 selection:bg-bro-pink selection:text-white">
      <StarBackground />

      {/* Usage Badge (Fixed Top Right) */}
      <div 
        className="fixed top-5 right-5 z-50 transition-all duration-500 shadow-lg px-5 py-2 rounded-full font-bold text-white flex items-center gap-2"
        style={{
          background: state.paid 
            ? 'linear-gradient(135deg,#06b6d4,#a855f7)' 
            : (remainingFree === 0 ? '#ef4444' : '#a855f7')
        }}
      >
         {state.paid ? (
             <>✨ PRO - UNLIMITED</>
         ) : (
             <>🔥 {remainingFree} FREE PREVIEWS LEFT</>
         )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] text-center p-8 rounded-2xl text-white shadow-2xl animate-pulse-glow" 
             style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: 'bold' }}>YOOO BRO! 🎉</h2>
            <p style={{ fontSize: '18px' }}>Payment successful! You got UNLIMITED access now! 💪</p>
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <div 
          id="paywall" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
           <div style={{
             background: 'linear-gradient(135deg,#1e1e2e,#2d1b3d)',
             padding: '40px',
             borderRadius: '20px',
             maxWidth: '500px',
             textAlign: 'center',
             border: '2px solid #a855f7',
             position: 'relative'
           }}>
              <button 
                onClick={() => setShowPaywall(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <h2 style={{ color: '#06b6d4', fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>
                {paywallReason === 'download' ? 'UNLOCK SOURCE CODE! 🔒' : 'YO BRO! 🔥 Limit Hit!'}
              </h2>
              <p style={{ color: '#fff', fontSize: '18px', marginBottom: '30px' }}>
                {paywallReason === 'download' 
                  ? <>Downloading source code is a <strong>PRO feature</strong>.<br/>Get full ownership for just <strong>$9.99</strong>!</>
                  : <>You used your <strong>5 FREE previews</strong>! <br />Get unlimited builds for just <strong>$9.99</strong> bro! 💪</>
                }
              </p>
              
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '30px',
                textAlign: 'left'
              }}>
                <div style={{ color: '#06b6d4', margin: '10px 0' }}>✅ Unlimited app builds</div>
                <div style={{ color: '#a855f7', margin: '10px 0' }}>✅ Unlimited downloads</div>
                <div style={{ color: '#ec4899', margin: '10px 0' }}>✅ Priority support</div>
                <div style={{ color: '#06b6d4', margin: '10px 0' }}>✅ Lifetime access</div>
              </div>
              
              <a 
                 href={`${LEMON_SQUEEZY_CHECKOUT_URL}?checkout[custom][user_id]=${Date.now()}`} 
                 className="lemonsqueezy-button"
                 style={{
                   display: 'inline-block',
                   background: 'linear-gradient(135deg,#06b6d4,#a855f7)',
                   color: '#fff',
                   padding: '15px 40px',
                   borderRadius: '10px',
                   fontSize: '20px',
                   fontWeight: 'bold',
                   textDecoration: 'none',
                   margin: '10px',
                   cursor: 'pointer'
                 }}
              >
                GET UNLIMITED FOR $9.99 🚀
              </a>
              
              <br/><br/>
              <button 
                onClick={() => setShowPaywall(false)} 
                style={{
                  background: 'transparent',
                  color: '#888',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Maybe Later
              </button>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center py-6 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.2)] animate-float pointer-events-auto text-center flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-bro-cyan via-bro-purple to-bro-pink tracking-tight">
                🚀 BRO BUILDER
              </h1>
            </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-20 max-w-6xl">
        
        {/* Main Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-pulse-glow">
            
            {/* Input Section */}
            <div className="mb-12">
                <textarea
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Yo fam! 🤜🤛 What's the master plan? Tell me to 'build a sick gym tracker', 'create a crypto dashboard', 'make a retro snake game', or 'code a portfolio'. Describe it fully and I'll cook it up FRESH & FIRE! 🔥🚀"
                    className="w-full h-40 bg-black/40 border border-gray-700 rounded-2xl p-6 text-lg md:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-bro-cyan focus:ring-2 focus:ring-bro-cyan/20 transition-all resize-none mb-6"
                />
                <button
                    onClick={handleBuild}
                    disabled={isGenerating || !prompt}
                    className={`w-full py-5 rounded-xl text-xl md:text-2xl font-bold uppercase tracking-wider shadow-lg transition-all transform hover:scale-[1.02] active:scale-95
                        ${isGenerating 
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                            : 'bg-gradient-to-r from-bro-cyan via-bro-purple to-bro-pink hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] text-white'
                        }`}
                >
                    {isGenerating ? (
                        <span className="flex items-center justify-center gap-3">
                            <i className="fa-solid fa-circle-notch fa-spin"></i> Hold up bro, cooking your app... 🔥
                        </span>
                    ) : (
                        "BUILD IT BRO! 🚀"
                    )}
                </button>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-10"></div>

            {/* Example Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {EXAMPLE_CARDS.slice(0, 8).map((card) => (
                    <div 
                        key={card.id}
                        onClick={() => setPrompt(card.prompt)}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-bro-purple/50 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{card.emoji}</div>
                        <h3 className="font-bold text-white mb-1">{card.title}</h3>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300">{card.description}</p>
                    </div>
                ))}
            </div>
             {/* Centered Last 2 Cards */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                {EXAMPLE_CARDS.slice(8, 10).map((card) => (
                    <div 
                        key={card.id}
                        onClick={() => setPrompt(card.prompt)}
                        className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-bro-purple/50 p-4 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    >
                         <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{card.emoji}</div>
                        <h3 className="font-bold text-white mb-1">{card.title}</h3>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Preview Section */}
        <div ref={previewRef} className="mt-20">
            {(isGenerating || generatedCode) && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-bro-cyan">
                            {isGenerating ? "👨‍🍳 Chef is cooking..." : "YOOO BRO! Check this out! 🎉"}
                        </h2>
                        {!isGenerating && generatedCode && (
                            <button 
                                onClick={handleDownload}
                                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg font-bold flex items-center gap-2 transition group text-white"
                            >
                                {state.paid ? (
                                    <><i className="fa-solid fa-download"></i> Download HTML</>
                                ) : (
                                    <><i className="fa-solid fa-lock text-bro-pink"></i> Download (Pro)</>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="w-full h-[700px] bg-white rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] border-4 border-gray-800 relative">
                        {isGenerating ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                                <i className="fa-solid fa-rocket text-6xl mb-4 text-bro-pink animate-bounce"></i>
                                <p className="text-xl font-mono animate-pulse">Generating code... Don't close this tab bro!</p>
                            </div>
                        ) : (
                            <iframe 
                                title="App Preview"
                                srcDoc={generatedCode || ''}
                                className="w-full h-full"
                                sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin allow-downloads"
                            />
                        )}
                    </div>
                </div>
            )}

             {/* Edit App Section - Below Preview */}
             {generatedCode && !isGenerating && (
                <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-2xl p-6 animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-wand-magic-sparkles text-bro-purple"></i> 
                        Not vibing yet? Fix it up!
                    </h3>
                    <div className="flex gap-4 flex-col md:flex-row">
                        <input 
                            type="text"
                            value={editInstruction}
                            onChange={(e) => setEditInstruction(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                            placeholder="e.g. 'Make the background blue', 'Add a footer', 'Fix the buttons'..."
                            className="flex-1 bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-bro-purple focus:outline-none"
                        />
                        <button 
                            onClick={handleUpdate}
                            disabled={isUpdating || !editInstruction}
                            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white rounded-lg font-bold whitespace-nowrap transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUpdating ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                            Update Bro
                        </button>
                    </div>
                </div>
            )}

            {/* Launch Button - Only shown after generation */}
            {generatedCode && !isGenerating && (
                <div className="mt-20 animate-fade-in flex flex-col items-center">
                    <button
                        onClick={handleDownload}
                        className="px-12 py-6 bg-gradient-to-r from-bro-cyan to-bro-purple hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] text-white text-2xl font-bold rounded-full transform transition hover:scale-105 flex items-center gap-3 border-2 border-white/20"
                    >
                         {state.paid ? (
                             <><i className="fa-solid fa-rocket animate-bounce"></i> GET & LAUNCH APP</>
                         ) : (
                             <><i className="fa-solid fa-lock"></i> UNLOCK CODE & LAUNCH</>
                         )}
                    </button>
                    <p className="text-gray-400 mt-6 text-base font-medium text-center max-w-md">
                        {state.paid 
                            ? "Click that button to grab your raw HTML file. Upload it to any server or just run it locally. You own this code 100% bro! 🌍"
                            : "Download is locked for free users. Upgrade to Pro to download the HTML source code!"
                        }
                    </p>
                </div>
            )}
        </div>

        {/* SEO Infographic Section */}
        <div className="mt-32 bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12">
             <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Build Any App with AI</h2>
                 <div className="text-bro-cyan font-mono text-lg">No Coding Required! 🚀</div>
             </div>

             {/* Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
             </div>

             {/* Categories */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {SEO_CATEGORIES.map((cat, idx) => (
                     <div key={idx} className={`p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg transform hover:scale-105 transition duration-300`}>
                         <h3 className="text-white font-bold text-xl mb-4 shadow-black drop-shadow-md">{cat.title}</h3>
                         <ul className="space-y-2">
                             {cat.items.map((item, i) => (
                                 <li key={i} className="text-white/90 text-sm flex items-center gap-2 font-medium">
                                     <i className="fa-solid fa-check-circle text-white/70"></i> {item}
                                 </li>
                             ))}
                         </ul>
                     </div>
                 ))}
             </div>

             {/* Extra Categories Pills */}
             <div className="mt-10 flex flex-wrap justify-center gap-3">
                {['🏥 Healthcare', '🎓 Education', '🎬 Entertainment', '🚗 Automotive', '🏠 Real Estate', '🏋️ Fitness'].map((pill, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm border border-gray-700 hover:border-white/30 transition cursor-default">
                        {pill}
                    </span>
                ))}
             </div>
        </div>

        {/* Showcase / Hall of Fame Section */}
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                🏆 Hall of Fame
              </h2>
              <p className="text-gray-400 text-lg">
                Insane apps built by the Bro Builder community. Click to steal the prompt!
              </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SHOWCASE_APPS.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => handleLoadShowcase(app.prompt)}
                    className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl cursor-pointer hover:border-bro-cyan/50 transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Browser Header */}
                    <div className="bg-gray-800 px-4 py-3 flex gap-2 border-b border-gray-700">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    
                    {/* Preview Body - Simulated UI */}
                    <div className={`h-64 bg-gradient-to-br ${app.previewGradient} flex items-center justify-center relative overflow-hidden p-8`}>
                        {/* Abstract UI Elements */}
                        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMC41Ij48cGF0aCBkPSJNMCAwaDIwdjIwSDB6Ii8+PC9zdmc+')]"></div>
                        
                        <div className="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                           <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg mb-4">
                              <i className={`fa-solid ${app.previewIcon} text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}></i>
                           </div>
                           <h3 className="text-xl font-bold text-white shadow-black drop-shadow-lg">{app.title}</h3>
                        </div>

                        {/* Hover Reveal Overlay */}
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <p className="text-gray-300 text-sm text-center mb-4 leading-relaxed">
                             {app.description}
                           </p>
                           <span className="text-bro-cyan font-bold text-sm uppercase tracking-wider border border-bro-cyan px-4 py-2 rounded-full hover:bg-bro-cyan hover:text-black transition">
                             Remix This ⚡
                           </span>
                        </div>
                    </div>
                  </div>
              ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-600 text-sm relative z-10 border-t border-white/5 mt-20">
        <p>Built with 💪 by Bro Builder | Making coding chill since 2025</p>
      </footer>

      <ChatWidget />
    </div>
  );
};

export default App;
import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Briefcase, Sparkles, Copy, CheckCircle2, CreditCard, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(3);
  const [copied, setCopied] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleGenerate = async () => {
    if (!resume || !jobDescription) {
      alert('Please provide both your resume and the job description.');
      return;
    }
    if (credits <= 0) {
      setShowPricing(true);
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `
        You are an expert career coach and professional copywriter.
        Write a compelling, professional, and tailored cover letter based on the following resume and job description.
        Do not include placeholder brackets like [Your Name] if the information is available in the resume. 
        Keep it concise, impactful, and focused on how the candidate's experience matches the job requirements.
        
        RESUME:
        ${resume}
        
        JOB DESCRIPTION:
        ${jobDescription}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setGeneratedLetter(response.text || '');
      setCredits((prev) => prev - 1);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-indigo-200">
      {/* Header */}
      <header className="border-b border-black/10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-semibold text-lg tracking-tight">CoverCraft AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
              <Zap size={14} />
              <span>{credits} credits left</span>
            </div>
            <button 
              onClick={() => setShowPricing(true)}
              className="text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              Pricing
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Inputs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
                Land your dream job.
              </h1>
              <p className="text-gray-600">
                Paste your resume and the job description. Our AI will craft a personalized, compelling cover letter in seconds.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-1 rounded-2xl shadow-sm border border-black/5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 text-sm font-medium text-gray-700">
                  <FileText size={16} className="text-gray-400" />
                  Your Resume
                </div>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="w-full h-48 p-4 bg-transparent resize-none outline-none text-sm"
                />
              </div>

              <div className="bg-white p-1 rounded-2xl shadow-sm border border-black/5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 text-sm font-medium text-gray-700">
                  <Briefcase size={16} className="text-gray-400" />
                  Job Description
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-48 p-4 bg-transparent resize-none outline-none text-sm"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !resume || !jobDescription}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles size={18} />
                  </motion.div>
                ) : (
                  <Sparkles size={18} />
                )}
                {isGenerating ? 'Crafting your letter...' : 'Generate Cover Letter'}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Output */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col h-[600px]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-gray-50/50">
                <h3 className="font-medium">Generated Letter</h3>
                {generatedLetter && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                {generatedLetter ? (
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                    {generatedLetter}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                      <FileText size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-center max-w-[200px]">
                      Your generated cover letter will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Upgrade to Pro</h2>
              <p className="text-gray-600 mb-8">
                You've run out of free credits. Upgrade to generate unlimited tailored cover letters and land more interviews.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <div className="text-3xl font-bold mb-1">$9<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <p className="text-sm text-gray-500 mb-4">Cancel anytime</p>
                <ul className="text-sm text-left space-y-3">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Unlimited cover letters</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Advanced AI models</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-indigo-600" /> Export to PDF/Word</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPricing(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Maybe later
                </button>
                <button 
                  onClick={() => {
                    alert('This would integrate with Stripe Checkout in a real app!');
                    setShowPricing(false);
                    setCredits(10); // Give some credits for demo
                  }}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

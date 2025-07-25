import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating shapes with better animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-300/40 to-pink-300/40 rounded-3xl opacity-60 animate-pulse shadow-2xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-300/40 to-blue-300/40 rounded-full opacity-50 animate-bounce shadow-xl"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-yellow-300/30 to-green-300/30 rounded-3xl opacity-40 animate-pulse shadow-lg"></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-indigo-300/40 to-purple-300/40 rounded-full opacity-30 animate-bounce delay-1000 shadow-xl"></div>
        <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-gradient-to-br from-rose-300/30 to-orange-300/30 rounded-full opacity-25 animate-pulse delay-500 shadow-lg"></div>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-purple-100/20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        {/* Enhanced Hero Section with improved typography */}
        <div className="text-center mb-24">
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent drop-shadow-sm">Poli</span>
              <span className="text-slate-800 drop-shadow-sm">gap</span>
            </h1>
            <div className="flex justify-center mb-6">
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-8 leading-tight">
            AI-powered compliance made <span className="italic">beautifully</span> simple
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed mb-12 font-medium">
            Transform your compliance workflow with intelligent gap analysis, policy generation, 
            and risk assessment across <span className="font-bold text-purple-700">GDPR, HIPAA, SOX, PCI DSS</span>, and 
            <span className="font-bold text-indigo-700"> 12+ regulatory frameworks</span>.
          </p>
          
          {/* Enhanced CTA Buttons with better styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">🚀</span>
                    <span>Start Analysis</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="group relative bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-purple-200 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-purple-200/50 hover:border-purple-400 hover:bg-white transition-all duration-500 transform hover:-translate-y-2"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span>Generate Policy</span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="group relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">✨</span>
                    <span>Get Started Free</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="group relative bg-gradient-to-r from-rose-500 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-rose-500/25 transform hover:-translate-y-2 transition-all duration-500"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">💎</span>
                    <span>View Pricing</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('compliances')}
                  className="group relative bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-purple-200 px-12 py-5 rounded-2xl font-bold text-xl shadow-xl hover:shadow-purple-200/50 hover:border-purple-400 hover:bg-white transition-all duration-500 transform hover:-translate-y-2"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">📚</span>
                    <span>Learn More</span>
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="text-sm text-gray-500 space-x-6">
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>No credit card required</span>
            </span>
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>Free forever plan</span>
            </span>
            <span className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>Setup in 30 seconds</span>
            </span>
          </div>
        </div>

        {/* Enhanced Market Stats Section */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/30 mb-20 overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full opacity-30"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 text-center">
              The future of compliance is here
            </h3>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto font-medium">
              Join thousands of companies already transforming their compliance workflows with AI
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 mb-4 mx-auto w-fit shadow-xl group-hover:shadow-purple-500/25">
                  <div className="text-5xl font-black text-white mb-2">$75.8B</div>
                </div>
                <div className="text-slate-800 font-bold text-xl mb-2">Compliance Market by 2031</div>
                <div className="text-gray-500 font-medium">10.9% CAGR Growth</div>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 mb-4 mx-auto w-fit shadow-xl group-hover:shadow-blue-500/25">
                  <div className="text-5xl font-black text-white mb-2">83%</div>
                </div>
                <div className="text-slate-800 font-bold text-xl mb-2">AI Adoption Expected</div>
                <div className="text-gray-500 font-medium">Within 5 Years</div>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 mb-4 mx-auto w-fit shadow-xl group-hover:shadow-emerald-500/25">
                  <div className="text-5xl font-black text-white mb-2">40%</div>
                </div>
                <div className="text-slate-800 font-bold text-xl mb-2">Breach Reduction</div>
                <div className="text-gray-500 font-medium">With AI Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Grid with better animations and styling */}
        <div className="mb-20">
          <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 text-center">
            Everything you need in one platform
          </h3>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-medium">
            Powerful AI tools designed to make compliance accessible, efficient, and even enjoyable
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            
            {/* Policy Gap Analyzer */}
            <div 
              onClick={() => onNavigate('analyzer')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-purple-300/50 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 via-indigo-50/0 to-blue-50/0 group-hover:from-purple-50/80 group-hover:via-indigo-50/40 group-hover:to-blue-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-purple-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-4xl text-white">🔍</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Gap Analyzer</h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
                    Upload policy documents and get instant AI-powered compliance gap analysis against 
                    <span className="font-bold text-purple-700"> GDPR, HIPAA, SOX</span>, and more.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent font-bold text-xl group-hover:from-purple-700 group-hover:to-indigo-800 transition-all duration-300">
                      Analyze now →
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('history');
                      }}
                      className="text-sm text-gray-500 hover:text-purple-600 transition-colors font-medium bg-gray-100/80 hover:bg-purple-50 px-4 py-2 rounded-xl backdrop-blur-sm"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Generator */}
            <div 
              onClick={() => onNavigate('generator')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-blue-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-cyan-50/0 to-indigo-50/0 group-hover:from-blue-50/80 group-hover:via-cyan-50/40 group-hover:to-indigo-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-blue-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-4xl text-white">⚡</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Policy Generator</h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
                    Generate compliant policy templates instantly using AI. Choose your 
                    <span className="font-bold text-blue-700"> industry and regulations</span> for custom policies.
                  </p>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent font-bold text-xl group-hover:from-blue-700 group-hover:to-cyan-800 transition-all duration-300">
                    Create now →
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div 
              onClick={() => onNavigate('assessment')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-orange-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-red-50/0 to-pink-50/0 group-hover:from-orange-50/80 group-hover:via-red-50/40 group-hover:to-pink-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-orange-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-4xl text-white">⚖️</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Risk Assessment</h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
                    Comprehensive compliance risk analysis with 
                    <span className="font-bold text-orange-700"> personalized recommendations</span> and actionable insights.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent font-bold text-xl group-hover:from-orange-700 group-hover:to-red-800 transition-all duration-300">
                      Assess now →
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('history');
                      }}
                      className="text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium bg-gray-100/80 hover:bg-orange-50 px-4 py-2 rounded-xl backdrop-blur-sm"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Know Compliances */}
            <div 
              onClick={() => onNavigate('compliances')}
              className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-700 hover:z-10 relative"
            >
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-700 group-hover:border-emerald-300/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-teal-50/0 to-green-50/0 group-hover:from-emerald-50/80 group-hover:via-teal-50/40 group-hover:to-green-50/20 transition-all duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mr-6 shadow-xl group-hover:shadow-emerald-500/25 transform group-hover:rotate-3 transition-all duration-500">
                      <span className="text-4xl text-white">📚</span>
                    </div>
                    <div>
                      <h4 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">Know Compliances</h4>
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg mb-8 font-medium leading-relaxed">
                    Learn about major regulatory frameworks and compliance requirements in 
                    <span className="font-bold text-emerald-700"> simple, easy-to-understand</span> language.
                  </p>
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent font-bold text-xl group-hover:from-emerald-700 group-hover:to-teal-800 transition-all duration-300">
                    Learn now →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced What Sets Us Apart */}
        <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30 mb-20 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-yellow-100/60 to-transparent rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-100/60 to-transparent rounded-full opacity-40"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-4 text-center">
              What sets us apart
            </h3>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-medium">
              Designed for business users, not just compliance experts
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-yellow-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">📊</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-orange-600 transition-colors">Smart Scoring</h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Numeric compliance scores with 
                  <span className="font-bold text-yellow-700"> industry comparisons</span> and benchmarking
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-purple-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">🎨</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-purple-600 transition-colors">Beautiful Design</h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Clean, modern UI makes 
                  <span className="font-bold text-purple-700"> complex compliance simple</span> and accessible
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-blue-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">📄</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">Automated Reports</h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Professional, branded policies and reports 
                  <span className="font-bold text-blue-700"> ready for auditors</span>
                </p>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-emerald-500/25 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-4xl">🎓</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">Education + Analysis</h4>
                <p className="text-gray-600 font-medium leading-relaxed">
                  Empowers 
                  <span className="font-bold text-emerald-700"> business users</span>, not just legal teams with intuitive insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Proof of Impact */}
        <div className="relative bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-blue-50/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-purple-200/50 mb-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-4 text-center">
              Proven AI impact
            </h3>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto font-medium">
              Real-world results from leading organizations worldwide
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-white/50 group-hover:border-purple-200 transition-all duration-500">
                  <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-4">40%</div>
                  <div className="text-slate-800 font-bold text-xl mb-2">Regulatory Breach Reduction</div>
                  <div className="text-gray-600 font-medium">Standard Chartered Bank with AI compliance</div>
                </div>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-white/50 group-hover:border-blue-200 transition-all duration-500">
                  <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent mb-4">20-40%</div>
                  <div className="text-slate-800 font-bold text-xl mb-2">False Positive Reduction</div>
                  <div className="text-gray-600 font-medium">Saving millions in investigation costs</div>
                </div>
              </div>
              
              <div className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-500">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-white/50 group-hover:border-emerald-200 transition-all duration-500">
                  <div className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-4">Weeks</div>
                  <div className="text-slate-800 font-bold text-xl mb-2">Faster Audit Processes</div>
                  <div className="text-gray-600 font-medium">Automation reduces manual work significantly</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Enhanced CTA Section */}
        <div className="relative">
          {/* Multi-layer background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/30 to-pink-600/20 rounded-3xl"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* Animated floating elements */}
          <div className="absolute top-12 left-12 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-pink-400/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '3s'}}></div>
          
          <div className="relative z-10 text-center py-20 px-8">
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent mb-6 leading-tight">
              Ready to revolutionize your compliance?
            </h3>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Join the AI compliance revolution. Transform 
              <span className="text-purple-300 font-bold"> months of manual work</span> into 
              <span className="text-indigo-300 font-bold"> minutes of intelligent analysis</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                onClick={() => onNavigate('analyzer')}
                className="group relative bg-gradient-to-r from-white via-purple-50 to-indigo-50 hover:from-purple-50 hover:via-white hover:to-purple-50 text-slate-800 font-black text-xl px-12 py-5 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <span className="relative flex items-center">
                  Start free analysis
                  <span className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
                </span>
              </button>
              
              <button
                onClick={() => onNavigate('compliances')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-bold text-xl px-12 py-5 rounded-2xl border-2 border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                Learn compliances
              </button>
            </div>
            
            {/* Enhanced trust indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-gray-400">
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="flex items-center mb-2 group-hover:text-purple-300 transition-colors">
                  <span className="text-3xl mr-2">🔒</span>
                  <span className="font-bold text-lg">Enterprise Security</span>
                </div>
                <span className="text-sm opacity-75">SOC 2 Compliant</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="flex items-center mb-2 group-hover:text-indigo-300 transition-colors">
                  <span className="text-3xl mr-2">⚡</span>
                  <span className="font-bold text-lg">Instant Results</span>
                </div>
                <span className="text-sm opacity-75">AI-Powered Analysis</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="flex items-center mb-2 group-hover:text-blue-300 transition-colors">
                  <span className="text-3xl mr-2">🎯</span>
                  <span className="font-bold text-lg">99% Accuracy</span>
                </div>
                <span className="text-sm opacity-75">Validated by Experts</span>
              </div>
              
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="flex items-center mb-2 group-hover:text-emerald-300 transition-colors">
                  <span className="text-3xl mr-2">💎</span>
                  <span className="font-bold text-lg">Always Free to Start</span>
                </div>
                <span className="text-sm opacity-75">No Credit Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

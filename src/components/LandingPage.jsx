import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-20 bg-gradient-to-r from-yellow-200/20 to-green-200/20 rounded-3xl opacity-40"></div>
        <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-800 bg-clip-text text-transparent">Poli</span>
            <span className="text-slate-800">gap</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-700 to-indigo-700 bg-clip-text text-transparent mb-8">
            AI-powered compliance made simple and beautiful
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
            Transform your compliance workflow with intelligent gap analysis, policy generation, 
            and risk assessment across GDPR, HIPAA, SOX, PCI DSS, and 12+ regulatory frameworks.
          </p>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-slate-800 hover:to-slate-900 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Start Analysis</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="group bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-gray-200 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:border-purple-300 hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>📝</span>
                    <span>Generate Policy</span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-slate-800 hover:to-slate-900 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>✨</span>
                    <span>Get Started Free</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="group bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-indigo-800 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>💎</span>
                    <span>View Pricing</span>
                  </span>
                </button>
                <button
                  onClick={() => onNavigate('compliances')}
                  className="group bg-white/90 backdrop-blur-sm text-slate-800 border-2 border-gray-200 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:border-purple-300 hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>📚</span>
                    <span>Learn More</span>
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Market Stats Section */}
        <div className="bg-white rounded-osmo-lg p-8 shadow-osmo-lg border border-gray-100 mb-16">
          <h3 className="text-3xl font-black text-osmo-dark mb-8 text-center">The platform we wish we had, so we built it for you</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-purple mb-2">$75.8B</div>
              <div className="text-osmo-dark font-bold text-lg">Compliance Market by 2031</div>
              <div className="text-gray-500 text-sm">10.9% CAGR Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-blue mb-2">83%</div>
              <div className="text-osmo-dark font-bold text-lg">AI Adoption Expected</div>
              <div className="text-gray-500 text-sm">Within 5 Years</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-green mb-2">40%</div>
              <div className="text-osmo-dark font-bold text-lg">Breach Reduction</div>
              <div className="text-gray-500 text-sm">With AI Compliance</div>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-20">
          
          {/* Policy Gap Analyzer */}
          <div 
            onClick={() => onNavigate('analyzer')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-500 group-hover:border-purple-200">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">🔍</span>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Gap Analyzer</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium leading-relaxed">
                Upload policy documents and get instant AI-powered compliance gap analysis against GDPR, HIPAA, SOX, and more.
              </p>
              <div className="flex items-center justify-between">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-purple-700 group-hover:to-indigo-800 transition-all duration-300">
                  Analyze now →
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('history');
                  }}
                  className="text-sm text-gray-500 hover:text-purple-600 transition-colors font-medium bg-gray-100 hover:bg-purple-50 px-3 py-2 rounded-lg"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Policy Generator */}
          <div 
            onClick={() => onNavigate('generator')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-500 group-hover:border-blue-200">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">⚡</span>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Policy Generator</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium leading-relaxed">
                Generate compliant policy templates instantly using AI. Choose your industry and regulations for custom policies.
              </p>
              <div className="bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-blue-700 group-hover:to-cyan-800 transition-all duration-300">
                Create now →
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div 
            onClick={() => onNavigate('risk-assessment')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-500 group-hover:border-orange-200">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">⚖️</span>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Risk Assessment</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium leading-relaxed">
                Comprehensive compliance risk analysis with personalized recommendations and actionable insights.
              </p>
              <div className="flex items-center justify-between">
                <div className="bg-gradient-to-r from-orange-600 to-red-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-orange-700 group-hover:to-red-800 transition-all duration-300">
                  Assess now →
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('history');
                  }}
                  className="text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium bg-gray-100 hover:bg-orange-50 px-3 py-2 rounded-lg"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Know Compliances */}
          <div 
            onClick={() => onNavigate('compliances')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-500"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-500 group-hover:border-emerald-200">
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📚</span>
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Know Compliances</h3>
              </div>
              <p className="text-gray-600 text-lg mb-6 font-medium leading-relaxed">
                Learn about major regulatory frameworks and compliance requirements in simple, easy-to-understand language.
              </p>
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent font-bold text-lg group-hover:from-emerald-700 group-hover:to-teal-800 transition-all duration-300">
                Learn now →
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced What Sets Us Apart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-20">
          <h3 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-12 text-center">What sets us apart</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Smart Scoring</h4>
              <p className="text-gray-600 font-medium">Numeric compliance scores with industry comparisons and benchmarking</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">🎨</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Beautiful Design</h4>
              <p className="text-gray-600 font-medium">Clean, modern UI makes complex compliance simple and accessible</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">📄</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Automated Reports</h4>
              <p className="text-gray-600 font-medium">Professional, branded policies and reports ready for auditors</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-3xl">🎓</span>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">Education + Analysis</h4>
              <p className="text-gray-600 font-medium">Empowers business users, not just legal teams with intuitive insights</p>
            </div>
          </div>
        </div>

        {/* Enhanced Proof of Impact */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-12 shadow-xl border border-purple-100 mb-20">
          <h3 className="text-3xl font-black text-osmo-dark mb-8 text-center">Proven AI impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-purple mb-2">40%</div>
              <div className="text-osmo-dark font-bold">Regulatory Breach Reduction</div>
              <div className="text-gray-500 text-sm">Standard Chartered Bank with AI compliance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-blue mb-2">20-40%</div>
              <div className="text-osmo-dark font-bold">False Positive Reduction</div>
              <div className="text-gray-500 text-sm">Saving millions in investigation costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-osmo-green mb-2">Weeks</div>
              <div className="text-osmo-dark font-bold">Faster Audit Processes</div>
              <div className="text-gray-500 text-sm">Automation reduces manual work significantly</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-osmo-dark rounded-osmo-lg p-12 text-white">
            <h3 className="text-3xl font-black mb-4">Ready to revolutionize your compliance?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the AI compliance revolution. Transform months of manual work into minutes of intelligent analysis.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onNavigate('analyzer')}
                className="bg-white text-osmo-dark px-8 py-4 rounded-osmo font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                Start free analysis
              </button>
              <button
                onClick={() => onNavigate('compliances')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-osmo font-bold text-lg hover:bg-white hover:text-osmo-dark transition-all"
              >
                Learn compliances
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

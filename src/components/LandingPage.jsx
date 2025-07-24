import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LandingPage({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-br from-osmo-purple/10 to-osmo-pink/10 rounded-osmo opacity-50"></div>
        <div className="absolute top-60 right-20 w-16 h-16 bg-gradient-to-br from-osmo-cyan/10 to-osmo-blue/10 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-1/3 w-32 h-16 bg-gradient-to-r from-osmo-yellow/10 to-osmo-green/10 rounded-osmo opacity-40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-8xl font-black text-osmo-dark mb-6">
            <span className="text-osmo-purple">Poli</span>gap
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-8">
            AI-powered compliance made simple and beautiful
          </h2>
          <p className="text-xl text-gray-500 max-w-4xl mx-auto leading-relaxed mb-12">
            Transform your compliance workflow with intelligent gap analysis, policy generation, 
            and risk assessment across GDPR, HIPAA, SOX, PCI DSS, and 12+ regulatory frameworks.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('analyzer')}
                  className="bg-osmo-dark text-white px-8 py-4 rounded-osmo-lg font-bold text-lg shadow-osmo-lg hover:shadow-osmo hover:transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  Start Analysis
                </button>
                <button
                  onClick={() => onNavigate('generator')}
                  className="bg-white text-osmo-dark border-2 border-gray-200 px-8 py-4 rounded-osmo-lg font-bold text-lg shadow-osmo hover:shadow-osmo-lg hover:border-osmo-purple transition-all duration-300"
                >
                  Generate Policy
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="bg-osmo-dark text-white px-8 py-4 rounded-osmo-lg font-bold text-lg shadow-osmo-lg hover:shadow-osmo hover:transform hover:translate-y-[-2px] transition-all duration-300"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => onNavigate('compliances')}
                  className="bg-white text-osmo-dark border-2 border-gray-200 px-8 py-4 rounded-osmo-lg font-bold text-lg shadow-osmo hover:shadow-osmo-lg hover:border-osmo-purple transition-all duration-300"
                >
                  Learn More
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          
          {/* Policy Gap Analyzer */}
          <div 
            onClick={() => onNavigate('analyzer')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-osmo-lg p-8 shadow-osmo hover:shadow-osmo-lg border border-gray-100 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-osmo-purple rounded-osmo flex items-center justify-center mr-4">
                  <span className="text-2xl text-white">🔍</span>
                </div>
                <h3 className="text-2xl font-black text-osmo-dark">Gap Analyzer</h3>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Upload policy documents and get instant AI-powered compliance gap analysis against GDPR, HIPAA, SOX, and more.
              </p>
              <div className="text-osmo-purple font-bold inline-block">
                Analyze now →
              </div>
            </div>
          </div>

          {/* Policy Generator */}
          <div 
            onClick={() => onNavigate('generator')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-osmo-lg p-8 shadow-osmo hover:shadow-osmo-lg border border-gray-100 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-osmo-blue rounded-osmo flex items-center justify-center mr-4">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h3 className="text-2xl font-black text-osmo-dark">Policy Generator</h3>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Generate compliant policy templates instantly using AI. Choose your industry and regulations for custom policies.
              </p>
              <div className="text-osmo-blue font-bold inline-block">
                Create now →
              </div>
            </div>
          </div>

          {/* Know Compliances */}
          <div 
            onClick={() => onNavigate('compliances')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-osmo-lg p-8 shadow-osmo hover:shadow-osmo-lg border border-gray-100 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-osmo-cyan rounded-osmo flex items-center justify-center mr-4">
                  <span className="text-2xl text-white">📚</span>
                </div>
                <h3 className="text-2xl font-black text-osmo-dark">Know Compliances</h3>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Learn about major regulatory frameworks and compliance requirements in simple, easy-to-understand language.
              </p>
              <div className="text-osmo-cyan font-bold inline-block">
                Learn now →
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div 
            onClick={() => onNavigate('assessment')}
            className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-white rounded-osmo-lg p-8 shadow-osmo hover:shadow-osmo-lg border border-gray-100 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-osmo-green rounded-osmo flex items-center justify-center mr-4">
                  <span className="text-2xl text-white">🛡️</span>
                </div>
                <h3 className="text-2xl font-black text-osmo-dark">Risk Assessment</h3>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                Comprehensive risk analysis of your current policies with severity scoring and prioritized action plans.
              </p>
              <div className="text-osmo-green font-bold inline-block">
                Assess now →
              </div>
            </div>
          </div>

        </div>

        {/* What Sets Us Apart */}
        <div className="bg-white rounded-osmo-lg p-8 shadow-osmo-lg border border-gray-100 mb-16">
          <h3 className="text-3xl font-black text-osmo-dark mb-8 text-center">What sets us apart</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-osmo-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-bold text-osmo-dark mb-2">Quantitative Scoring</h4>
              <p className="text-gray-600 text-sm">Numeric compliance scores with industry comparisons</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-osmo-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="text-lg font-bold text-osmo-dark mb-2">Beautiful Design</h4>
              <p className="text-gray-600 text-sm">Clean, modern UI makes complex compliance simple</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-osmo-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="text-lg font-bold text-osmo-dark mb-2">Automated PDF Generation</h4>
              <p className="text-gray-600 text-sm">Professional, branded policies ready for auditors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-osmo-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h4 className="text-lg font-bold text-osmo-dark mb-2">Education + Analysis</h4>
              <p className="text-gray-600 text-sm">Empowers business users, not just legal teams</p>
            </div>
          </div>
        </div>

        {/* Proof of Impact */}
        <div className="bg-gradient-to-r from-osmo-purple/5 to-osmo-blue/5 rounded-osmo-lg p-8 shadow-osmo border border-gray-100 mb-16">
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

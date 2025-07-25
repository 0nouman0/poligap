import { useState } from 'react';

function KnowCompliances({ onNavigate }) {
  const [selectedCompliance, setSelectedCompliance] = useState(null);

  const compliances = {
    GDPR: {
      title: "GDPR - General Data Protection Regulation",
      region: "European Union",
      year: "2018",
      description: "The GDPR is Europe's privacy law that protects how companies handle personal data of EU citizens.",
      keyPoints: [
        "Applies to any company that processes EU citizens' personal data",
        "Requires explicit consent before collecting personal information",
        "Gives people the right to see, correct, or delete their data",
        "Companies must report data breaches within 72 hours",
        "Fines can be up to 4% of global annual revenue or €20 million",
        "Must appoint a Data Protection Officer (DPO) for high-risk processing"
      ],
      whoNeedsIt: "Any business that collects data from EU residents, regardless of where the business is located.",
      simpleExample: "If you run an online store and someone from Germany buys from you, you need to follow GDPR rules for their personal information."
    },
    HIPAA: {
      title: "HIPAA - Health Insurance Portability and Accountability Act",
      region: "United States",
      year: "1996",
      description: "HIPAA protects sensitive patient health information in the United States healthcare system.",
      keyPoints: [
        "Protects all medical records and health information",
        "Patients have the right to access their own health records",
        "Healthcare providers must get patient consent before sharing information",
        "Requires secure storage and transmission of health data",
        "Staff must be trained on privacy and security procedures",
        "Penalties range from $100 to $50,000 per violation"
      ],
      whoNeedsIt: "Hospitals, doctors, health insurance companies, and any business that handles health information.",
      simpleExample: "When you visit a doctor, they can't share your medical information with anyone else without your written permission."
    },
    SOX: {
      title: "SOX - Sarbanes-Oxley Act",
      region: "United States",
      year: "2002",
      description: "SOX ensures that public companies provide accurate financial information to investors and the public.",
      keyPoints: [
        "CEOs and CFOs must personally certify financial reports are accurate",
        "Companies must have strong internal controls over financial reporting",
        "External auditors must be independent from the company",
        "Whistleblower protections for employees reporting fraud",
        "Severe criminal penalties for executives who knowingly certify false financials",
        "Regular testing and documentation of financial controls required"
      ],
      whoNeedsIt: "All publicly traded companies in the US and their subsidiaries.",
      simpleExample: "If you own stock in a company, SOX helps ensure the financial reports you see are truthful and accurate."
    },
    CCPA: {
      title: "CCPA - California Consumer Privacy Act",
      region: "California, USA",
      year: "2020",
      description: "CCPA gives California residents control over how businesses collect and use their personal information.",
      keyPoints: [
        "California residents can know what personal info is collected about them",
        "Right to delete personal information held by businesses",
        "Right to opt-out of the sale of personal information",
        "Right to non-discriminatory treatment when exercising privacy rights",
        "Businesses must provide clear privacy notices",
        "Fines up to $7,500 per intentional violation"
      ],
      whoNeedsIt: "Businesses that serve California residents and meet certain size/revenue thresholds.",
      simpleExample: "If you live in California, you can ask companies what information they have about you and tell them to delete it."
    },
    PCI_DSS: {
      title: "PCI DSS - Payment Card Industry Data Security Standard",
      region: "Global",
      year: "2004",
      description: "PCI DSS ensures that companies that accept credit cards protect cardholder data from theft and fraud.",
      keyPoints: [
        "Secure storage of cardholder data with encryption",
        "Regular security testing and monitoring of networks",
        "Strong access controls - only authorized people can access card data",
        "Regular software updates and security patches",
        "Maintain secure networks with firewalls",
        "Four compliance levels based on transaction volume"
      ],
      whoNeedsIt: "Any business that accepts, processes, stores, or transmits credit card information.",
      simpleExample: "When you buy something online with a credit card, PCI DSS ensures the store keeps your card number safe from hackers."
    },
    ISO_27001: {
      title: "ISO 27001 - Information Security Management",
      region: "International",
      year: "2005",
      description: "ISO 27001 is an international standard that helps organizations manage and protect their information assets.",
      keyPoints: [
        "Systematic approach to managing sensitive company and customer information",
        "Risk assessment and management processes for information security",
        "Regular security audits and continuous improvement",
        "Employee training and awareness programs",
        "Incident response and business continuity planning",
        "Certification available through accredited bodies"
      ],
      whoNeedsIt: "Any organization that wants to demonstrate strong information security practices, especially those handling sensitive data.",
      simpleExample: "A company gets ISO 27001 certified to show customers they take information security seriously and follow international best practices."
    },
    NIST_CSF: {
      title: "NIST Cybersecurity Framework",
      region: "United States",
      year: "2014",
      description: "NIST CSF provides a flexible framework for organizations to manage and improve their cybersecurity posture.",
      keyPoints: [
        "Five core functions: Identify, Protect, Detect, Respond, Recover",
        "Voluntary framework that can be adapted to any organization",
        "Risk-based approach to cybersecurity management",
        "Promotes communication between technical and business teams",
        "Regular updates to address evolving cyber threats",
        "Widely adopted across government and private sectors"
      ],
      whoNeedsIt: "Any organization looking to improve their cybersecurity practices, especially critical infrastructure providers.",
      simpleExample: "A power company uses NIST CSF to create a plan for protecting their systems from cyber attacks and recovering if something goes wrong."
    },
    CAN_SPAM: {
      title: "CAN-SPAM Act",
      region: "United States",
      year: "2003",
      description: "CAN-SPAM establishes rules for commercial email and gives recipients the right to stop unwanted emails.",
      keyPoints: [
        "Don't use false or misleading header information or subject lines",
        "Identify the message as an advertisement if it's promotional",
        "Tell recipients where you're located with a valid physical address",
        "Provide a clear and easy way to opt out of future emails",
        "Honor opt-out requests promptly (within 10 business days)",
        "Monitor what others do on your behalf for email marketing"
      ],
      whoNeedsIt: "Any business that sends commercial emails or marketing messages to customers.",
      simpleExample: "When a store sends you promotional emails, CAN-SPAM ensures they include an unsubscribe link and honor your request to stop."
    },
    FISMA: {
      title: "FISMA - Federal Information Security Management Act",
      region: "United States",
      year: "2002",
      description: "FISMA requires federal agencies and contractors to secure their information systems and data.",
      keyPoints: [
        "Mandatory for federal agencies and government contractors",
        "Risk-based approach to information security",
        "Annual security assessments and continuous monitoring",
        "Incident reporting requirements to appropriate authorities",
        "Security controls based on NIST standards",
        "Certification and accreditation of information systems"
      ],
      whoNeedsIt: "Federal agencies, government contractors, and organizations that handle federal information.",
      simpleExample: "A company working on a government contract must follow FISMA rules to protect any government data they handle."
    }
  };

  const handleComplianceClick = (complianceKey) => {
    setSelectedCompliance(selectedCompliance === complianceKey ? null : complianceKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <span className="flex items-center space-x-2">
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span>Back to home</span>
            </span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Know Your Compliances
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Understanding regulatory frameworks made simple</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Enhanced Introduction */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10 text-center">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-6">Regulatory frameworks made simple</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
              Understanding compliance doesn't have to be complicated. Learn about major regulatory requirements 
              in clear, simple language that anyone can understand.
            </p>
          </div>

          {/* Enhanced Compliance Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {Object.entries(compliances).map(([key, compliance]) => (
              <div key={key} className="group">
                <div 
                  onClick={() => handleComplianceClick(key)}
                  className="cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-emerald-700 bg-clip-text text-transparent mb-4">{compliance.title}</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm">
                          📍 {compliance.region}
                        </span>
                        <span className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-200 shadow-sm">
                          📅 Since {compliance.year}
                        </span>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <span className="text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                          {selectedCompliance === key ? '−' : '+'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-6 leading-relaxed">{compliance.description}</p>
                  
                  <div className="flex items-center text-emerald-700 font-bold">
                    {selectedCompliance === key ? 'Hide details' : 'Show details'} →
                  </div>
                </div>
                
                {/* Enhanced Expanded Details */}
                {selectedCompliance === key && (
                  <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 shadow-inner">
                    <div className="space-y-8">
                      {/* Who Needs It */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                          <span className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">👥</span>
                          Who needs to follow this?
                        </h4>
                        <p className="text-gray-700 font-medium bg-white/80 p-6 rounded-xl border border-emerald-200 shadow-sm">{compliance.whoNeedsIt}</p>
                      </div>
                      
                      {/* Simple Example */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                          <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">💡</span>
                          Simple example
                        </h4>
                        <p className="text-gray-700 font-medium bg-white/80 p-6 rounded-xl border border-blue-200 shadow-sm">{compliance.simpleExample}</p>
                      </div>
                      
                      {/* Key Points */}
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                          <span className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-lg mr-4 shadow-lg">✓</span>
                          Key requirements
                        </h4>
                        <div className="bg-white/80 rounded-xl border border-purple-200 p-6 shadow-sm">
                          <ul className="space-y-4">
                            {compliance.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                <span className="w-3 h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-1.5 mr-4 flex-shrink-0 shadow-sm"></span>
                                <span className="text-gray-700 font-medium">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-10 text-white text-center shadow-xl">
            <h3 className="text-3xl font-black mb-6">Ready to analyze your policies?</h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Now that you understand the compliance requirements, let our AI analyze your existing policies 
              to identify any gaps and help you stay compliant.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button
                onClick={() => onNavigate('analyzer')}
                className="bg-white text-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔍</span>
                  <span>Start policy analysis</span>
                </span>
              </button>
              <button
                onClick={() => onNavigate('generator')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>📝</span>
                  <span>Generate new policy</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowCompliances;

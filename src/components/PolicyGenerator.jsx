import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { analyzeWithGemini } from '../lib/gemini';

function PolicyGenerator({ onNavigate }) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [selectedCompliances, setSelectedCompliances] = useState([]);

  const industries = [
    'Technology', 'Healthcare', 'Financial Services', 'Education', 
    'Manufacturing', 'Retail', 'Government', 'Non-Profit', 'Other'
  ];

  const policyTypes = [
    'Privacy Policy', 'Data Protection Policy', 'Security Policy',
    'Employee Handbook', 'Code of Conduct', 'IT Policy',
    'Remote Work Policy', 'Incident Response Policy'
  ];

  const frameworks = [
    { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management' },
    { id: 'nist', name: 'NIST Framework', description: 'Cybersecurity Framework' },
    { id: 'cobit', name: 'COBIT', description: 'Control Objectives for IT' },
    { id: 'itil', name: 'ITIL', description: 'IT Service Management' },
    { id: 'sox', name: 'SOX', description: 'Sarbanes-Oxley Act' },
    { id: 'coso', name: 'COSO', description: 'Enterprise Risk Management' },
    { id: 'fair', name: 'FAIR', description: 'Factor Analysis of Information Risk' },
    { id: 'octave', name: 'OCTAVE', description: 'Operationally Critical Threat Assessment' }
  ];

  const compliances = [
    { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation (EU)' },
    { id: 'ccpa', name: 'CCPA', description: 'California Consumer Privacy Act' },
    { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability Act' },
    { id: 'ferpa', name: 'FERPA', description: 'Family Educational Rights and Privacy Act' },
    { id: 'pci-dss', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
    { id: 'fisma', name: 'FISMA', description: 'Federal Information Security Management Act' },
    { id: 'glba', name: 'GLBA', description: 'Gramm-Leach-Bliley Act' },
    { id: 'coppa', name: 'COPPA', description: 'Children\'s Online Privacy Protection Act' },
    { id: 'pipeda', name: 'PIPEDA', description: 'Personal Information Protection (Canada)' },
    { id: 'lgpd', name: 'LGPD', description: 'Lei Geral de Proteção de Dados (Brazil)' }
  ];

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => 
      prev.includes(frameworkId)
        ? prev.filter(id => id !== frameworkId)
        : [...prev, frameworkId]
    );
  };

  const handleComplianceChange = (complianceId) => {
    setSelectedCompliances(prev => 
      prev.includes(complianceId)
        ? prev.filter(id => id !== complianceId)
        : [...prev, complianceId]
    );
  };

  const clearAllFrameworks = () => setSelectedFrameworks([]);
  const clearAllCompliances = () => setSelectedCompliances([]);

  const generatePolicyPDF = async (policyContent, metadata) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 40;

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(metadata.title, margin, yPosition);
    yPosition += 15;

    // Company info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(metadata.companyName, margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Document Type: ${metadata.policyType}`, margin, yPosition + 5);
    doc.text(`Version: 1.0`, margin, yPosition + 10);
    
    yPosition += 25;
    doc.setTextColor(0, 0, 0);
    
    // Process content
    const lines = policyContent.split('\n');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    for (let line of lines) {
      if (line.trim() === '') {
        yPosition += 5;
        continue;
      }
      
      // Check for headers (lines starting with #)
      if (line.startsWith('# ')) {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 58, 138);
        const headerText = line.substring(2);
        doc.text(headerText, margin, yPosition);
        yPosition += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Check for subheaders (lines starting with ##)
      if (line.startsWith('## ')) {
        if (yPosition > pageHeight - 35) {
          doc.addPage();
          yPosition = 40;
        }
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(51, 51, 51);
        const subheaderText = line.substring(3);
        doc.text(subheaderText, margin, yPosition);
        yPosition += 12;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        continue;
      }
      
      // Regular text
      const textWidth = pageWidth - 2 * margin;
      const splitText = doc.splitTextToSize(line, textWidth);
      
      for (let splitLine of splitText) {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 40;
        }
        doc.text(splitLine, margin, yPosition);
        yPosition += 6;
      }
      yPosition += 2;
    }

    return doc;
  };

  const handleGeneratePolicy = async () => {
    if (!companyName || !industry || !policyType) {
      setError('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    setError('');
    setProgress('');
    
    try {
      setProgress('Analyzing requirements and preferences...');
      
      let prompt = `Generate a comprehensive ${policyType} for ${companyName}, a company in the ${industry} industry.

The policy should be professional, legally sound, and include:
1. Clear objectives and scope
2. Detailed procedures and guidelines
3. Roles and responsibilities
4. Compliance requirements
5. Implementation guidelines
6. Review and update procedures

`;

      if (selectedFrameworks.length > 0) {
        const frameworkNames = selectedFrameworks.map(id => frameworks.find(f => f.id === id)?.name).join(', ');
        prompt += `Please ensure the policy aligns with these frameworks: ${frameworkNames}.\n`;
      }

      if (selectedCompliances.length > 0) {
        const complianceNames = selectedCompliances.map(id => compliances.find(c => c.id === id)?.name).join(', ');
        prompt += `The policy must comply with these standards: ${complianceNames}.\n`;
      }

      prompt += `
Make it specific to ${companyName} and relevant to the ${industry} industry.`;

      setProgress('Generating comprehensive policy content...');
      
      const policyContent = await analyzeWithGemini(prompt);
      
      if (!policyContent || policyContent.trim() === '') {
        throw new Error('Failed to generate policy content');
      }

      setGeneratedPolicy(policyContent);
      setProgress('Policy generated successfully!');
      
    } catch (error) {
      console.error('Error generating policy:', error);
      setError('Failed to generate policy. Please try again.');
      setProgress('');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedPolicy) {
      setError('No policy to download. Please generate a policy first.');
      return;
    }

    try {
      setProgress('Preparing professional PDF document...');
      
      const metadata = {
        title: policyType,
        companyName,
        industry,
        policyType
      };

      const doc = await generatePolicyPDF(generatedPolicy, metadata);
      
      const fileName = `${companyName}_${policyType.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
      
      setProgress('PDF downloaded successfully!');
      setTimeout(() => setProgress(''), 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-purple-700 to-pink-700 bg-clip-text text-transparent">
              Policy Generator
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Generate professional policies instantly</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Instructions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📝</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Fill Details</p>
                <p className="text-gray-600 font-medium">Enter company info and select policy type</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">🤖</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">AI Generation</p>
                <p className="text-gray-600 font-medium">AI creates customized policy document</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📄</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Download PDF</p>
                <p className="text-gray-600 font-medium">Get professional formatted document</p>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-10">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent mb-8">Policy Details</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-3 text-lg">Policy Type</label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="">Select Policy Type</option>
                  {policyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Frameworks and Compliances Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Enhanced Frameworks Section */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent flex items-center">
                    🏗️ Frameworks
                    <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                  </h3>
                  {selectedFrameworks.length > 0 && (
                    <button
                      onClick={clearAllFrameworks}
                      className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6 font-medium">Select frameworks to align your policy with:</p>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {frameworks.map(framework => (
                    <div key={framework.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-200">
                      <input
                        type="checkbox"
                        id={framework.id}
                        checked={selectedFrameworks.includes(framework.id)}
                        onChange={() => handleFrameworkChange(framework.id)}
                        className="mt-1 w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor={framework.id} className="flex-1 cursor-pointer">
                        <div className="text-slate-800 font-bold">{framework.name}</div>
                        <div className="text-gray-600 text-sm">{framework.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedFrameworks.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-100 border border-purple-200 rounded-lg">
                    <div className="text-purple-700 text-sm font-bold">
                      Selected: {selectedFrameworks.map(id => frameworks.find(f => f.id === id)?.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Compliances Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-100 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center">
                    📋 Compliance Standards
                    <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                  </h3>
                  {selectedCompliances.length > 0 && (
                    <button
                      onClick={clearAllCompliances}
                      className="text-xs text-red-500 hover:text-red-700 underline font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-6 font-medium">Select compliance standards to include:</p>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {compliances.map(compliance => (
                    <div key={compliance.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/60 transition-all duration-200">
                      <input
                        type="checkbox"
                        id={compliance.id}
                        checked={selectedCompliances.includes(compliance.id)}
                        onChange={() => handleComplianceChange(compliance.id)}
                        className="mt-1 w-5 h-5 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                      />
                      <label htmlFor={compliance.id} className="flex-1 cursor-pointer">
                        <div className="text-slate-800 font-bold">{compliance.name}</div>
                        <div className="text-gray-600 text-sm">{compliance.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedCompliances.length > 0 && (
                  <div className="mt-6 p-4 bg-emerald-100 border border-emerald-200 rounded-lg">
                    <div className="text-emerald-700 text-sm font-bold">
                      Selected: {selectedCompliances.map(id => compliances.find(c => c.id === id)?.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGeneratePolicy}
                disabled={generating || !companyName || !industry || !policyType}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl hover:transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {generating ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Generating...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Generate Policy</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Progress */}
          {progress && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl shadow-lg">
              <p className="text-blue-700 text-center font-bold text-lg">{progress}</p>
            </div>
          )}

          {/* Enhanced Error */}
          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg">
              <p className="text-red-600 text-center font-bold text-lg">{error}</p>
            </div>
          )}

          {/* Enhanced Results */}
          {generatedPolicy && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">Generated Policy Preview</h3>
                  <p className="text-gray-600 mt-1 font-medium">Professional policy ready for download</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 px-6 py-3 rounded-xl text-sm font-bold border border-emerald-200 shadow-sm">
                    📄 PDF Ready
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center space-x-2">
                      <span>📄</span>
                      <span>Download PDF</span>
                    </span>
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-8 max-h-96 overflow-y-auto border border-gray-200 shadow-inner">
                <pre className="text-slate-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {generatedPolicy}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PolicyGenerator;

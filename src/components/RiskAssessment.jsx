import { useState } from 'react';
import { analyzeDocument } from '../lib/gemini';
import { authAPI } from '../lib/neondb';
import { toast, ToastContainer } from 'react-toastify';
function RiskAssessment({ onNavigate }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllGaps, setShowAllGaps] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    organizationType: '',
    industry: '',
    companySize: '',
    jurisdictions: [],
    dataTypes: [],
    businessProcesses: [],
    existingControls: '',
    riskAppetite: ''
  });

  const organizationTypes = [
    'Private Company',
    'Public Company',
    'Non-Profit',
    'Government Agency',
    'Healthcare Provider',
    'Financial Institution',
    'Educational Institution'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Energy',
    'Transportation',
    'Real Estate'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const jurisdictionOptions = [
    'United States',
    'European Union (GDPR)',
    'United Kingdom',
    'Canada',
    'Australia',
    'California (CCPA)',
    'Japan',
    'Singapore',
    'Brazil',
    'Global Operations'
  ];

  const dataTypeOptions = [
    'Personal Information (PII)',
    'Health Records (PHI)',
    'Financial Data',
    'Payment Card Data',
    'Employee Records',
    'Customer Data',
    'Intellectual Property',
    'Government Classified',
    'Student Records',
    'Biometric Data'
  ];

  const businessProcessOptions = [
    'E-commerce/Online Sales',
    'Customer Support',
    'Marketing & Analytics',
    'HR Management',
    'Financial Operations',
    'Healthcare Services',
    'Educational Services',
    'Cloud Services',
    'Mobile Applications',
    'Third-party Integrations'
  ];

  const riskAppetiteOptions = [
    { value: 'low', label: 'Low - Minimal risk tolerance', description: 'Strict compliance, maximum security' },
    { value: 'medium', label: 'Medium - Balanced approach', description: 'Balance between security and operations' },
    { value: 'high', label: 'High - Innovation focused', description: 'Accept higher risks for business agility' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, option) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const canProceedToNext = () => {
    switch(currentStep) {
      case 1:
        return formData.organizationType && formData.industry && formData.companySize;
      case 2:
        return formData.jurisdictions.length > 0;
      case 3:
        return formData.dataTypes.length > 0 && formData.businessProcesses.length > 0;
      case 4:
        return formData.riskAppetite;
      default:
        return false;
    }
  };

  const handleStartAssessment = async () => {
    setLoading(true);
    
    try {
      const prompt = `Conduct a comprehensive compliance risk assessment for a ${formData.organizationType} in the ${formData.industry} industry.

Organization Details:
- Type: ${formData.organizationType}
- Industry: ${formData.industry}
- Size: ${formData.companySize}
- Jurisdictions: ${formData.jurisdictions.join(', ')}
- Data Types: ${formData.dataTypes.join(', ')}
- Business Processes: ${formData.businessProcesses.join(', ')}
- Risk Appetite: ${formData.riskAppetite}
- Existing Controls: ${formData.existingControls || 'Not specified'}

Please provide a detailed risk assessment with:
1. Risk Score (1-100) with detailed breakdown
2. Top 5 compliance risks specific to this organization
3. Recommended compliance frameworks and standards
4. Priority action items with timelines
5. Implementation roadmap
6. Cost estimates for compliance program
7. Key compliance gaps to address immediately

Format the response clearly with sections and actionable recommendations.`;

      const result = await analyzeDocument(prompt);
      console.log('Assessment result:', result);
      console.log('Assessment result type:', typeof result);
      console.log('Assessment result keys:', result && typeof result === 'object' ? Object.keys(result) : 'N/A');
      
      // Handle both string and object responses
      if (typeof result === 'string') {
        setAssessment(result);
      } else if (result && typeof result === 'object') {
        setAssessment(result);
      } else {
        setAssessment('Assessment completed successfully, but no detailed results were returned.');
      }

      // Save risk assessment to database (only if user is authenticated)
      const token = localStorage.getItem('authToken');
      console.log('Checking authentication for history save:', {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0
      });
      
      if (token) {
        console.log('🔄 Starting to save risk assessment to history...');
        try {
          const assessmentData = {
            document_name: `Risk Assessment - ${formData.organizationType} (${formData.industry})`,
            document_type: 'risk-assessment',
            analysis_type: 'risk_assessment',
            industry: formData.industry || 'general',
            frameworks: formData.jurisdictions || [],
            organization_details: {
              organizationType: formData.organizationType,
              industry: formData.industry,
              companySize: formData.companySize,
              jurisdictions: formData.jurisdictions,
              dataTypes: formData.dataTypes,
              businessProcesses: formData.businessProcesses,
              riskAppetite: formData.riskAppetite,
              existingControls: formData.existingControls
            },
            analysis_results: result,
            gaps_found: (typeof result === 'object' && result.gaps) ? result.gaps.length : 0,
            compliance_score: (typeof result === 'object' && result.overallScore) ? result.overallScore : 0
          };

          console.log('📊 Assessment data prepared for saving:', {
            document_name: assessmentData.document_name,
            analysis_type: assessmentData.analysis_type,
            gaps_found: assessmentData.gaps_found,
            compliance_score: assessmentData.compliance_score,
            organization_details: assessmentData.organization_details,
            frameworks_count: assessmentData.frameworks.length
          });

          console.log('📤 Calling authAPI.saveAnalysis...');
          const saveResult = await authAPI.saveAnalysis(assessmentData);
          console.log('✅ Risk assessment saved to history successfully:', saveResult);
          
          // Show success message to user temporarily for debugging
          if (saveResult) {
            console.log('🎉 History save confirmed - assessment is now in your history!');
            toast.success('✅ Risk assessment saved to history successfully! Check the History page to see it.');
          }
          
        } catch (saveError) {
          console.error('❌ Failed to save risk assessment to history:', saveError);
          console.error('🔍 Save error details:', {
            message: saveError.message,
            stack: saveError.stack,
            organization_type: formData.organizationType,
            industry: formData.industry,
            results_present: !!result,
            results_type: typeof result,
            error_name: saveError.name
          });
          
          // Show error to user for debugging
          setErrorMessage(`❌ Failed to save risk assessment to history: ${saveError.message}`);
          // Show error to user for debugging
          alert(`❌ Failed to save risk assessment to history: ${saveError.message}\n\nCheck console for details.`);
        }
      } else {
        console.log('⚠️ No authentication token found - cannot save to history');
        console.log('💡 User needs to be logged in to save risk assessments to history');
      }
    } catch (error) {
      console.error('Assessment error:', error);
      setAssessment('Error conducting risk assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAssessment = () => {
    setAssessment(null);
    setCurrentStep(1);
    setShowAllGaps(false);
    setShowAllActions(false);
    setFormData({
      organizationType: '',
      industry: '',
      companySize: '',
      jurisdictions: [],
      dataTypes: [],
      businessProcesses: [],
      existingControls: '',
      riskAppetite: ''
    });
  };

  return (
    <>
      {/* Toast Container for notifications */}
      <ToastContainer />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header with Back Button */}
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
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">
                Risk Assessment
              </h1>
              <p className="text-gray-600 mt-1 font-medium">Comprehensive compliance risk analysis</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-6">
                <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-lg flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button
                    onClick={() => setErrorMessage('')}
                    className="ml-4 text-red-600 font-bold hover:underline focus:outline-none"
                    aria-label="Dismiss error"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {!assessment ? (
            <>
              {/* Progress Indicator */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">
                    Assessment Progress
                  </h2>
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Step {currentStep} of 4
                  </span>
                </div>
                <div className="flex space-x-3 mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-3 flex-1 rounded-full transition-all duration-500 ${
                        step <= currentStep 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg' 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span className={currentStep >= 1 ? 'text-purple-600 font-semibold' : ''}>Organization</span>
                  <span className={currentStep >= 2 ? 'text-purple-600 font-semibold' : ''}>Jurisdiction</span>
                  <span className={currentStep >= 3 ? 'text-purple-600 font-semibold' : ''}>Data & Processes</span>
                  <span className={currentStep >= 4 ? 'text-purple-600 font-semibold' : ''}>Risk Profile</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 mb-8 hover:shadow-2xl transition-all duration-300">
                
                {/* Step 1: Organization Details */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🏢</span>
                      </div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Organization Details
                      </h3>
                      <p className="text-gray-600 font-medium">Tell us about your organization to get personalized insights</p>
                    </div>
                    
                    <div className="grid gap-8">
                      <div className="group">
                        <label className="block text-slate-800 font-bold mb-3 text-lg">Organization Type</label>
                        <select
                          value={formData.organizationType}
                          onChange={(e) => handleInputChange('organizationType', e.target.value)}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:border-gray-300"
                        >
                          <option value="">Select organization type</option>
                          {organizationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-slate-800 font-bold mb-3 text-lg">Industry</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:border-gray-300"
                        >
                          <option value="">Select industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>

                      <div className="group">
                        <label className="block text-slate-800 font-bold mb-3 text-lg">Company Size</label>
                        <select
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:border-gray-300"
                        >
                          <option value="">Select company size</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Jurisdictions */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Jurisdictions & Regulations
                      </h3>
                      <p className="text-gray-600 font-medium">Select all jurisdictions where your organization operates or has customers</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {jurisdictionOptions.map(jurisdiction => (
                        <div
                          key={jurisdiction}
                          onClick={() => handleMultiSelect('jurisdictions', jurisdiction)}
                          className={`group cursor-pointer p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                            formData.jurisdictions.includes(jurisdiction)
                              ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-4 transition-all duration-300 flex items-center justify-center ${
                              formData.jurisdictions.includes(jurisdiction)
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg'
                                : 'border-2 border-gray-300 group-hover:border-purple-400'
                            }`}>
                              {formData.jurisdictions.includes(jurisdiction) && (
                                <span className="text-white text-xs font-bold">✓</span>
                              )}
                            </div>
                            <span className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                              {jurisdiction}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Data Types & Business Processes */}
                {currentStep === 3 && (
                  <div className="space-y-10">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">🔐</span>
                      </div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Data & Business Processes
                      </h3>
                      <p className="text-gray-600 font-medium">Help us understand what data you handle and your business operations</p>
                    </div>
                    
                    <div className="space-y-10">
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">1</span>
                          Types of Data You Handle
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {dataTypeOptions.map(dataType => (
                            <div
                              key={dataType}
                              onClick={() => handleMultiSelect('dataTypes', dataType)}
                              className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                                formData.dataTypes.includes(dataType)
                                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full mr-3 transition-all duration-300 flex items-center justify-center ${
                                  formData.dataTypes.includes(dataType)
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg'
                                    : 'border-2 border-gray-300 group-hover:border-blue-400'
                                }`}>
                                  {formData.dataTypes.includes(dataType) && (
                                    <span className="text-white text-xs font-bold">✓</span>
                                  )}
                                </div>
                                <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                  {dataType}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">2</span>
                          Business Processes
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {businessProcessOptions.map(process => (
                            <div
                              key={process}
                              onClick={() => handleMultiSelect('businessProcesses', process)}
                              className={`group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                                formData.businessProcesses.includes(process)
                                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                                  : 'border-gray-200 hover:border-green-300 bg-white/80 backdrop-blur-sm'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full mr-3 transition-all duration-300 flex items-center justify-center ${
                                  formData.businessProcesses.includes(process)
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg'
                                    : 'border-2 border-gray-300 group-hover:border-green-400'
                                }`}>
                                  {formData.businessProcesses.includes(process) && (
                                    <span className="text-white text-xs font-bold">✓</span>
                                  )}
                                </div>
                                <span className="font-semibold text-slate-800 group-hover:text-green-700 transition-colors">
                                  {process}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Risk Profile */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-2xl">⚖️</span>
                      </div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                        Risk Profile
                      </h3>
                      <p className="text-gray-600 font-medium">Define your organization's risk tolerance and security posture</p>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <label className="block text-slate-800 font-bold mb-6 text-xl">Risk Appetite</label>
                        <div className="space-y-4">
                          {riskAppetiteOptions.map(option => (
                            <div
                              key={option.value}
                              onClick={() => handleInputChange('riskAppetite', option.value)}
                              className={`group cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                                formData.riskAppetite === option.value
                                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                                  : 'border-gray-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-6 h-6 rounded-full mt-1 mr-4 flex items-center justify-center transition-all duration-300 ${
                                  formData.riskAppetite === option.value
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg'
                                    : 'border-2 border-gray-300 group-hover:border-purple-400'
                                }`}>
                                  {formData.riskAppetite === option.value && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-slate-800 text-lg group-hover:text-purple-700 transition-colors">
                                    {option.label}
                                  </div>
                                  <div className="text-gray-600 mt-1 font-medium">{option.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-slate-800 font-bold mb-4 text-lg">
                          Existing Security Controls <span className="text-gray-500 font-normal">(Optional)</span>
                        </label>
                        <textarea
                          value={formData.existingControls}
                          onChange={(e) => handleInputChange('existingControls', e.target.value)}
                          rows={5}
                          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium group-hover:border-gray-300 resize-none"
                          placeholder="Describe any existing security controls, policies, or compliance measures your organization has in place..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="group bg-gray-100 text-gray-600 px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                    <span>Previous</span>
                  </span>
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToNext()}
                    className="group bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Next</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartAssessment}
                    disabled={loading || !canProceedToNext()}
                    className="group bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-10 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Start Assessment</span>
                      </span>
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Assessment Results */
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-2">
                      Risk Assessment Results
                    </h2>
                    <p className="text-gray-600 font-medium">Your comprehensive compliance analysis</p>
                  </div>
                  <button
                    onClick={resetAssessment}
                    className="group bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <span className="flex items-center space-x-2">
                      <span>↻</span>
                      <span>New Assessment</span>
                    </span>
                  </button>
                </div>
                
                {typeof assessment === 'string' ? (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-gray-200 shadow-inner">
                    <pre className="text-slate-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {assessment}
                    </pre>
                  </div>
                ) : assessment && typeof assessment === 'object' ? (
                  <div className="space-y-8">
                    {/* Summary Section */}
                    {assessment.summary && (
                      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-8 border border-purple-200 shadow-lg">
                        <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mr-3 text-white text-sm">📋</span>
                          Executive Summary
                        </h3>
                        <p className="text-slate-700 leading-relaxed text-lg font-medium">{assessment.summary}</p>
                      </div>
                    )}

                    {/* Score Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center">
                          <span className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mr-3 text-white text-xs">📊</span>
                          Overall Score
                        </h4>
                        <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                          {assessment.overallScore || 'N/A'}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-indigo-700 h-4 rounded-full transition-all duration-1000 shadow-lg"
                            style={{ width: `${assessment.overallScore || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {assessment.industryBenchmark && (
                        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                          <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center">
                            <span className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center mr-3 text-white text-xs">📈</span>
                            Industry Benchmark
                          </h4>
                          <div className="text-sm text-gray-600 mb-4 font-medium">
                            Your Score vs Industry Average ({assessment.industryBenchmark.industry})
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="flex-1">
                              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                                {assessment.industryBenchmark.userScore}%
                              </div>
                              <div className="text-sm text-gray-500 font-medium">Your Score</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-2xl font-bold text-gray-600">
                                {assessment.industryBenchmark.industryAverage}%
                              </div>
                              <div className="text-sm text-gray-500 font-medium">Industry Avg</div>
                            </div>
                          </div>
                          <div className="mt-4 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                            {assessment.industryBenchmark.comparison}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gaps and Issues */}
                    {assessment.gaps && assessment.gaps.length > 0 && (
                      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <h4 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-3 text-white text-sm">⚠️</span>
                          Identified Gaps ({assessment.totalGaps || assessment.gaps.length})
                        </h4>
                        <div className="space-y-6">
                          {(showAllGaps ? assessment.gaps : assessment.gaps.slice(0, 5)).map((gap, index) => (
                            <div key={index} className="group border-l-4 border-red-400 bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-bold text-slate-800 mb-3 text-lg">{gap.issue || gap.title || `Gap ${index + 1}`}</h5>
                                  <div className="flex items-center space-x-4 text-sm mb-4">
                                    <span className={`px-3 py-1 rounded-full font-bold text-white shadow-lg ${
                                      gap.severity === 'High' || gap.severity === 'Critical' 
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : gap.severity === 'Medium'
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                    }`}>
                                      {gap.severity || 'Medium'}
                                    </span>
                                    {gap.framework && (
                                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                        {gap.framework}
                                      </span>
                                    )}
                                    {gap.timeframe && (
                                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                                        ⏱️ {gap.timeframe}
                                      </span>
                                    )}
                                  </div>
                                  {gap.remediation && (
                                    <p className="text-slate-700 font-medium leading-relaxed">{gap.remediation}</p>
                                  )}
                                </div>
                                {gap.currentScore !== undefined && gap.targetScore !== undefined && (
                                  <div className="ml-6 text-right bg-white p-4 rounded-lg shadow-md">
                                    <div className="text-sm text-gray-500 font-medium mb-1">Score Impact</div>
                                    <div className="font-bold text-slate-800 text-lg">
                                      {gap.currentScore}% → {gap.targetScore}%
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {assessment.gaps.length > 5 && (
                            <div className="text-center pt-6">
                              <button 
                                onClick={() => setShowAllGaps(!showAllGaps)}
                                className="group bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold hover:from-purple-700 hover:to-indigo-800 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              >
                                {showAllGaps 
                                  ? 'Show fewer gaps...' 
                                  : `View ${assessment.gaps.length - 5} more gaps...`
                                }
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Prioritized Actions */}
                    {assessment.prioritizedActions && assessment.prioritizedActions.length > 0 && (
                      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <h4 className="text-2xl font-black text-slate-800 mb-6 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3 text-white text-sm">✅</span>
                          Priority Actions
                        </h4>
                        <div className="space-y-4">
                          {(showAllActions ? assessment.prioritizedActions : assessment.prioritizedActions.slice(0, 5)).map((action, index) => (
                            <div key={index} className="group flex items-center space-x-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
                              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                {action.priority || index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-slate-800 text-lg mb-1">{action.title || action.action}</div>
                                {action.framework && (
                                  <div className="text-sm text-emerald-700 font-medium bg-emerald-100 px-3 py-1 rounded-full inline-block">
                                    {action.framework}
                                  </div>
                                )}
                              </div>
                              {action.estimatedEffort && (
                                <div className="text-sm text-gray-600 font-medium bg-white px-3 py-2 rounded-lg shadow-md">
                                  {action.estimatedEffort}
                                </div>
                              )}
                            </div>
                          ))}
                          {assessment.prioritizedActions.length > 5 && (
                            <div className="text-center pt-6">
                              <button 
                                onClick={() => setShowAllActions(!showAllActions)}
                                className="group bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold hover:from-emerald-700 hover:to-teal-800 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              >
                                {showAllActions 
                                  ? 'Show fewer actions...' 
                                  : `View ${assessment.prioritizedActions.length - 5} more actions...`
                                }
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-gray-200 shadow-inner">
                    <p className="text-slate-700 text-center font-medium">No assessment results available.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default RiskAssessment;

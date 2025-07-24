import { useState } from 'react';
import { analyzeDocument } from '../lib/gemini';

function RiskAssessment({ onNavigate }) {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    <div className="min-h-screen bg-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-osmo">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="bg-osmo-dark text-white px-6 py-3 rounded-osmo font-bold hover:bg-gray-700 transition-all shadow-osmo"
          >
            ← Back to home
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-black text-osmo-dark">Risk Assessment</h1>
            <p className="text-gray-600">Comprehensive compliance risk analysis</p>
          </div>
          <div></div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {!assessment ? (
            <>
              {/* Progress Indicator */}
              <div className="bg-white rounded-osmo-lg p-6 shadow-osmo-lg border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-osmo-dark">Assessment Progress</h2>
                  <span className="bg-osmo-purple/10 text-osmo-purple px-3 py-1 rounded-osmo text-sm font-bold border border-osmo-purple/20">
                    Step {currentStep} of 4
                  </span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 flex-1 rounded-full ${
                        step <= currentStep ? 'bg-osmo-purple' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Organization</span>
                  <span>Jurisdiction</span>
                  <span>Data & Processes</span>
                  <span>Risk Profile</span>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white rounded-osmo-lg p-8 shadow-osmo-lg border border-gray-100 mb-8">
                
                {/* Step 1: Organization Details */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-black text-osmo-dark mb-6">Organization Details</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-osmo-dark font-semibold mb-2">Organization Type</label>
                        <select
                          value={formData.organizationType}
                          onChange={(e) => handleInputChange('organizationType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                        >
                          <option value="">Select organization type</option>
                          {organizationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-osmo-dark font-semibold mb-2">Industry</label>
                        <select
                          value={formData.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                        >
                          <option value="">Select industry</option>
                          {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-osmo-dark font-semibold mb-2">Company Size</label>
                        <select
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark focus:outline-none focus:ring-2 focus:ring-osmo-purple"
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
                  <div>
                    <h3 className="text-2xl font-black text-osmo-dark mb-6">Jurisdictions & Regulations</h3>
                    <p className="text-gray-600 mb-6">Select all jurisdictions where your organization operates or has customers:</p>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {jurisdictionOptions.map(jurisdiction => (
                        <div
                          key={jurisdiction}
                          onClick={() => handleMultiSelect('jurisdictions', jurisdiction)}
                          className={`cursor-pointer p-4 rounded-osmo border-2 transition-all ${
                            formData.jurisdictions.includes(jurisdiction)
                              ? 'border-osmo-purple bg-osmo-purple/10'
                              : 'border-gray-200 hover:border-osmo-purple/50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded mr-3 ${
                              formData.jurisdictions.includes(jurisdiction)
                                ? 'bg-osmo-purple'
                                : 'border-2 border-gray-300'
                            }`} />
                            <span className="font-medium text-osmo-dark">{jurisdiction}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Data Types & Business Processes */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-2xl font-black text-osmo-dark mb-6">Data & Business Processes</h3>
                    
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-lg font-bold text-osmo-dark mb-4">Types of Data You Handle:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {dataTypeOptions.map(dataType => (
                            <div
                              key={dataType}
                              onClick={() => handleMultiSelect('dataTypes', dataType)}
                              className={`cursor-pointer p-3 rounded-osmo border-2 transition-all ${
                                formData.dataTypes.includes(dataType)
                                  ? 'border-osmo-blue bg-osmo-blue/10'
                                  : 'border-gray-200 hover:border-osmo-blue/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded mr-3 ${
                                  formData.dataTypes.includes(dataType)
                                    ? 'bg-osmo-blue'
                                    : 'border-2 border-gray-300'
                                }`} />
                                <span className="font-medium text-osmo-dark">{dataType}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-osmo-dark mb-4">Business Processes:</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {businessProcessOptions.map(process => (
                            <div
                              key={process}
                              onClick={() => handleMultiSelect('businessProcesses', process)}
                              className={`cursor-pointer p-3 rounded-osmo border-2 transition-all ${
                                formData.businessProcesses.includes(process)
                                  ? 'border-osmo-green bg-osmo-green/10'
                                  : 'border-gray-200 hover:border-osmo-green/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded mr-3 ${
                                  formData.businessProcesses.includes(process)
                                    ? 'bg-osmo-green'
                                    : 'border-2 border-gray-300'
                                }`} />
                                <span className="font-medium text-osmo-dark">{process}</span>
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
                  <div>
                    <h3 className="text-2xl font-black text-osmo-dark mb-6">Risk Profile</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-osmo-dark font-semibold mb-4">Risk Appetite</label>
                        <div className="space-y-3">
                          {riskAppetiteOptions.map(option => (
                            <div
                              key={option.value}
                              onClick={() => handleInputChange('riskAppetite', option.value)}
                              className={`cursor-pointer p-4 rounded-osmo border-2 transition-all ${
                                formData.riskAppetite === option.value
                                  ? 'border-osmo-purple bg-osmo-purple/10'
                                  : 'border-gray-200 hover:border-osmo-purple/50'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-4 h-4 rounded-full mt-1 mr-3 ${
                                  formData.riskAppetite === option.value
                                    ? 'bg-osmo-purple'
                                    : 'border-2 border-gray-300'
                                }`} />
                                <div>
                                  <div className="font-bold text-osmo-dark">{option.label}</div>
                                  <div className="text-gray-600 text-sm">{option.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-osmo-dark font-semibold mb-2">Existing Security Controls (Optional)</label>
                        <textarea
                          value={formData.existingControls}
                          onChange={(e) => handleInputChange('existingControls', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-osmo text-osmo-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-osmo-purple"
                          placeholder="Describe any existing security controls, policies, or compliance measures..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="bg-gray-200 text-gray-600 px-6 py-3 rounded-osmo font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceedToNext()}
                    className="bg-osmo-purple text-white px-6 py-3 rounded-osmo font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleStartAssessment}
                    disabled={loading || !canProceedToNext()}
                    className="bg-osmo-dark text-white px-8 py-3 rounded-osmo font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors shadow-osmo"
                  >
                    {loading ? '🔄 Analyzing...' : '🚀 Start Assessment'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Assessment Results */
            <div className="space-y-8">
              <div className="bg-white rounded-osmo-lg p-8 shadow-osmo-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-osmo-dark">Risk Assessment Results</h2>
                  <button
                    onClick={resetAssessment}
                    className="bg-osmo-purple text-white px-4 py-2 rounded-osmo font-bold hover:bg-purple-600 transition-colors"
                  >
                    New Assessment
                  </button>
                </div>
                
                {typeof assessment === 'string' ? (
                  <div className="bg-osmo-gray/30 rounded-osmo p-6 border border-gray-200">
                    <pre className="text-osmo-dark whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {assessment}
                    </pre>
                  </div>
                ) : assessment && typeof assessment === 'object' ? (
                  <div className="space-y-6">
                    {/* Summary Section */}
                    {assessment.summary && (
                      <div className="bg-gradient-to-r from-osmo-purple/10 to-osmo-green/10 rounded-osmo p-6 border border-osmo-purple/20">
                        <h3 className="text-xl font-black text-osmo-dark mb-3">Executive Summary</h3>
                        <p className="text-osmo-dark leading-relaxed">{assessment.summary}</p>
                      </div>
                    )}

                    {/* Score Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-osmo p-6 shadow-osmo border border-gray-200">
                        <h4 className="text-lg font-black text-osmo-dark mb-3">Overall Score</h4>
                        <div className="text-3xl font-black text-osmo-purple mb-2">
                          {assessment.overallScore || 'N/A'}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-osmo-purple h-3 rounded-full transition-all duration-500"
                            style={{ width: `${assessment.overallScore || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      {assessment.industryBenchmark && (
                        <div className="bg-white rounded-osmo p-6 shadow-osmo border border-gray-200">
                          <h4 className="text-lg font-black text-osmo-dark mb-3">Industry Benchmark</h4>
                          <div className="text-sm text-gray-600 mb-2">
                            Your Score vs Industry Average ({assessment.industryBenchmark.industry})
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="text-lg font-bold text-osmo-purple">
                                {assessment.industryBenchmark.userScore}%
                              </div>
                              <div className="text-sm text-gray-500">Your Score</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-gray-600">
                                {assessment.industryBenchmark.industryAverage}%
                              </div>
                              <div className="text-sm text-gray-500">Industry Avg</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm font-semibold text-osmo-green">
                            {assessment.industryBenchmark.comparison}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Gaps and Issues */}
                    {assessment.gaps && assessment.gaps.length > 0 && (
                      <div className="bg-white rounded-osmo p-6 shadow-osmo border border-gray-200">
                        <h4 className="text-lg font-black text-osmo-dark mb-4">
                          Identified Gaps ({assessment.totalGaps || assessment.gaps.length})
                        </h4>
                        <div className="space-y-4">
                          {assessment.gaps.slice(0, 5).map((gap, index) => (
                            <div key={index} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-osmo">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-bold text-osmo-dark mb-1">{gap.issue || gap.title || `Gap ${index + 1}`}</h5>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    <span className={`px-2 py-1 rounded-osmo font-bold ${
                                      gap.severity === 'High' || gap.severity === 'Critical' 
                                        ? 'bg-red-200 text-red-800'
                                        : gap.severity === 'Medium'
                                        ? 'bg-yellow-200 text-yellow-800'
                                        : 'bg-green-200 text-green-800'
                                    }`}>
                                      {gap.severity || 'Medium'}
                                    </span>
                                    {gap.framework && <span>{gap.framework}</span>}
                                    {gap.timeframe && <span>⏱️ {gap.timeframe}</span>}
                                  </div>
                                  {gap.remediation && (
                                    <p className="text-sm text-osmo-dark">{gap.remediation}</p>
                                  )}
                                </div>
                                {gap.currentScore !== undefined && gap.targetScore !== undefined && (
                                  <div className="ml-4 text-right">
                                    <div className="text-sm text-gray-500">Score</div>
                                    <div className="font-bold text-osmo-dark">
                                      {gap.currentScore}% → {gap.targetScore}%
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {assessment.gaps.length > 5 && (
                            <div className="text-center pt-4">
                              <button className="text-osmo-purple font-semibold hover:underline">
                                View {assessment.gaps.length - 5} more gaps...
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Prioritized Actions */}
                    {assessment.prioritizedActions && assessment.prioritizedActions.length > 0 && (
                      <div className="bg-white rounded-osmo p-6 shadow-osmo border border-gray-200">
                        <h4 className="text-lg font-black text-osmo-dark mb-4">Priority Actions</h4>
                        <div className="space-y-3">
                          {assessment.prioritizedActions.slice(0, 5).map((action, index) => (
                            <div key={index} className="flex items-center space-x-4 p-3 bg-osmo-gray/20 rounded-osmo">
                              <div className="w-8 h-8 bg-osmo-purple text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {action.priority || index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-osmo-dark">{action.title || action.action}</div>
                                {action.framework && (
                                  <div className="text-sm text-gray-600">{action.framework}</div>
                                )}
                              </div>
                              {action.estimatedEffort && (
                                <div className="text-sm text-gray-500">{action.estimatedEffort}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-osmo-gray/30 rounded-osmo p-6 border border-gray-200">
                    <p className="text-osmo-dark">No assessment results available.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;

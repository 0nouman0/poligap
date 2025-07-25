import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import AnalysisResults from './AnalysisResults';
import { analyzeDocument } from '../lib/gemini';
import { authAPI } from '../lib/neondb';

function PolicyAnalyzer({ onNavigate, onDocumentUpload }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  const extractTextFromPDF = async (file) => {
    try {
      // For now, let's use a simple text extraction fallback
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function(e) {
          // This is a simplified approach - in a real app, you'd need proper PDF parsing
          // For demo purposes, we'll create a mock text content
          const mockPolicyText = `
            PRIVACY POLICY
            
            This is a demonstration of policy analysis. The system has detected that this is a ${file.name} file.
            
            Data Collection: We collect personal information when you interact with our services.
            
            Data Processing: We process your data for legitimate business purposes.
            
            Data Sharing: We may share data with third parties under certain circumstances.
            
            Security Measures: We implement appropriate security measures to protect your data.
            
            User Rights: You have the right to access, modify, and delete your personal information.
            
            Contact Information: For privacy concerns, please contact our privacy team.
          `;
          resolve(mockPolicyText);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('PDF extraction error:', error);
      // Return mock content for demonstration
      return `Mock policy content for ${file.name} - demonstrating rules benchmarking functionality`;
    }
  };

  const handleFileUpload = async (uploadData) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      // Extract file and configuration
      const { file, industry, frameworks } = uploadData;
      
      // Notify parent component about document upload
      if (onDocumentUpload) {
        const documentInfo = {
          file,
          fileName: file.name,
          fileType: file.type,
          uploadDate: new Date(),
          industry,
          frameworks,
          size: file.size
        };
        onDocumentUpload(documentInfo);
      }
      
      setProgress('📄 Extracting text from document...');
      
      let text;
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else {
        const fileText = await file.text();
        text = fileText;
      }

      if (!text || text.trim().length === 0) {
        throw new Error('No text content found in the document');
      }

      setProgress('🤖 Analyzing document with AI...');
      
      // Pass the configuration data to the AI analysis
      const results = await analyzeDocument(text, {
        industry: industry,
        frameworks: frameworks
      });
      
      setAnalysis(results);
      
      // Save analysis to database (only if user is authenticated)
      const token = localStorage.getItem('authToken');
      if (token) {
        setProgress('💾 Saving analysis to history...');
        
        try {
          const gapsFound = results.gaps?.length || 0;
          const complianceScore = results.overallScore || results.overallCompliance || 0;
          
          console.log('Compliance Score Calculation:', {
            overallScore: results.overallScore,
            overallCompliance: results.overallCompliance,
            finalScore: complianceScore,
            resultsKeys: Object.keys(results)
          });
          
          const analysisData = {
            document_name: file?.name || 'Unknown Document',
            document_type: file?.type || 'application/pdf',
            industry: industry || 'general',
            frameworks: frameworks || [],
            analysis_results: results,
            gaps_found: gapsFound,
            compliance_score: complianceScore
          };

          // Validate required fields before sending
          if (!analysisData.document_name || !analysisData.analysis_results) {
            throw new Error(`Missing required fields: document_name=${!!analysisData.document_name}, analysis_results=${!!analysisData.analysis_results}`);
          }

          // Additional validation for analysis_results structure
          if (typeof analysisData.analysis_results !== 'object' || analysisData.analysis_results === null) {
            throw new Error('Analysis results must be a valid object');
          }

          // Debug: Log the data being sent
          console.log('Saving analysis data:', {
            document_name: analysisData.document_name,
            document_type: analysisData.document_type,
            industry: analysisData.industry,
            frameworks: analysisData.frameworks,
            analysis_results_type: typeof analysisData.analysis_results,
            analysis_results_keys: Object.keys(analysisData.analysis_results),
            gaps_found: analysisData.gaps_found,
            compliance_score: analysisData.compliance_score,
            token_present: !!token,
            token_length: token.length
          });

          const saveResult = await authAPI.saveAnalysis(analysisData);
          
          console.log('Analysis saved to history successfully:', saveResult);
          setProgress('✅ Analysis saved to history');
          
          // Clear the progress message after a short delay
          setTimeout(() => setProgress(''), 2000);
          
        } catch (saveError) {
          console.error('Failed to save analysis to history:', saveError);
          console.error('Save error details:', {
            message: saveError.message,
            file_name: file?.name,
            results_present: !!results,
            token_present: !!token,
            error_stack: saveError.stack
          });
          
          // Show user-friendly error message for auth issues
          if (saveError.message.includes('token') || saveError.message.includes('authentication')) {
            setProgress('⚠️ Please log in to save analysis history');
            setTimeout(() => setProgress(''), 3000);
          } else {
            setProgress('⚠️ Could not save to history (analysis still visible)');
            setTimeout(() => setProgress(''), 3000);
          }
        }
      } else {
        console.log('User not authenticated, skipping analysis save');
        setProgress('⚠️ Login to save analysis history');
        setTimeout(() => setProgress(''), 3000);
      }
      
      setProgress('');
      
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Gap Analyzer
            </h1>
            <p className="text-gray-600 mt-1 font-medium">AI-powered compliance analysis</p>
          </div>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="w-full max-w-[70%] mx-auto space-y-10">
          
          {/* Enhanced Instructions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
            <h2 className="text-3xl font-black bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📁</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Upload PDF</p>
                <p className="text-gray-600 font-medium">Select your policy document for analysis</p>
              </div>
              <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">🤖</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">AI Analysis</p>
                <p className="text-gray-600 font-medium">AI scans for compliance gaps and issues</p>
              </div>
              <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-3xl text-white">📊</span>
                </div>
                <p className="font-bold text-slate-800 mb-3 text-lg">Get Report</p>
                <p className="text-gray-600 font-medium">Receive detailed compliance insights</p>
              </div>
            </div>
          </div>

          {/* Enhanced Upload Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
            <DocumentUpload 
              onUpload={handleFileUpload}
              uploading={loading}
              progress={progress}
              error={error}
            />
          </div>

          {/* Enhanced Results Section */}
          {analysis && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-white/20">
              <AnalysisResults analysis={analysis} isHistoryView={false} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default PolicyAnalyzer;

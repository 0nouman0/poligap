import { useState } from 'react';
import { analyzeDocument } from '../lib/gemini';

function DocumentUpload({ onUpload, uploading, progress, error }) {
  const [file, setFile] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [loading, setLoading] = useState(false);

  const availableFrameworks = [
    { id: 'GDPR', name: 'GDPR (General Data Protection Regulation)', region: 'EU' },
    { id: 'HIPAA', name: 'HIPAA (Health Insurance Portability)', region: 'US' },
    { id: 'SOX', name: 'SOX (Sarbanes-Oxley Act)', region: 'US' },
    { id: 'CCPA', name: 'CCPA (California Consumer Privacy Act)', region: 'California' },
    { id: 'PCI_DSS', name: 'PCI DSS (Payment Card Industry)', region: 'Global' },
    { id: 'ISO_27001', name: 'ISO 27001 (Information Security Management)', region: 'International' },
    { id: 'FERPA', name: 'FERPA (Family Educational Rights)', region: 'US' },
    { id: 'GLBA', name: 'GLBA (Gramm-Leach-Bliley Act)', region: 'US' },
    { id: 'COPPA', name: 'COPPA (Children\'s Online Privacy)', region: 'US' },
    { id: 'NIST_CSF', name: 'NIST Cybersecurity Framework', region: 'US' },
    { id: 'CAN_SPAM', name: 'CAN-SPAM Act', region: 'US' },
    { id: 'FISMA', name: 'FISMA (Federal Information Security)', region: 'US' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Financial', 'Manufacturing', 
    'Retail', 'Education', 'Government', 'Energy'
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Note: error handling is managed by parent component
  };

  const handleFrameworkChange = (frameworkId) => {
    setSelectedFrameworks(prev => {
      // Ensure prev is always an array
      const currentFrameworks = Array.isArray(prev) ? prev : [];
      
      return currentFrameworks.includes(frameworkId) 
        ? currentFrameworks.filter(id => id !== frameworkId)
        : [...currentFrameworks, frameworkId];
    });
  };

  const extractTextFromPDF = async (file) => {
    setProgress('Extracting text from PDF...');
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    
    try {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(`Processing page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + ' ';
      }
      
      console.log('Extracted text length:', text.length);
      console.log('First 200 characters:', text.substring(0, 200));
      
      return text.trim();
    } catch (pdfError) {
      console.error('PDF extraction error:', pdfError);
      throw new Error(`Failed to extract text from PDF: ${pdfError.message}`);
    }
  };

    const handleUpload = async () => {
    if (!file) {
      // setError would need to be handled by parent, but for now let's use alert
      alert('Please select a file to upload');
      return;
    }

    if (!selectedIndustry) {
      alert('Please select your industry sector');
      return;
    }

    // Ensure selectedFrameworks is an array and has at least one element
    const frameworksToUse = Array.isArray(selectedFrameworks) ? selectedFrameworks : [];
    if (frameworksToUse.length === 0) {
      alert('Please select at least one regulatory framework');
      return;
    }

    try {
      console.log('Uploading file:', file.name);
      console.log('Selected Industry:', selectedIndustry);
      console.log('Selected Frameworks (validated):', frameworksToUse);

      // Pass the configuration to parent with validated data
      await onUpload({
        file,
        industry: selectedIndustry,
        frameworks: frameworksToUse
      });
      
      // Reset form
      setFile(null);
      setSelectedIndustry('');
      setSelectedFrameworks([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Upload error:', err);
      // Error handling is managed by parent
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/30">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 shadow-xl">
          <span className="text-3xl text-white">📁</span>
        </div>
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">Upload Document</h2>
          <p className="text-gray-600 font-medium mt-1">Upload your policy for AI-powered analysis</p>
        </div>
      </div>
      
      {/* Enhanced Regulatory Framework Selection */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-6 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          Select Regulatory Frameworks to Benchmark Against:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableFrameworks.map((framework) => (
            <label 
              key={framework.id} 
              className={`group flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                selectedFrameworks.includes(framework.id)
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg'
                  : 'border-gray-200 bg-white/80 hover:border-purple-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(framework.id)}
                onChange={() => handleFrameworkChange(framework.id)}
                className="mr-4 w-5 h-5 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <div className="flex-1">
                <span className="font-bold text-slate-800 text-lg block group-hover:text-purple-700 transition-colors">
                  {framework.name}
                </span>
                <p className="text-sm text-gray-600 mt-1 font-medium">
                  📍 Region: <span className="text-purple-600 font-semibold">{framework.region}</span>
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Enhanced Industry Selection */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-4 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          Select Your Industry Sector:
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm text-slate-800 font-bold text-lg focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <option value="">Choose your industry...</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>
      
      {/* Enhanced File Upload */}
      <div className="mb-8">
        <label className="block text-xl font-black mb-4 bg-gradient-to-r from-slate-800 to-purple-700 bg-clip-text text-transparent">
          Upload Policy Document:
        </label>
        <div className="relative group">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-dashed border-gray-300 group-hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-xl">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-gray-700 bg-white border-2 border-gray-200 p-4 rounded-xl file:mr-4 file:py-3 file:px-6 file:bg-gradient-to-r file:from-purple-600 file:to-indigo-700 file:text-white file:font-bold file:border-0 file:rounded-xl file:shadow-lg hover:file:from-purple-700 hover:file:to-indigo-800 file:transition-all file:duration-300 transition-all font-medium"
            />
            {file && (
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 shadow-lg">
                <p className="text-emerald-700 font-bold text-lg flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  {file.name} 
                  <span className="ml-2 text-sm bg-emerald-100 px-2 py-1 rounded-lg">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-xl font-black px-8 py-6 rounded-2xl shadow-2xl hover:from-purple-700 hover:to-indigo-800 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
      >
        {uploading ? (
          <span className="flex items-center justify-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
            <span>🤖 AI Processing...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center space-x-3">
            <span>⚡</span>
            <span>Analyze Policy with AI</span>
            <span>🚀</span>
          </span>
        )}
      </button>

      {/* Enhanced Progress Display */}
      {progress && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl shadow-xl">
          <div className="flex items-center">
            <div className="animate-spin text-3xl mr-4">⚙️</div>
            <div>
              <p className="text-blue-700 font-black text-xl">{progress}</p>
              <p className="text-blue-600 text-sm font-medium mt-1">Please wait while we process your document...</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl shadow-xl">
          <div className="flex items-start">
            <span className="text-3xl mr-4 mt-1">⚠️</span>
            <div className="flex-1">
              <p className="text-red-700 font-black text-xl mb-2">Analysis Error</p>
              <p className="text-red-600 mb-4 font-medium leading-relaxed">{error}</p>
              <div className="bg-red-100 p-4 rounded-xl border border-red-200">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <span className="mr-2">💡</span>
                  Check the browser console (F12) for detailed error information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;

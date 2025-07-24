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
    <div className="w-full bg-white p-8 rounded-osmo-lg shadow-osmo-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-osmo-purple rounded-osmo flex items-center justify-center mr-4">
          <span className="text-2xl text-white">📁</span>
        </div>
        <h2 className="text-3xl font-black text-osmo-dark">Upload Document</h2>
      </div>
      
      {/* Regulatory Framework Selection */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-3 text-osmo-dark">
          Select Regulatory Frameworks to Benchmark Against:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableFrameworks.map((framework) => (
            <label 
              key={framework.id} 
              className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-osmo hover:bg-gray-100 cursor-pointer shadow-osmo transition-all duration-200"
            >
              <input
                type="checkbox"
                checked={selectedFrameworks.includes(framework.id)}
                onChange={() => handleFrameworkChange(framework.id)}
                className="mr-3 scale-125 accent-osmo-purple"
              />
              <div>
                <span className="font-bold text-osmo-dark">{framework.name}</span>
                <p className="text-xs text-gray-600 mt-1">Region: {framework.region}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Industry Selection */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-3 text-osmo-dark">
          Select Your Industry Sector:
        </label>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-osmo bg-white text-osmo-dark font-bold shadow-osmo focus:shadow-osmo-lg focus:border-osmo-purple transition-all duration-200"
        >
          <option value="">Choose your industry...</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-osmo border border-gray-200 mb-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-gray-700 bg-white border border-gray-200 p-3 rounded-osmo file:mr-4 file:py-2 file:px-4 file:bg-osmo-purple file:text-white file:font-bold file:border-0 file:rounded-osmo file:shadow-osmo hover:file:bg-osmo-purple/90 transition-all"
          />
          {file && (
            <div className="mt-3 p-3 bg-osmo-green/10 rounded-osmo border border-osmo-green/20">
              <p className="text-osmo-green font-bold">
                ✅ {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full bg-osmo-dark text-white text-xl font-bold px-8 py-4 rounded-osmo-lg shadow-osmo-lg hover:shadow-osmo hover:transform hover:translate-y-[-2px] disabled:bg-gray-400 disabled:text-gray-200 disabled:shadow-none disabled:transform-none transition-all"
      >
        {uploading ? '🤖 Processing...' : '⚡ Analyze Policy'}
      </button>

      {progress && (
        <div className="mt-6 p-4 bg-osmo-blue/10 border border-osmo-blue/20 rounded-osmo shadow-osmo">
          <div className="flex items-center">
            <div className="animate-spin text-2xl mr-3">⚙️</div>
            <p className="text-osmo-blue font-bold text-lg">{progress}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-osmo shadow-osmo">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-3">⚠️</span>
            <p className="text-red-700 font-bold text-lg">Error Detected</p>
          </div>
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-red-500 text-sm">
            💡 Check the browser console (F12) for detailed error information.
          </p>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;

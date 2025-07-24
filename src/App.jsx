import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import PolicyAnalyzer from './components/PolicyAnalyzer';
import PolicyGenerator from './components/PolicyGenerator';
import KnowCompliances from './components/KnowCompliances';
import RiskAssessment from './components/RiskAssessment';
import ComplianceMonitor from './components/ComplianceMonitor';
import ChatButton from './components/ChatButton';
import ChatExpert from './components/ChatExpert';
import LoginPage from './components/LoginPage';
import UserProfile from './components/UserProfile';
import AnalysisHistory from './components/AnalysisHistory';
import AnalysisResults from './components/AnalysisResults';
import NavigationHeader from './components/NavigationHeader';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [uploadedDocument, setUploadedDocument] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocument(document);
  };

  const handleViewAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    setCurrentPage('view-analysis');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'profile':
        return (
          <ProtectedRoute>
            <UserProfile onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'analyzer':
        return (
          <ProtectedRoute>
            <PolicyAnalyzer onNavigate={navigate} onDocumentUpload={handleDocumentUpload} />
          </ProtectedRoute>
        );
      case 'generator':
        return (
          <ProtectedRoute>
            <PolicyGenerator onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'compliances':
        return <KnowCompliances onNavigate={navigate} />;
      case 'assessment':
        return (
          <ProtectedRoute>
            <RiskAssessment onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'monitor':
        return (
          <ProtectedRoute>
            <ComplianceMonitor onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'history':
        return (
          <ProtectedRoute>
            <AnalysisHistory onNavigate={navigate} onViewAnalysis={handleViewAnalysis} />
          </ProtectedRoute>
        );
      case 'view-analysis':
        return (
          <ProtectedRoute>
            <AnalysisResults 
              analysis={selectedAnalysis?.analysis_results} 
              onNavigate={navigate}
              isHistoryView={true}
              documentName={selectedAnalysis?.document_name}
              analysisDate={selectedAnalysis?.created_at}
            />
          </ProtectedRoute>
        );
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="App bg-white min-h-screen">
        {/* Navigation Header */}
        <NavigationHeader currentPage={currentPage} onNavigate={navigate} />
        
        {/* Main Content */}
        <main>
          {renderPage()}
        </main>
        
        {/* Chat Button - only show when document is uploaded */}
        <ChatButton 
          hasDocument={!!uploadedDocument}
          onClick={() => setIsChatOpen(true)}
        />
        
        {/* Chat Expert Modal */}
        <ChatExpert
          policyDocument={uploadedDocument}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;

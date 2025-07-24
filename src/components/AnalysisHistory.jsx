import { useState, useEffect } from 'react';
import { authAPI } from '../lib/neondb';
import { useAuth } from '../contexts/AuthContext';
import AnalysisDetailsModal from './AnalysisDetailsModal';

function AnalysisHistory({ onNavigate, onViewAnalysis }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getAnalysisHistory(currentPage, 10);
      setHistory(response.history);
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load analysis history');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnalysis = async (id, documentName) => {
    if (!confirm(`Are you sure you want to delete the analysis for "${documentName}"?`)) {
      return;
    }

    try {
      await authAPI.deleteAnalysis(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete analysis');
      console.error('Delete error:', err);
    }
  };

  const handleViewAnalysis = async (id) => {
    try {
      setLoading(true);
      const response = await authAPI.getAnalysisDetails(id);
      setSelectedAnalysis(response.analysis);
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to load analysis details');
      console.error('View analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnalysis(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-osmo-purple mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analysis history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-osmo-dark mb-4">
            📊 Analysis History
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your policy analysis history
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-osmo text-red-700">
            {error}
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Analysis History</h3>
            <p className="text-gray-500 mb-6">
              You haven't analyzed any policies yet. Start by analyzing your first document!
            </p>
            <button
              onClick={() => onNavigate('analyzer')}
              className="bg-osmo-purple text-white px-6 py-3 rounded-osmo font-semibold hover:bg-purple-700 transition-all shadow-osmo"
            >
              Start Analysis
            </button>
          </div>
        ) : (
          <>
            {/* History Grid */}
            <div className="grid gap-6 mb-8">
              {history.map((item) => (
                <div key={item.id} className="bg-white rounded-osmo-lg border border-gray-200 p-6 shadow-osmo hover:shadow-osmo-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-bold text-osmo-dark">
                          {item.document_name}
                        </h3>
                        {item.compliance_score !== null && (
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getComplianceScoreColor(item.compliance_score)}`}>
                            {item.compliance_score}% Compliance
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Document Type</span>
                          <p className="font-semibold text-gray-800">{item.document_type || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Industry</span>
                          <p className="font-semibold text-gray-800">{item.industry || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Gaps Found</span>
                          <p className="font-semibold text-red-600">{item.gaps_found} gaps</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Analyzed</span>
                          <p className="font-semibold text-gray-800">{formatDate(item.created_at)}</p>
                        </div>
                      </div>

                      {item.frameworks && item.frameworks.length > 0 && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500 block mb-2">Frameworks</span>
                          <div className="flex flex-wrap gap-2">
                            {item.frameworks.map((framework, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-osmo-purple bg-opacity-10 text-osmo-purple rounded-full text-sm font-medium"
                              >
                                {framework}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleViewAnalysis(item.id)}
                        className="bg-osmo-purple text-white px-4 py-2 rounded-osmo font-semibold hover:bg-purple-700 transition-all shadow-osmo text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteAnalysis(item.id, item.document_name)}
                        className="bg-red-500 text-white px-4 py-2 rounded-osmo font-semibold hover:bg-red-600 transition-all shadow-osmo text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-osmo disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(pagination.pages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 border rounded-osmo ${
                      currentPage === index + 1
                        ? 'bg-osmo-purple text-white border-osmo-purple'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-osmo disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Analysis Details Modal */}
      <AnalysisDetailsModal
        analysis={selectedAnalysis}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default AnalysisHistory;

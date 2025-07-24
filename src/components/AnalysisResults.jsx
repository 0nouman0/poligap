import { useState } from 'react';
import DetailedPlan from './DetailedPlan';

function AnalysisResults({ analysis, onNavigate, isHistoryView = false, documentName, analysisDate }) {
  const [showDetailedPlan, setShowDetailedPlan] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    // Simulate plan generation time
    setTimeout(() => {
      setIsGeneratingPlan(false);
      setShowDetailedPlan(true);
    }, 2000); // 2 second loading animation
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Back Button for History View */}
      {isHistoryView && (
        <div className="bg-white border-b border-gray-200 p-6 shadow-osmo">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={() => onNavigate('history')}
              className="bg-osmo-dark text-white px-6 py-3 rounded-osmo font-bold hover:bg-gray-700 transition-all shadow-osmo"
            >
              ← Back to History
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-black text-osmo-dark">{documentName}</h1>
              <p className="text-gray-600">Analyzed on {formatDate(analysisDate)}</p>
            </div>
            <div></div>
          </div>
        </div>
      )}

      <div className={`${isHistoryView ? 'container mx-auto px-6 py-12' : ''}`}>
        <div className={`w-full bg-white rounded-osmo shadow-osmo p-8 space-y-6 ${!isHistoryView ? '' : 'max-w-6xl mx-auto'}`}>
      
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-osmo-blue to-osmo-purple rounded-osmo p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-osmo-green rounded-lg flex items-center justify-center mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analysis Results</h1>
              <p className="text-white opacity-90">Comprehensive compliance gap assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {analysis.totalGaps || analysis.gaps?.length || 0} 
              </div>
              <div className="text-white opacity-80 text-sm">Gaps Identified</div>
            </div>
            {analysis.overallScore && (
              <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold">
                Overall Score: {analysis.overallScore}%
              </div>
            )}
            {analysis.industryBenchmark && (
              <div className="bg-osmo-green text-white px-4 py-2 rounded-lg font-semibold">
                {analysis.industryBenchmark.comparison}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High Priority Items */}
      {analysis.gaps && analysis.gaps.some(gap => gap.severity === 'high') && (
        <div className="bg-red-50 border border-red-200 rounded-osmo p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">!</span>
            </div>
            <h2 className="text-xl font-semibold text-red-800">High Priority Items</h2>
          </div>
          <div className="space-y-3">
            {analysis.gaps.filter(gap => gap.severity === 'high').map((gap, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{gap.title || gap.issue}</h3>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    High Risk
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{gap.description || gap.issue}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      Impact: <span className="font-semibold text-red-600">{gap.impact || gap.businessImpact}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Timeline: <span className="font-semibold">{gap.timeline || gap.timeframe}</span>
                    </div>
                  </div>
                  <button className="text-osmo-blue hover:text-osmo-purple text-sm font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Gaps Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">All Identified Gaps</h2>
        <div className="grid gap-4">
          {analysis.gaps && analysis.gaps.map((gap, index) => {
            const severityColors = {
              high: 'border-red-200 bg-red-50',
              medium: 'border-yellow-200 bg-yellow-50', 
              low: 'border-blue-200 bg-blue-50'
            };
            
            const severityBadges = {
              high: 'bg-red-100 text-red-800',
              medium: 'bg-yellow-100 text-yellow-800',
              low: 'bg-blue-100 text-blue-800'
            };

            return (
              <div key={index} className={`bg-white rounded-osmo border p-6 ${severityColors[gap.severity] || 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{gap.title || gap.issue}</h3>
                    <p className="text-gray-600">{gap.description || gap.issue}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityBadges[gap.severity] || 'bg-gray-100 text-gray-800'}`}>
                      {gap.severity ? gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1) : 'Medium'} Priority
                    </span>
                    {gap.score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{gap.score}%</div>
                        <div className="text-xs text-gray-500">Compliance Score</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Impact</div>
                    <div className="text-sm text-gray-600">{gap.impact || gap.businessImpact || 'Not specified'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Timeline</div>
                    <div className="text-sm text-gray-600">{gap.timeline || gap.timeframe || 'Not specified'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Framework</div>
                    <div className="text-sm text-gray-600">{gap.framework || gap.category || 'General'}</div>
                  </div>
                </div>

                {(gap.recommendation || gap.remediation) && (
                  <div className="mt-4 p-4 bg-osmo-blue bg-opacity-10 rounded-lg">
                    <div className="text-sm font-semibold text-osmo-blue mb-1">Recommendation</div>
                    <div className="text-sm text-gray-700">{gap.recommendation || gap.remediation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Industry Benchmark */}
      {analysis.industryBenchmark && (
        <div className="bg-white rounded-osmo shadow-osmo border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Industry Benchmark</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Your Score</span>
                <span className="text-2xl font-bold text-osmo-blue">{analysis.industryBenchmark.yourScore}%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-700">Industry Average</span>
                <span className="text-2xl font-bold text-gray-600">{analysis.industryBenchmark.industryAverage}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-osmo-green bg-opacity-10 rounded-lg">
                <div className="font-semibold text-osmo-green mb-2">Performance Status</div>
                <div className="text-gray-700">{analysis.industryBenchmark.comparison}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-700 mb-2">Key Insights</div>
                <div className="text-gray-700 text-sm">{analysis.industryBenchmark.insights || 'Your organization shows strong compliance practices compared to industry standards.'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleGeneratePlan}
          disabled={isGeneratingPlan}
          className="flex-1 bg-osmo-purple hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-osmo transition-colors duration-200 flex items-center justify-center"
        >
          {isGeneratingPlan ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
              Generating Detailed Plan...
            </>
          ) : (
            <>
              <span className="mr-2">📋</span>
              Generate Detailed Implementation Plan
            </>
          )}
        </button>
        <button className="flex-1 bg-white border-2 border-osmo-blue text-osmo-blue hover:bg-osmo-blue hover:text-white font-semibold py-4 px-8 rounded-osmo transition-colors duration-200">
          <span className="mr-2">💾</span>
          Export Report
        </button>
      </div>

      {/* Detailed Plan Modal/Section */}
      {showDetailedPlan && (
        <DetailedPlan 
          analysis={analysis} 
          onClose={() => setShowDetailedPlan(false)}
        />
      )}
        </div>
      </div>
    </div>
  );
}

export default AnalysisResults;

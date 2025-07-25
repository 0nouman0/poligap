import { useState, useEffect } from 'react';

function ComplianceMonitor({ onNavigate }) {
  const [selectedRegulations, setSelectedRegulations] = useState(['gdpr', 'ccpa']);
  const [alerts, setAlerts] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Mock regulation data
  const regulations = [
    { 
      id: 'gdpr', 
      name: 'GDPR', 
      fullName: 'General Data Protection Regulation',
      jurisdiction: 'EU',
      status: 'Active',
      riskLevel: 'High',
      lastChange: '2024-12-15'
    },
    { 
      id: 'ccpa', 
      name: 'CCPA', 
      fullName: 'California Consumer Privacy Act',
      jurisdiction: 'California, US',
      status: 'Active',
      riskLevel: 'Medium',
      lastChange: '2024-11-22'
    },
    { 
      id: 'hipaa', 
      name: 'HIPAA', 
      fullName: 'Health Insurance Portability and Accountability Act',
      jurisdiction: 'US',
      status: 'Active',
      riskLevel: 'High',
      lastChange: '2024-10-08'
    },
    { 
      id: 'sox', 
      name: 'SOX', 
      fullName: 'Sarbanes-Oxley Act',
      jurisdiction: 'US',
      status: 'Active',
      riskLevel: 'Medium',
      lastChange: '2024-09-15'
    },
    { 
      id: 'pci', 
      name: 'PCI DSS', 
      fullName: 'Payment Card Industry Data Security Standard',
      jurisdiction: 'Global',
      status: 'Active',
      riskLevel: 'High',
      lastChange: '2024-12-01'
    },
  ];

  // Mock recent alerts data
  const mockAlerts = [
    {
      id: 1,
      regulation: 'GDPR',
      type: 'Update',
      severity: 'Medium',
      title: 'New guidance on AI systems published',
      description: 'European Data Protection Board releases updated guidance on automated decision-making',
      date: '2024-12-15',
      impact: 'Review AI/ML processes for compliance'
    },
    {
      id: 2,
      regulation: 'CCPA',
      type: 'Amendment',
      severity: 'High',
      title: 'CPRA enforcement updates',
      description: 'New enforcement priorities announced by California Privacy Protection Agency',
      date: '2024-12-10',
      impact: 'Update privacy notice and consent mechanisms'
    },
    {
      id: 3,
      regulation: 'PCI DSS',
      type: 'Standard Update',
      severity: 'High',
      title: 'PCI DSS v4.0 transition deadline approaching',
      description: 'Organizations must transition to PCI DSS v4.0 by March 2024',
      date: '2024-12-01',
      impact: 'Schedule security assessment and update controls'
    }
  ];

  const startMonitoring = () => {
    setMonitoring(true);
    setAlerts(mockAlerts);
    setLastUpdate(new Date());
  };

  const stopMonitoring = () => {
    setMonitoring(false);
    setAlerts([]);
    setLastUpdate(null);
  };

  const toggleRegulation = (regId) => {
    setSelectedRegulations(prev => 
      prev.includes(regId) 
        ? prev.filter(id => id !== regId)
        : [...prev, regId]
    );
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'High': return 'border-red-200 bg-red-50';
      case 'Medium': return 'border-yellow-200 bg-yellow-50';
      case 'Low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('landing')}
                className="group bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:from-slate-800 hover:to-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center space-x-2">
                  <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                  <span>Back</span>
                </span>
              </button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">Compliance Monitor</h1>
                <p className="text-gray-600 text-lg font-medium mt-1">Real-time regulatory updates and alerts</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {monitoring ? (
                <button
                  onClick={stopMonitoring}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-2">
                    <span>⏹️</span>
                    <span>Stop Monitoring</span>
                  </span>
                </button>
              ) : (
                <button
                  onClick={startMonitoring}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center space-x-2">
                    <span>▶️</span>
                    <span>Start Monitoring</span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Status Banner */}
        <div className={`rounded-2xl p-6 shadow-lg border-2 ${monitoring ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${monitoring ? 'bg-emerald-500 animate-pulse shadow-lg' : 'bg-gray-400'}`}></div>
              <span className="font-bold text-xl text-slate-800">
                {monitoring ? 'Actively Monitoring' : 'Monitoring Disabled'}
              </span>
              {lastUpdate && (
                <span className="text-gray-600 font-medium">
                  Last update: {lastUpdate.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-gray-600 font-medium">
              {selectedRegulations.length} regulation{selectedRegulations.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Enhanced Regulation Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent mb-6">Select Regulations to Monitor</h2>
              <div className="space-y-4">
                {regulations.map(reg => (
                  <div key={reg.id} className="border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            checked={selectedRegulations.includes(reg.id)}
                            onChange={() => toggleRegulation(reg.id)}
                            className="mr-4 w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                          />
                          <div>
                            <div className="font-bold text-slate-800 text-lg">{reg.name}</div>
                            <div className="text-gray-600 font-medium">{reg.fullName}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-lg">{reg.jurisdiction}</span>
                          <span className={`px-3 py-1 rounded-xl text-sm font-bold ${getRiskColor(reg.riskLevel)} shadow-sm`}>
                            {reg.riskLevel} Risk
                          </span>
                        </div>
                        <div className="text-gray-500 mt-3 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                          Last change: {reg.lastChange}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts and Updates */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-osmo shadow-osmo p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts & Updates</h2>
              
              {!monitoring ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Monitoring</h3>
                  <p className="text-gray-600 mb-4">Enable monitoring to receive real-time regulatory updates and alerts</p>
                  <button
                    onClick={startMonitoring}
                    className="bg-osmo-blue hover:bg-blue-600 text-white px-6 py-3 rounded-osmo font-semibold transition-colors duration-200"
                  >
                    Begin Monitoring
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-osmo-purple">{alert.regulation}</span>
                            <span className="bg-osmo-blue text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {alert.type}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{alert.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-semibold text-gray-900">{alert.date}</div>
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.severity}
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded p-3">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Recommended Action:</div>
                        <div className="text-sm text-gray-600">{alert.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compliance Dashboard */}
        {monitoring && (
          <div className="bg-white rounded-osmo shadow-osmo p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Compliance Dashboard</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Active Monitors</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-3xl font-bold text-yellow-600">{alerts.length}</div>
                <div className="text-sm text-gray-600">Recent Alerts</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Coverage</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplianceMonitor;

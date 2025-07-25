import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

function ComplianceMonitor({ onNavigate }) {
  const [selectedRegulations, setSelectedRegulations] = useState(['gdpr', 'ccpa']);
  const [alerts, setAlerts] = useState([]);
  const [monitoring, setMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [realTimeData, setRealTimeData] = useState({
    activeMonitors: 0,
    uptime: 98,
    issuesDetected: 0,
    riskScore: 85
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // connected, connecting, disconnected
  const intervalRef = useRef(null);
  const activityIntervalRef = useRef(null);
  const alertIdCounter = useRef(100);

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

  // Enhanced mock alerts with more realistic data
  const mockAlerts = [
    {
      id: 1,
      regulation: 'GDPR',
      type: 'Update',
      severity: 'Medium',
      title: 'New guidance on AI systems published',
      description: 'European Data Protection Board releases updated guidance on automated decision-making',
      date: new Date().toISOString().split('T')[0],
      impact: 'Review AI/ML processes for compliance',
      timestamp: new Date()
    },
    {
      id: 2,
      regulation: 'CCPA',
      type: 'Amendment',
      severity: 'High',
      title: 'CPRA enforcement updates',
      description: 'New enforcement priorities announced by California Privacy Protection Agency',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      impact: 'Update privacy notice and consent mechanisms',
      timestamp: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      regulation: 'PCI DSS',
      type: 'Standard Update',
      severity: 'High',
      title: 'PCI DSS v4.0 transition deadline approaching',
      description: 'Organizations must transition to PCI DSS v4.0 by March 2024',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      impact: 'Schedule security assessment and update controls',
      timestamp: new Date(Date.now() - 172800000)
    }
  ];

  // Generate random new alerts for real-time simulation
  const generateRandomAlert = () => {
    const alertTypes = ['Update', 'Amendment', 'Violation', 'Warning', 'Critical'];
    const severities = ['High', 'Medium', 'Low'];
    const regulationsList = selectedRegulations.map(id => 
      regulations.find(reg => reg.id === id)?.name || id.toUpperCase()
    );
    
    const sampleAlerts = [
      {
        title: 'Data breach notification required',
        description: 'Potential data exposure detected in system logs',
        impact: 'Immediate notification to authorities required'
      },
      {
        title: 'Cookie consent mechanism update',
        description: 'New requirements for explicit consent tracking',
        impact: 'Update website consent banners'
      },
      {
        title: 'Access log anomaly detected',
        description: 'Unusual data access patterns identified',
        impact: 'Review access controls and audit trails'
      },
      {
        title: 'Third-party vendor compliance check',
        description: 'Vendor assessment deadline approaching',
        impact: 'Complete vendor security questionnaire'
      },
      {
        title: 'Employee training completion overdue',
        description: 'Compliance training not completed by deadline',
        impact: 'Schedule mandatory training sessions'
      }
    ];

    const randomAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    const randomRegulation = regulationsList[Math.floor(Math.random() * regulationsList.length)];
    const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];

    return {
      id: alertIdCounter.current++,
      regulation: randomRegulation,
      type: randomType,
      severity: randomSeverity,
      title: randomAlert.title,
      description: randomAlert.description,
      date: new Date().toISOString().split('T')[0],
      impact: randomAlert.impact,
      timestamp: new Date(),
      isNew: true
    };
  };

  // Real-time monitoring simulation with more frequent updates
  const simulateRealTimeMonitoring = () => {
    // Update real-time metrics with more dynamic changes
    setRealTimeData(prev => ({
      activeMonitors: selectedRegulations.length,
      uptime: Math.min(99.9, Math.max(95.0, prev.uptime + (Math.random() - 0.5) * 0.2)),
      issuesDetected: prev.issuesDetected + (Math.random() > 0.7 ? 1 : 0),
      riskScore: Math.max(0, Math.min(100, prev.riskScore + (Math.random() - 0.5) * 8))
    }));

    // More frequent alert generation (30% chance every check)
    if (Math.random() > 0.7) {
      const newAlert = generateRandomAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 15)); // Keep more alerts for better real-time feel
      
      // Show toast notification for new alert
      toast.warn(`🚨 New ${newAlert.severity} priority alert: ${newAlert.title}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Simulate system events (60% chance)
    if (Math.random() > 0.4) {
      const systemEvents = [
        'Compliance scan completed',
        'Risk assessment updated',
        'Data source synchronized',
        'Regulation database refreshed',
        'Security check performed',
        'Audit trail updated'
      ];
      
      const randomEvent = systemEvents[Math.floor(Math.random() * systemEvents.length)];
      
      // Add to activity feed (we'll create this)
      setActivityFeed(prev => [{
        id: Date.now(),
        event: randomEvent,
        timestamp: new Date(),
        icon: '✓'
      }, ...prev].slice(0, 10));
    }

    setLastUpdate(new Date());
  };

  // Start real-time monitoring with multiple intervals for different update frequencies
  const startMonitoring = () => {
    setMonitoring(true);
    setConnectionStatus('connecting');
    setAlerts(mockAlerts);
    setLastUpdate(new Date());
    
    // Initialize activity feed
    setActivityFeed([
      { id: 1, event: 'Real-time monitoring started', timestamp: new Date(), icon: '🟢' },
      { id: 2, event: 'Connecting to compliance feeds', timestamp: new Date(Date.now() - 1000), icon: '📡' },
      { id: 3, event: 'Security protocols enabled', timestamp: new Date(Date.now() - 2000), icon: '🔒' }
    ]);
    
    // Simulate connection establishment
    setTimeout(() => {
      setConnectionStatus('connected');
      toast.success('🚀 Real-time compliance monitoring is now active!', {
        position: "top-right",
        autoClose: 3000,
      });
    }, 1500);

    // Main real-time updates every 15 seconds (more frequent)
    intervalRef.current = setInterval(simulateRealTimeMonitoring, 15000);
    
    // Activity feed updates every 5 seconds
    activityIntervalRef.current = setInterval(() => {
      const quickEvents = [
        'System heartbeat check',
        'Data stream validated',
        'Connection status verified',
        'Metrics updated',
        'Cache refreshed'
      ];
      
      if (Math.random() > 0.3) {
        const randomEvent = quickEvents[Math.floor(Math.random() * quickEvents.length)];
        setActivityFeed(prev => [{
          id: Date.now(),
          event: randomEvent,
          timestamp: new Date(),
          icon: '💫'
        }, ...prev].slice(0, 8));
      }
    }, 5000);
    
    setRealTimeData({
      activeMonitors: selectedRegulations.length,
      uptime: 98.5,
      issuesDetected: 0,
      riskScore: 85
    });
  };

  // Stop real-time monitoring
  const stopMonitoring = () => {
    setMonitoring(false);
    setConnectionStatus('disconnected');
    setAlerts([]);
    setLastUpdate(null);
    setActivityFeed([]);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current);
      activityIntervalRef.current = null;
    }
    
    toast.info('📴 Real-time compliance monitoring stopped', {
      position: "top-right",
      autoClose: 2000,
    });
    
    setRealTimeData({
      activeMonitors: 0,
      uptime: 0,
      issuesDetected: 0,
      riskScore: 0
    });
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (activityIntervalRef.current) {
        clearInterval(activityIntervalRef.current);
      }
    };
  }, []);

  // Update active monitors when selected regulations change
  useEffect(() => {
    if (monitoring) {
      setRealTimeData(prev => ({
        ...prev,
        activeMonitors: selectedRegulations.length
      }));
    }
  }, [selectedRegulations, monitoring]);

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

  const getConnectionStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'bg-emerald-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Auto-update timestamps every second for more dynamic feel
  useEffect(() => {
    if (monitoring) {
      const timestampInterval = setInterval(() => {
        // Force re-render to update timestamps
        setLastUpdate(new Date());
      }, 1000);
      
      return () => clearInterval(timestampInterval);
    }
  }, [monitoring]);

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

        {/* Enhanced Status Banner with Real-time Connection Status */}
        <div className={`rounded-2xl p-6 shadow-lg border-2 ${monitoring ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${getConnectionStatusColor()} shadow-lg`}></div>
              <span className="font-bold text-xl text-slate-800">
                {connectionStatus === 'connected' ? 'Real-time Monitoring Active' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 
                 'Monitoring Disabled'}
              </span>
              {lastUpdate && (
                <span className="text-gray-600 font-medium">
                  Last update: {lastUpdate.toLocaleString()}
                </span>
              )}
              {monitoring && (
                <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Live</span>
                </div>
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

          {/* Real-time Alerts and Updates */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                  Real-time Alerts & Updates
                </h2>
                {monitoring && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-emerald-700">Auto-updating</span>
                    </div>
                    <span className="text-sm text-gray-600">{alerts.length} active alerts</span>
                  </div>
                )}
              </div>
              
              {!monitoring ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Real-time Monitoring</h3>
                  <p className="text-gray-600 mb-4">Enable monitoring to receive live regulatory updates and automated compliance alerts</p>
                  <button
                    onClick={startMonitoring}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Begin Real-time Monitoring
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {alerts.map((alert, index) => (
                    <div key={alert.id} className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${getSeverityColor(alert.severity)} ${alert.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 animate-pulse' : ''} ${index === 0 ? 'border-opacity-100' : 'border-opacity-70'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-bold text-slate-800 bg-white px-3 py-1 rounded-lg shadow-sm">{alert.regulation}</span>
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              {alert.type}
                            </span>
                            {alert.isNew && (
                              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                                🆕 NEW
                              </span>
                            )}
                            {index === 0 && (
                              <div className="flex items-center space-x-1 bg-red-50 px-2 py-1 rounded-md">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                <span className="text-xs font-bold text-red-700">LATEST</span>
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">{alert.title}</h3>
                          <p className="text-gray-700 mb-3 leading-relaxed">{alert.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded-lg shadow-sm mb-2">{alert.date}</div>
                          <div className={`text-xs text-gray-500 mb-2 ${formatTimestamp(alert.timestamp) === 'Just now' ? 'animate-pulse font-bold text-emerald-600' : ''}`}>
                            {formatTimestamp(alert.timestamp)}
                          </div>
                          <div className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                            alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {alert.severity} Priority
                          </div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white border-opacity-50">
                        <div className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                          Recommended Action:
                        </div>
                        <div className="text-sm text-gray-700 font-medium">{alert.impact}</div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && monitoring && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-emerald-600">✓</span>
                      </div>
                      <p className="text-gray-600 font-medium">No alerts at this time. Monitoring is active.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Compliance Dashboard */}
        {monitoring && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                Live Compliance Dashboard
              </h2>
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Real-time data</span>
              </div>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-4xl font-black text-emerald-600 mr-2">{realTimeData.activeMonitors}</div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-sm font-bold text-gray-700">Active Monitors</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1 animate-ping"></span>
                  Live tracking
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-4xl font-black text-blue-600 mr-2">{alerts.length}</div>
                  {alerts.length > 0 && <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>}
                </div>
                <div className="text-sm font-bold text-gray-700">Active Alerts</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></span>
                  Auto-updated
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-4xl font-black text-purple-600 mr-2">{realTimeData.uptime.toFixed(1)}%</div>
                  <div className={`w-3 h-3 rounded-full ${realTimeData.uptime > 99 ? 'bg-green-500 animate-pulse' : realTimeData.uptime > 95 ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-bounce'}`}></div>
                </div>
                <div className="text-sm font-bold text-gray-700">System Uptime</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-1 animate-pulse"></span>
                  Last 30 days
                </div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-4xl font-black text-orange-600 mr-2">{realTimeData.riskScore.toFixed(0)}</div>
                  <div className={`w-3 h-3 rounded-full ${realTimeData.riskScore < 30 ? 'bg-green-500 animate-pulse' : realTimeData.riskScore < 70 ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-bounce'}`}></div>
                </div>
                <div className="text-sm font-bold text-gray-700">Risk Score</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center justify-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-1 animate-pulse"></span>
                  Dynamic assessment
                </div>
              </div>
            </div>
            
            {/* Enhanced Real-time Activity Feed */}
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Live Activity Stream
                <div className="ml-auto flex items-center space-x-2 bg-emerald-50 px-2 py-1 rounded-md">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-xs font-medium text-emerald-700">LIVE</span>
                </div>
              </h3>
              <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                {activityFeed.map((activity, index) => (
                  <div key={activity.id} className={`flex items-center justify-between bg-white px-3 py-2 rounded-lg shadow-sm transition-all duration-300 ${index === 0 ? 'ring-1 ring-blue-200' : ''}`}>
                    <span className="text-gray-700 flex items-center">
                      <span className="mr-2">{activity.icon}</span>
                      {activity.event}
                    </span>
                    <span className="text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                ))}
                {activityFeed.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <span className="animate-pulse">Waiting for activity...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplianceMonitor;

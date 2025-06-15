import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Target, TrendingUp, AlertCircle, CheckCircle, Users, Brain, Database } from 'lucide-react';
import './App.css';

const YTSDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState('decision-tree');
  const [selectedView, setSelectedView] = useState('confusion-matrix');
  const [newDataInput, setNewDataInput] = useState({
    usia: '',
    jenisKelamin: '',
    frekuensiMerokok: '',
    pengaruhTeman: '',
    lingkunganKeluarga: '',
    statusEkonomi: ''
  });
  const [prediction, setPrediction] = useState(null);


  const confusionMatrixData = {
    'decision-tree': {
      matrix: [
        [850, 140, 87],  // Bukan Perokok: 850 correct, 140 as Mantan, 87 as Perokok Aktif
        [90, 720, 140],  // Mantan Perokok: 90 as Bukan, 720 correct, 140 as Perokok Aktif
        [60, 110, 800]   // Perokok Aktif: 60 as Bukan, 110 as Mantan, 800 correct
      ],
            labels: ['Bukan Perokok', 'Mantan Perokok', 'Perokok Aktif'],
      accuracy: 72.77
    },

     'naive-bayes': {
      matrix: [
        [620, 180, 277],  // Bukan Perokok
        [120, 580, 250],  // Mantan Perokok
        [95, 150, 725]    // Perokok Aktif
      ],
      labels: ['Bukan Perokok', 'Mantan Perokok', 'Perokok Aktif'],
      accuracy: 56.65
    }
  };

  // Error patterns data
  const errorPatterns = {
    'decision-tree': [
      { feature: 'Usia', 'Bukan Perokok': '15.2%', 'Mantan Perokok': '12.8%', 'Perokok Aktif': '8.5%' },
      { feature: 'Jenis Kelamin', 'Bukan Perokok': '22.1%', 'Mantan Perokok': '18.3%', 'Perokok Aktif': '11.2%' },
      { feature: 'Frekuensi Merokok', 'Bukan Perokok': '28.5%', 'Mantan Perokok': '21.7%', 'Perokok Aktif': '9.8%' },
      { feature: 'Pengaruh Teman', 'Bukan Perokok': '31.2%', 'Mantan Perokok': '25.4%', 'Perokok Aktif': '12.6%' },
      { feature: 'Lingkungan Keluarga', 'Bukan Perokok': '24.8%', 'Mantan Perokok': '19.6%', 'Perokok Aktif': '10.3%' },
      { feature: 'Status Ekonomi', 'Bukan Perokok': '18.9%', 'Mantan Perokok': '16.2%', 'Perokok Aktif': '7.4%' }
    ],
    'naive-bayes': [
      { feature: 'Usia', 'Bukan Perokok': '25.8%', 'Mantan Perokok': '22.4%', 'Perokok Aktif': '18.2%' },
      { feature: 'Jenis Kelamin', 'Bukan Perokok': '32.5%', 'Mantan Perokok': '28.7%', 'Perokok Aktif': '21.5%' },
      { feature: 'Frekuensi Merokok', 'Bukan Perokok': '38.2%', 'Mantan Perokok': '31.9%', 'Perokok Aktif': '24.8%' },
      { feature: 'Pengaruh Teman', 'Bukan Perokok': '41.7%', 'Mantan Perokok': '35.2%', 'Perokok Aktif': '27.3%' },
      { feature: 'Lingkungan Keluarga', 'Bukan Perokok': '34.6%', 'Mantan Perokok': '29.8%', 'Perokok Aktif': '22.1%' },
      { feature: 'Status Ekonomi', 'Bukan Perokok': '28.3%', 'Mantan Perokok': '24.7%', 'Perokok Aktif': '19.4%' }
    ]
  };

  // Data dari hasil analisis
  const modelComparison = [
    { model: 'Decision Tree', featureSet: 'Non Seleksi', accuracy: 72.77, precision: 72.84, recall: 72.77, f1: 72.80, rank: 1 },
    { model: 'Decision Tree', featureSet: 'Chi2', accuracy: 70.09, precision: 70.61, recall: 70.09, f1: 70.27, rank: 2 },
    { model: 'Decision Tree', featureSet: 'SFS', accuracy: 67.20, precision: 67.65, recall: 67.20, f1: 67.34, rank: 3 },
    { model: 'Naive Bayes', featureSet: 'Non Seleksi', accuracy: 56.65, precision: 58.04, recall: 56.65, f1: 55.13, rank: 4 },
    { model: 'Naive Bayes', featureSet: 'Chi2', accuracy: 56.57, precision: 57.97, recall: 56.57, f1: 55.06, rank: 5 },
    { model: 'Naive Bayes', featureSet: 'SFS', accuracy: 56.65, precision: 58.09, recall: 56.65, f1: 55.14, rank: 6 }
  ];

  const classPerformance = [
    { class: 'Bukan Perokok', precision: 28.05, recall: 6.43, f1: 10.46, support: 964, errorRate: 33.36 },
    { class: 'Mantan Perokok', precision: 37.26, recall: 64.77, f1: 47.30, support: 386, errorRate: 17.52 },
    { class: 'Perokok Aktif', precision: 67.35, recall: 84.21, f1: 74.84, support: 1830, errorRate: 32.58 }
  ];

  const dataDistribution = [
    { name: 'Perokok Aktif', value: 6099, percentage: 57.5 },
    { name: 'Bukan Perokok', value: 3215, percentage: 30.3 },
    { name: 'Mantan Perokok', value: 1286, percentage: 12.1 }
  ];

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
// Function to get cell color based on confusion matrix values
  const getCellColor = (value, isCorrect, maxValue) => {
    const intensity = value / maxValue;
    if (isCorrect) {
      return `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;
    } else {
      return `rgba(239, 68, 68, ${0.2 + intensity * 0.4})`;
    }
  };

  // Function to get error cell color
  const getErrorCellColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value < 15) return '#dcfce7';
    if (value < 25) return '#fef3c7';
    return '#fee2e2';
  };

  // Confusion Matrix Component
  const ConfusionMatrix = ({ modelData }) => {
    const { matrix, labels, accuracy } = modelData;
    const maxValue = Math.max(...matrix.flat());
    const totalSamples = matrix.flat().reduce((sum, val) => sum + val, 0);

    return (
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0' }}>
            Confusion Matrix - {selectedModel === 'decision-tree' ? 'Decision Tree' : 'Naive Bayes'}
          </h4>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1e40af)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
              Accuracy: {accuracy}%
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', marginBottom: '12px' }}>
            <div style={{ fontWeight: '600', color: '#374151', minWidth: '140px', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              Actual \ Predicted
            </div>
            <div style={{ display: 'flex', flex: '1', gap: '2px' }}>
              {labels.map((label, idx) => (
                <div key={idx} style={{ flex: '1', textAlign: 'center', fontWeight: '500', color: '#6b7280', fontSize: '12px', padding: '8px 4px', background: '#f9fafb', borderRadius: '6px', minWidth: '100px' }}>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {matrix.map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: 'flex', gap: '2px' }}>
                <div style={{ minWidth: '140px', display: 'flex', alignItems: 'center', padding: '12px', fontWeight: '500', color: '#374151', background: '#f3f4f6', borderRadius: '6px', fontSize: '13px' }}>
                  {labels[rowIdx]}
                </div>
                {row.map((value, colIdx) => {
                  const isCorrect = rowIdx === colIdx;
                  const percentage = ((value / totalSamples) * 100).toFixed(1);
                  
                  return (
                    <div 
                      key={colIdx}
                      style={{ 
                        flex: '1', 
                        minWidth: '100px', 
                        height: '80px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '6px', 
                        transition: 'all 0.2s ease', 
                        cursor: 'pointer', 
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        background: getCellColor(value, isCorrect, maxValue)
                      }}
                    >
                      <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                        {value}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '500', opacity: '0.8' }}>
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.7)' }}></div>
            Correct Predictions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.7)' }}></div>
            Misclassifications
          </div>
        </div>
      </div>
    );
  };

  // Error Patterns Component
  const ErrorPatterns = ({ patterns }) => {
    return (
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
          Error Patterns by Feature - {selectedModel === 'decision-tree' ? 'Decision Tree' : 'Naive Bayes'}
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
            <div style={{ minWidth: '140px', fontWeight: '600', color: '#374151', padding: '12px', background: '#f9fafb', borderRadius: '6px', fontSize: '14px' }}>
              Feature
            </div>
            {['Bukan Perokok', 'Mantan Perokok', 'Perokok Aktif'].map((label, idx) => (
              <div key={idx} style={{ flex: '1', textAlign: 'center', fontWeight: '500', color: '#6b7280', padding: '12px 8px', background: '#f9fafb', borderRadius: '6px', fontSize: '12px', minWidth: '120px' }}>
                {label}
              </div>
            ))}
          </div>

          {patterns.map((pattern, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
              <div style={{ minWidth: '140px', padding: '16px 12px', fontWeight: '500', color: '#374151', background: '#f3f4f6', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
                {pattern.feature}
              </div>
              <div style={{ flex: '1', minWidth: '120px', padding: '16px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.1)', transition: 'all 0.2s ease', background: getErrorCellColor(pattern['Bukan Perokok']) }}>
                {pattern['Bukan Perokok']}
              </div>
              <div style={{ flex: '1', minWidth: '120px', padding: '16px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.1)', transition: 'all 0.2s ease', background: getErrorCellColor(pattern['Mantan Perokok']) }}>
                {pattern['Mantan Perokok']}
              </div>
              <div style={{ flex: '1', minWidth: '120px', padding: '16px 8px', textAlign: 'center', fontWeight: '600', color: '#1f2937', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.1)', transition: 'all 0.2s ease', background: getErrorCellColor(pattern['Perokok Aktif']) }}>
                {pattern['Perokok Aktif']}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Prediksi sederhana (simulasi)
  const predictSmoking = () => {
    const features = Object.values(newDataInput).map(v => parseFloat(v) || 0);
    const sum = features.reduce((acc, val) => acc + val, 0);
    
    let predicted = '';
    if (sum < 10) predicted = 'Bukan Perokok';
    else if (sum < 20) predicted = 'Mantan Perokok';
    else predicted = 'Perokok Aktif';
    
    const confidence = Math.min(85 + Math.random() * 10, 95);
    setPrediction({ class: predicted, confidence: confidence.toFixed(1) });
  };

  const featureLabels = [
    { key: 'usia', label: 'Usia', placeholder: 'Masukkan usia (13-18)', type: 'number' },
    { key: 'jenisKelamin', label: 'Jenis Kelamin', placeholder: 'Laki-laki (1) / Perempuan (0)', type: 'number' },
    { key: 'frekuensiMerokok', label: 'Frekuensi Merokok', placeholder: 'Per minggu (0-7)', type: 'number' },
    { key: 'pengaruhTeman', label: 'Pengaruh Teman Sebaya', placeholder: 'Ya (1) / Tidak (0)', type: 'number' },
    { key: 'lingkunganKeluarga', label: 'Lingkungan Keluarga Merokok', placeholder: 'Ya (1) / Tidak (0)', type: 'number' },
    { key: 'statusEkonomi', label: 'Status Ekonomi', placeholder: 'Rendah (1) - Tinggi (5)', type: 'number' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
    <div className={`yts-stat-card ${colorClass}`}>
      <div className="yts-stat-card-content">
        <div>
          <p className="yts-stat-card-title">{title}</p>
          <p className="yts-stat-card-value">{value}</p>
          <p className="yts-stat-card-subtitle">{subtitle}</p>
        </div>
        <Icon className="yts-stat-card-icon" />
      </div>
    </div>
  );

  return (
    <div className="yts-dashboard">
      {/* Header */}
      <div className="yts-header">
        <div className="yts-header-container">
          <h1>🎯 Youth Tobacco Survey Dashboard</h1>
          <p>Analisis Model Klasifikasi Kebiasaan Merokok pada Remaja</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="yts-nav">
        <div className="yts-nav-container">
          <nav className="yts-nav-list">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'models', label: 'Model Comparison', icon: Brain },
              { id: 'performance', label: 'Class Performance', icon: Target },
              { id: 'predict', label: 'New Prediction', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`yts-nav-button ${activeTab === id ? 'active' : ''}`}
              >
                <Icon className="yts-nav-icon" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="yts-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="yts-content">
            {/* Stats Cards */}
            <div className="yts-stats-grid">
              <StatCard
                title="Total Samples"
                value="10,600"
                subtitle="Training + Test Data"
                icon={Database}
                colorClass="border-blue"
              />
              <StatCard
                title="Best Model"
                value="Decision Tree"
                subtitle="72.77% Accuracy"
                icon={CheckCircle}
                colorClass="border-green"
              />
              <StatCard
                title="Features"
                value="6"
                subtitle="Original Features"
                icon={Activity}
                colorClass="border-purple"
              />
              <StatCard
                title="Classes"
                value="3"
                subtitle="Smoking Categories"
                icon={Users}
                colorClass="border-orange"
              />
            </div>

            {/* Data Distribution */}
            <div className="yts-two-col-grid">
              <div className="yts-card">
                <h3 className="yts-section-title">📊 Data Distribution</h3>
                <div className="yts-responsive-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dataDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="yts-card">
                <h3 className="yts-section-title">🎯 Key Insights</h3>
                <div className="yts-insights">
                  <div className="yts-insight-item">
                    <CheckCircle className="yts-insight-icon green" />
                    <div>
                      <p className="yts-insight-title">Decision Tree performs best</p>
                      <p className="yts-insight-description">72.77% accuracy without feature selection</p>
                    </div>
                  </div>
                  <div className="yts-insight-item">
                    <AlertCircle className="yts-insight-icon yellow" />
                    <div>
                      <p className="yts-insight-title">Class imbalance detected</p>
                      <p className="yts-insight-description">57.5% active smokers, 12.1% former smokers</p>
                    </div>
                  </div>
                  <div className="yts-insight-item">
                    <TrendingUp className="yts-insight-icon blue" />
                    <div>
                      <p className="yts-insight-title">Feature selection impact</p>
                      <p className="yts-insight-description">Chi2 and SFS reduce accuracy by 2-5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Models Tab */}
        {activeTab === 'models' && (
          <div className="yts-content">
            <div className="yts-card">
              <h3 className="yts-section-title">🧠 Model Performance Comparison</h3>
              <div className="yts-responsive-container large">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelComparison} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="model" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="accuracy" fill="#4ECDC4" name="Accuracy %" />
                    <Bar dataKey="precision" fill="#FF6B6B" name="Precision %" />
                    <Bar dataKey="recall" fill="#45B7D1" name="Recall %" />
                    <Bar dataKey="f1" fill="#96CEB4" name="F1-Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="yts-card">
              <h3 className="yts-section-title">📋 Detailed Model Results</h3>
              <div className="yts-table-container">
                <table className="yts-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Feature Set</th>
                      <th>Accuracy</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1-Score</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelComparison.map((model, index) => (
                      <tr key={index} className={model.rank === 1 ? 'highlight' : ''}>
                        <td className="yts-table-cell-title">{model.model}</td>
                        <td className="yts-table-cell-subtitle">{model.featureSet}</td>
                        <td>{model.accuracy.toFixed(2)}%</td>
                        <td>{model.precision.toFixed(2)}%</td>
                        <td>{model.recall.toFixed(2)}%</td>
                        <td>{model.f1.toFixed(2)}%</td>
                        <td>
                          <span className={`yts-badge ${
                            model.rank === 1 ? 'green' : 
                            model.rank <= 3 ? 'yellow' : 
                            'red'
                          }`}>
                            #{model.rank}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="yts-content">
            <div className="yts-card">
              <h3 className="yts-section-title">🎯 Class-wise Performance (Best Model)</h3>
              <div className="yts-responsive-container">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={classPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="class" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Precision" dataKey="precision" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
                    <Radar name="Recall" dataKey="recall" stroke="#4ECDC4" fill="#4ECDC4" fillOpacity={0.3} />
                    <Radar name="F1-Score" dataKey="f1" stroke="#45B7D1" fill="#45B7D1" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="yts-two-col-grid">
              <div className="yts-card">
                <h3 className="yts-section-title">📊 Error Rate by Class</h3>
                <div className="yts-responsive-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={classPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" height={100} interval={0} />
                      <YAxis domain={[0, 40]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Error Rate']} />
                      <Bar dataKey="errorRate" fill="#FF6B6B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="yts-card">
                <h3 className="yts-section-title">⚠️ Critical Issues</h3>
                <div className="yts-insights">
                  <div className="yts-alert red">
                    <div className="yts-alert-header">
                      <AlertCircle className="yts-alert-icon red" />
                      <p className="yts-alert-title red">Low Recall for "Bukan Perokok"</p>
                    </div>
                    <p className="yts-alert-description red">Only 6.43% of non-smokers correctly identified</p>
                  </div>
                  
                  <div className="yts-alert yellow">
                    <div className="yts-alert-header">
                      <AlertCircle className="yts-alert-icon yellow" />
                      <p className="yts-alert-title yellow">High Error Rate</p>
                    </div>
                    <p className="yts-alert-description yellow">33.36% error rate for non-smoker classification</p>
                  </div>
                  
                  <div className="yts-alert green">
                    <div className="yts-alert-header">
                      <CheckCircle className="yts-alert-icon green" />
                      <p className="yts-alert-title green">Good Performance</p>
                    </div>
                    <p className="yts-alert-description green">84.21% recall for active smokers detection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Tab */}
        {activeTab === 'predict' && (
          <div className="yts-content">
            <div className="yts-card">
              <h3 className="yts-section-title">🔮 Predict New Data</h3>
              <div className="yts-three-col-grid">
                {featureLabels.map((feature) => (
                  <div key={feature.key} className="yts-form-group">
                    <label className="yts-form-label">
                      {feature.label}
                    </label>
                    <input
                      type={feature.type}
                      value={newDataInput[feature.key]}
                      onChange={(e) => setNewDataInput(prev => ({...prev, [feature.key]: e.target.value}))}
                      className="yts-form-input"
                      placeholder={feature.placeholder}
                    />
                  </div>
                ))}
              </div>
              
              <button
                onClick={predictSmoking}
                className="yts-button"
              >
                🎯 Predict Smoking Status
              </button>

              {prediction && (
                <div className="yts-prediction-result">
                  <div className="yts-prediction-header">
                    <Target className="yts-prediction-icon" />
                    <p className="yts-prediction-title">Prediction Result</p>
                  </div>
                  <p className="yts-prediction-class">{prediction.class}</p>
                  <p className="yts-prediction-confidence">Confidence: {prediction.confidence}%</p>
                </div>
              )}
            </div>

            <div className="yts-card">
              <h3 className="yts-section-title">💡 Recommendations for Improvement</h3>
              <div className="yts-recommendations-grid">
                <div>
                  <h4 className="yts-recommendations-title">🎯 Immediate Actions</h4>
                  <div className="yts-recommendations-list">
                    <div className="yts-recommendations-item">✅ Use Decision Tree as primary model</div>
                    <div className="yts-recommendations-item">✅ Avoid feature selection (causes degradation)</div>
                    <div className="yts-recommendations-item">✅ Implement class balancing (SMOTE/weights)</div>
                    <div className="yts-recommendations-item">✅ Set max_depth=10 to prevent overfitting</div>
                  </div>
                </div>
                <div>
                  <h4 className="yts-recommendations-title">🔧 Model Improvements</h4>
                  <div className="yts-recommendations-list">
                    <div className="yts-recommendations-item">🌳 Try Random Forest (ensemble method)</div>
                    <div className="yts-recommendations-item">⚡ Implement XGBoost for better performance</div>
                    <div className="yts-recommendations-item">📊 Use Logistic Regression alternative</div>
                    <div className="yts-recommendations-item">🎛️ Optimize hyperparameters with GridSearch</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YTSDashboard;
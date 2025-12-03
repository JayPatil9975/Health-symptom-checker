import { useState } from 'react';
import axios from 'axios';
import { Activity, AlertTriangle, CheckCircle, Stethoscope, ChevronRight, AlertCircle } from 'lucide-react';

// --- CONFIGURATION ---
// REPLACE with your actual n8n Webhook URL
const API_URL = "https://jayeshpatil007.app.n8n.cloud/webhook/symptom-check"; 

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(API_URL, { symptoms });
      const rawData = response.data;

      // --- UNIVERSAL UNWRAPPER LOGIC ---
      let processedData = rawData;
      
      // 1. Unwrap Array if needed
      if (Array.isArray(rawData) && rawData.length > 0) {
        processedData = rawData[0];
      }
      // 2. Unwrap 'output' key if present
      if (processedData && processedData.output) {
        processedData = processedData.output;
      }
      // 3. Unwrap 'json' key if present
      if (processedData && processedData.json) {
        processedData = processedData.json;
      }

      setResult(processedData);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to the analysis server. Please ensure n8n is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center space-y-2 mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Health Symptom Checker</h1>
          <p className="text-slate-500 font-medium">Educational Tool Only • Not Medical Advice</p>
        </header>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Describe your symptoms
          </label>
          <textarea
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[120px]"
            placeholder="E.g., I have a fever of 101°F, severe headache, and sensitivity to light..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button
            onClick={analyzeSymptoms}
            disabled={loading || !symptoms}
            className={`mt-4 w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <> <Stethoscope className="w-5 h-5" /> Analyze Symptoms </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Emergency Alert */}
            {result.emergencyWarning && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex gap-4 items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-800 text-lg">Potential Emergency</h3>
                  <p className="text-red-700">{result.emergencyWarning}</p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-800 text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p><strong>Disclaimer:</strong> {result.disclaimer}</p>
            </div>

            {/* Conditions Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Probable Conditions
              </h2>
              <div className="grid gap-4">
                {result.probableConditions?.map((cond, idx) => (
                  <div key={idx} className={`bg-white p-5 rounded-xl border-l-4 shadow-sm
                    ${cond.likelihood?.includes('High') ? 'border-red-500' : 'border-blue-400'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800">{cond.conditionName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${cond.likelihood?.includes('High') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {cond.likelihood}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3 text-sm">{cond.description}</p>
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-500">
                      <strong>Matching Symptoms:</strong> {Array.isArray(cond.matchingSymptoms) ? cond.matchingSymptoms.join(', ') : cond.matchingSymptoms}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations & Doctor Advice */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg mb-4 text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Recommended Steps
                </h3>
                <ul className="space-y-3">
                  {result.recommendations?.map((step, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm">
                      <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-lg mb-4 text-blue-800 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" /> When to see a Doctor
                </h3>
                <ul className="space-y-3">
                  {result.whenToSeeDoctor?.map((step, i) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0"></div>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import api from "../api";
import KPICard from "./KPICard";

const AI_SERVICE_URL = "http://127.0.0.1:8090";

export default function AdminPanel() {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [training, setTraining] = useState(false);
  const [trainingMessage, setTrainingMessage] = useState("");
  const [modelStatus, setModelStatus] = useState(false);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkModelStatus();
    loadStats();
  }, []);

  const checkModelStatus = async () => {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/model/status`);
      const data = await res.json();
      setModelStatus(data.model_trained || false);
    } catch (err) {
      console.error("Erreur lors de la vérification du statut du modèle:", err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get("/weekly-features/training-data");
      const data = res.data || [];
      
      const totalRecords = data.length;
      const uniqueStudents = new Set(data.map(d => d.studentId)).size;
      const uniqueCourses = new Set(data.map(d => d.courseId)).size;
      const totalWeeks = new Set(data.map(d => `${d.studentId}-${d.courseId}-${d.week}`)).size;
      const avgEvents = data.length > 0 
        ? (data.reduce((sum, d) => sum + (d.totalEvents || 0), 0) / data.length).toFixed(2)
        : 0;
      const atRisk = data.filter(d => d.label === 1).length;
      const atRiskPercent = totalRecords > 0 ? ((atRisk / totalRecords) * 100).toFixed(2) : 0;

      setStats({
        totalRecords,
        uniqueStudents,
        uniqueCourses,
        totalWeeks,
        avgEvents,
        atRisk,
        atRiskPercent
      });
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportMessage("");
  };

  const handleImport = async () => {
    if (!file) {
      setImportMessage("Veuillez sélectionner un fichier CSV");
      return;
    }

    setImporting(true);
    setImportMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/weekly-features/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImportMessage(`✅ ${res.data}`);
      setFile(null);
      document.getElementById("file-input").value = "";
      loadStats();
    } catch (err) {
      setImportMessage(`❌ Erreur lors de l'import : ${err.response?.data || err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleTrain = async () => {
    setTraining(true);
    setTrainingMessage("");

    try {
      const res = await api.get("/weekly-features/training-data");
      const trainingData = res.data || [];

      if (trainingData.length === 0) {
        setTrainingMessage("❌ Aucune donnée d'entraînement disponible. Importez d'abord des données CSV.");
        setTraining(false);
        return;
      }

      const features = trainingData.map(d => ({
        totalEvents: d.totalEvents || 0,
        logins: d.logins || 0,
        resourceViews: d.resourceViews || 0,
        submissions: d.submissions || 0,
        label: d.label || 0
      }));

      const trainRes = await fetch(`${AI_SERVICE_URL}/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!trainRes.ok) {
        throw new Error("Erreur lors de l'entraînement");
      }

      const metrics = await trainRes.json();
      setModelMetrics(metrics);
      setTrainingMessage("✅ Modèle entraîné avec succès !");
      checkModelStatus();
    } catch (err) {
      setTrainingMessage(`❌ Erreur lors de l'entraînement : ${err.message}`);
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Panneau d'Administration</h2>
        <p className="text-gray-600">Gérez les données et le modèle IA</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Enregistrements"
            value={stats?.totalRecords?.toLocaleString() || "0"}
            icon="📋"
            color="blue"
          />
          <KPICard
            title="Étudiants"
            value={stats?.uniqueStudents?.toLocaleString() || "0"}
            icon="👥"
            color="green"
          />
          <KPICard
            title="Cours"
            value={stats?.uniqueCourses?.toLocaleString() || "0"}
            icon="📚"
            color="purple"
          />
          <KPICard
            title="Semaines"
            value={stats?.totalWeeks?.toLocaleString() || "0"}
            icon="📅"
            color="yellow"
          />
          <KPICard
            title="Événements/semaine"
            value={stats?.avgEvents || "0"}
            icon="⚡"
            color="blue"
          />
          <KPICard
            title="À risque"
            value={`${stats?.atRiskPercent || "0"}%`}
            icon="⚠️"
            color="red"
            delay={100}
          />
        </div>
        <button
          onClick={loadStats}
          className="mt-4 btn-secondary"
        >
          🔄 Actualiser
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📥 Import Dataset CSV</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer block"
            >
              <p className="text-gray-600 mb-2">
                {file ? `Fichier sélectionné : ${file.name}` : "Glissez-déposez votre fichier CSV ici ou"}
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("file-input").click()}
                className="btn-primary"
              >
                Cliquez pour sélectionner
              </button>
            </label>
          </div>

          {importing && (
            <div className="text-center text-blue-600">
              ⏳ Import en cours...
            </div>
          )}

          {importMessage && (
            <div className={`p-4 rounded-lg ${
              importMessage.startsWith("✅")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {importMessage}
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={importing || !file}
            className="btn-primary w-full"
          >
            {importing ? "Import en cours..." : "Importer le fichier CSV"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🤖 Entraînement Modèle IA</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Statut du modèle :</strong>{" "}
              <span className={modelStatus ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {modelStatus ? "✅ Entraîné" : "❌ Non entraîné"}
              </span>
            </p>
          </div>

          {modelMetrics && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Métriques du modèle :</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Accuracy:</span>
                  <span className="font-bold ml-2">{modelMetrics.accuracy?.toFixed(3) || "N/A"}</span>
                </div>
                <div>
                  <span className="text-blue-700">Precision:</span>
                  <span className="font-bold ml-2">{modelMetrics.precision?.toFixed(3) || "N/A"}</span>
                </div>
                <div>
                  <span className="text-blue-700">Recall:</span>
                  <span className="font-bold ml-2">{modelMetrics.recall?.toFixed(3) || "N/A"}</span>
                </div>
                <div>
                  <span className="text-blue-700">ROC-AUC:</span>
                  <span className="font-bold ml-2">{modelMetrics.roc_auc?.toFixed(3) || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600">
            Entraînez le modèle de machine learning avec les données importées pour prédire le risque d'échec des étudiants.
          </p>

          {trainingMessage && (
            <div className={`p-4 rounded-lg ${
              trainingMessage.startsWith("✅")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              {trainingMessage}
            </div>
          )}

          <button
            onClick={handleTrain}
            disabled={training}
            className="btn-primary w-full"
          >
            {training ? "⏳ Entraînement en cours..." : "🚀 Réentraîner le Modèle"}
          </button>
        </div>
      </div>
    </div>
  );
}

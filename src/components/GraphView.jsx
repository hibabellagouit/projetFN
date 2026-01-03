import { useEffect, useState, useRef } from "react";
import Cytoscape from "cytoscape";
import api from "../api";
import RiskBadge from "./RiskBadge";

export default function GraphView({ studentId }) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cyRef = useRef(null);

  useEffect(() => {
    if (!studentId) return;

    setLoading(true);
    setError("");
    setRisk(null);

    api.get(`/graph/student/${studentId}`)
      .then(res => {
        const data = res.data;

        if (!data.nodes || data.nodes.length === 0) {
          setError("Aucun graphe trouvé pour cet étudiant");
          setLoading(false);
          return;
        }

        const container = document.getElementById("cy");
        if (!container) {
          setError("Conteneur de graphe introuvable");
          setLoading(false);
          return;
        }

        container.innerHTML = "";

        const getRiskColor = (value) => {
          if (value < 0.3) return "#28a745";
          if (value < 0.6) return "#ff9800";
          return "#dc3545";
        };

        const elements = [
          ...data.nodes.map(n => {
            const nodeData = {
              id: n.id,
              label: n.type === "RISK" ? `RISK: ${(n.data.value * 100).toFixed(0)}%` : n.type,
              type: n.type,
              ...n.data
            };
            if (n.type === "RISK" && n.data.value !== undefined) {
              nodeData.riskColor = getRiskColor(n.data.value);
            }
            return { data: nodeData };
          }),
          ...data.edges.map(e => ({
            data: {
              source: e.source,
              target: e.target,
              label: e.type
            }
          }))
        ];

        const riskNode = data.nodes.find(n => n.type === "RISK");
        if (riskNode) {
          setRisk(riskNode.data.value);
        }

        const cy = Cytoscape({
          container: container,
          elements,
          style: [
            {
              selector: "node",
              style: {
                label: "data(label)",
                "background-color": "#1976d2",
                color: "#fff",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
                "font-weight": "bold",
                width: "80px",
                height: "80px",
                shape: "round-rectangle"
              }
            },
            {
              selector: "node[type='STUDENT']",
              style: {
                "background-color": "#1976d2",
                width: "100px",
                height: "100px"
              }
            },
            {
              selector: "node[type='COURSE']",
              style: {
                "background-color": "#28a745"
              }
            },
            {
              selector: "node[type='WEEKLY_FEATURE']",
              style: {
                "background-color": "#ff9800"
              }
            },
            {
              selector: "node[type='RISK']",
              style: {
                "background-color": "data(riskColor)",
                width: "120px",
                height: "60px"
              }
            },
            {
              selector: "edge",
              style: {
                "line-color": "#999",
                width: 2,
                "target-arrow-color": "#999",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                label: "data(label)",
                "font-size": "10px",
                "text-rotation": "autorotate",
                "text-margin-y": -10
              }
            }
          ],
          layout: {
            name: "cose",
            animate: true,
            animationDuration: 500
          }
        });

        cyRef.current = cy;
        setLoading(false);
      })
      .catch(err => {
        console.error("Graph load failed", err);
        if (err.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
        } else if (err.response?.status === 404) {
          setError("Aucun graphe trouvé pour cet étudiant");
        } else {
          setError("Erreur lors du chargement du graphe : " + (err.message || "Erreur réseau"));
        }
        setLoading(false);
      });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [studentId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg text-gray-700">Chargement du graphe...</span>
        </div>
        <p className="text-gray-500">Analyse des données pédagogiques en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-800 flex items-center justify-center gap-2">
          <span className="text-2xl">❌</span>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-gray-800">Analyse de risque :</span>
            <RiskBadge risk={risk} />
          </div>
          {risk !== null && (
            <div className="text-sm text-gray-600">
              {risk < 0.3 && "✅ Risque faible - Bonne progression"}
              {risk >= 0.3 && risk < 0.6 && "⚠️ Risque modéré - Attention requise"}
              {risk >= 0.6 && "🔴 Risque élevé - Intervention nécessaire"}
            </div>
          )}
        </div>
      </div>
      <div
        id="cy"
        className="w-full border-2 border-gray-300 rounded-lg bg-white"
        style={{ height: "600px" }}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import api from "../api";
import GraphView from "./GraphView";
import RiskBadge from "./RiskBadge";

export default function StudentPanel() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token non trouvé");
      setLoading(false);
      return;
    }

    const decodeJWT = (token) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    };

    const decoded = decodeJWT(token);
    const email = decoded?.sub || decoded?.email;
    
    if (email) {
      const match = email.match(/\d+/);
      if (match) {
        setStudentId(parseInt(match[0]));
      } else {
        setError("Impossible de récupérer votre ID étudiant depuis votre email");
      }
    } else {
      api.get("/auth/me")
        .then((res) => {
          const userEmail = res.data.email;
          const match = userEmail.match(/\d+/);
          if (match) {
            setStudentId(parseInt(match[0]));
          } else {
            setError("Impossible de récupérer votre ID étudiant depuis votre email");
          }
        })
        .catch(() => {
          setError("Erreur lors de la récupération des informations utilisateur");
        });
    }
    setLoading(false);
  }, []);

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">Aucune donnée disponible pour le moment. Vos données d'activité apparaîtront ici une fois disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil Étudiant {studentId}</h2>
        <p className="text-gray-600">Visualisez votre activité et votre risque d'échec</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🕸️ Graphe d'Apprentissage</h3>
        <GraphView studentId={studentId} />
      </div>
    </div>
  );
}

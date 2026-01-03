import { useState, useEffect } from "react";
import api from "../api";
import GraphView from "./GraphView";
import RiskBadge from "./RiskBadge";

export default function TeacherPanel() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/graph/teacher/overview")
      .then((res) => {
        setStudents(res.data.students || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des données: " + (err.response?.data?.message || err.message));
        setLoading(false);
      });
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (selectedStudentId) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedStudentId(null)}
          className="btn-secondary mb-4"
        >
          ← Retour à la liste
        </button>
        <GraphView studentId={selectedStudentId} />
      </div>
    );
  }

  const totalStudents = students.length;
  const studentsAtRisk = students.filter(s => (s.riskScore || 0) >= 0.6).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Enseignant</h2>
        <p className="text-gray-600">Vue d'ensemble de tous les étudiants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Étudiants</p>
          <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Étudiants à Risque</p>
          <p className="text-3xl font-bold text-red-600">{studentsAtRisk}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <p className="text-sm font-medium text-gray-600 mb-1">Pourcentage à Risque</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalStudents > 0 ? Math.round((studentsAtRisk / totalStudents) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Liste des Étudiants</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    Aucun étudiant trouvé
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.studentName || `Étudiant ${student.studentId}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {student.courses && student.courses.length > 0
                        ? student.courses.join(", ")
                        : "Aucun cours"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RiskBadge risk={student.riskScore} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedStudentId(student.studentId)}
                        className="btn-primary"
                      >
                        Voir Graphe
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

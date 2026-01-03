import { useState } from "react";
import api from "../api";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const res = await api.post("/auth/login", { email, password });
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          // Redirection automatique gérée par RoleRouter
          onAuth();
        } else {
          setError("Identifiants invalides. Vérifiez votre email et mot de passe.");
        }
      } else {
        // Validation côté client
        if (password.length < 6) {
          setError("Le mot de passe doit contenir au moins 6 caractères");
          setLoading(false);
          return;
        }
        
        await api.post("/auth/register", { email, password, role });
        setMode("login");
        setError("");
        setPassword("");
        // Message de succès
        setError("✅ Inscription réussie ! Vous pouvez maintenant vous connecter.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (mode === "login") {
        if (err.response?.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else if (err.response?.status === 404) {
          setError("Compte non trouvé. Vérifiez votre email.");
        } else {
          setError(errorMessage || "Erreur de connexion. Vérifiez votre connexion internet.");
        }
      } else {
        if (err.response?.status === 409) {
          setError("Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.");
        } else {
          setError(errorMessage || "Erreur lors de l'inscription. Réessayez plus tard.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">📊</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              DeepEduGraph
            </h1>
            <p className="text-gray-600">
              {mode === "login" ? "Connectez-vous à votre compte" : "Créez un nouveau compte"}
            </p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-2 animate-slide-down ${
              error.startsWith("✅") 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
              <span className="text-xl flex-shrink-0">{error.startsWith("✅") ? "✅" : "❌"}</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@deepedugraph.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  minLength={6}
                  className="input-field pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {mode === "register" && (
                <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="STUDENT">Étudiant</option>
                  <option value="TEACHER">Enseignant</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {role === "ADMIN" && "Accès complet à toutes les fonctionnalités"}
                  {role === "TEACHER" && "Visualisation des graphes étudiants"}
                  {role === "STUDENT" && "Visualisation de votre propre graphe"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 h-12 text-base font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  {mode === "login" ? "Connexion en cours..." : "Inscription en cours..."}
                </>
              ) : (
                mode === "login" ? "Se connecter" : "S'inscrire"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setEmail("");
                setPassword("");
                setShowPassword(false);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              disabled={loading}
            >
              {mode === "login"
                ? "Créer un compte"
                : "Retour à la connexion"}
            </button>
          </div>

          {mode === "login" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 text-center">
                <strong>💡 Astuce :</strong> Créez un compte ADMIN pour accéder à toutes les fonctionnalités
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2024 DeepEduGraph - Analyse de risque étudiant</p>
        </div>
      </div>
    </div>
  );
}

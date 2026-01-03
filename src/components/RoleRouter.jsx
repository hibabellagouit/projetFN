import { useState, useEffect } from "react";
import api from "../api";
import StudentPanel from "./StudentPanel";
import TeacherPanel from "./TeacherPanel";
import AdminPanel from "./AdminPanel";

export default function RoleRouter() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
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
    if (decoded && decoded.role) {
      setRole(decoded.role);
    } else {
      api.get("/auth/me")
        .then((res) => {
          setRole(res.data.role);
        })
        .catch(() => {
          setRole("STUDENT");
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

  if (role === "ADMIN") {
    return <AdminPanel />;
  }

  if (role === "TEACHER") {
    return <TeacherPanel />;
  }

  return <StudentPanel />;
}

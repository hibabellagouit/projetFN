export default function RiskBadge({ risk }) {
  if (risk === null || risk === undefined) {
    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
        Non calculé
      </span>
    );
  }

  const percentage = Math.round(risk * 100);
  
  let bgColor, textColor, label;
  if (risk < 0.3) {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    label = "Faible";
  } else if (risk < 0.6) {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-800";
    label = "Modéré";
  } else {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    label = "Élevé";
  }

  return (
    <span className={`px-4 py-2 rounded-full text-base font-bold ${bgColor} ${textColor} inline-flex items-center gap-2`}>
      <span>{label}</span>
      <span className="text-lg">{percentage}%</span>
    </span>
  );
}

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface RadialScoreProps {
  score: number;
  size?: number;
  label?: string;
  color?: string;
}

const RadialScore: React.FC<RadialScoreProps> = ({ score, size = 100, label, color = "#3b82f6" }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }, // Assuming max score is 100 for overall, or 10 for sections (normalized later)
  ];

  // Normalize color based on score if generic
  const getColor = (val: number) => {
    if (val >= 80) return '#10b981'; // Emerald 500
    if (val >= 50) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const activeColor = color === "#3b82f6" ? getColor(score) : color;

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size / 2 - 8}
              outerRadius={size / 2}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="score" fill={activeColor} />
              <Cell key="remaining" fill="#e2e8f0" /> {/* Slate 200 for Light Mode */}
              <Label 
                value={score} 
                position="center" 
                fill="#0f172a" /* Slate 900 for text */
                style={{ fontSize: size * 0.3, fontWeight: 'bold' }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {label && <span className="mt-2 text-sm text-slate-500 font-medium">{label}</span>}
    </div>
  );
};

export default RadialScore;
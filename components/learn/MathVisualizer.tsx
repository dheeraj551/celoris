"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MathVisualizerProps {
    equation: string;
}

const MathVisualizer: React.FC<MathVisualizerProps> = ({ equation }) => {
    const data = useMemo(() => {
        const points = [];
        try {
            // Basic sanitization
            let fnStr = equation
                .replace(/(\d)x/g, '$1*x') // 2x -> 2*x
                .replace(/x\^(\d+)/g, 'Math.pow(x, $1)') // x^2 -> Math.pow(x, 2)
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log')
                .replace(/sqrt/g, 'Math.sqrt')
                .replace(/pi/g, 'Math.PI');

            const fn = new Function('x', `return ${fnStr}`);

            for (let x = -10; x <= 10; x += 0.5) {
                const y = fn(x);
                if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                    points.push({ x, y: parseFloat(y.toFixed(4)) });
                }
            }
        } catch (e) {
            console.warn('Failed to parse equation:', equation);
            return [];
        }
        return points;
    }, [equation]);

    if (data.length === 0) {
        return <div className="text-xs text-red-400 italic">Could not generate plot for: {equation}</div>;
    }

    return (
        <div className="h-64 w-full bg-neutral-900/50 p-4 rounded-xl border border-white/5 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        stroke="#ffffff40"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#ffffff40"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', borderRadius: '8px', border: '1px solid #ffffff10', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#6366f1' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 4, fill: '#6366f1' }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
            <p className="text-center text-[10px] text-white/30 mt-2 font-medium">Plot of {equation}</p>
        </div>
    );
};

export default MathVisualizer;

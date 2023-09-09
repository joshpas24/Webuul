import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data, title, lineColor }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke={lineColor} />
        </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;

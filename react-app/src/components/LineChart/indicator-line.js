import React from 'react';
import {
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const EconomicLineChart = ({ data, timeframe, lineColor, title }) => {
    const limitedData = data.slice(0, 24);
    // Ensure the 'date' values are in a format that allows correct sorting
    let newData = limitedData.map(item => ({ ...item, date: new Date(item.date) }));

    // Sort the data by 'date' in ascending order
    newData.sort((a, b) => a.date - b.date);

    // Example date formatting functions
    const formatDailyDate = (date) => date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const formatMonthlyDate = (date) => date.toLocaleDateString('en-US', { month: 'numeric', year: '2-digit' });
    const formatYearlyDate = (date) => date.toLocaleDateString('en-US', { year: 'numeric' });
    const formatQTRDate = (date) => {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        const year = date.getFullYear().toString().substr(2);
        return `${quarter}Q${year}`;
    };

    // Choose the appropriate date formatting function based on the timeframe prop
    const formatDate = (date) => {
        switch (timeframe) {
            case 'DAY':
                return formatDailyDate(date);
            case 'MNTH':
                return formatMonthlyDate(date);
            case 'YEAR':
                return formatYearlyDate(date);
            case 'QTR':
                return formatQTRDate(date);
            default:
                return ''; // Handle other cases as needed
        }
    };

  return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={newData}>
                <defs>
                    <linearGradient id={`${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="date"
                    tickFormatter={(tick) => formatDate(tick)}
                    interval="preserveStartEnd"
                    // tick={{ angle: -45, textAnchor: 'end', dy: 10 }}
                />
                <YAxis />
                <Tooltip labelFormatter={(label) => formatDate(label)} />
                <Area type="monotone" dataKey="value" stroke={lineColor} fill={`url(#${title})`} />
            </AreaChart>
        </ResponsiveContainer>
  );
};

export default EconomicLineChart;

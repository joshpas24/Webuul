import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EconomicBarChart = ({ data, timeframe, lineColor }) => {
    const limitedData = data.slice(0, 24);
    // Ensure the 'date' values are in a format that allows correct sorting
    let newData = limitedData.map(item => ({ ...item, date: new Date(item.date) }));

    // Sort the data by 'date' in ascending order
    newData.sort((a, b) => a.date - b.date);

    // Example date formatting functions
    const formatDailyDate = (date) => date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const formatMonthlyDate = (date) => date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
            case 'QTR':
                return formatQTRDate(date);
            case 'YEAR':
                return formatYearlyDate(date);
            default:
                return ''; // Handle other cases as needed
        }
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={newData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis
                    dataKey="date"
                    tickFormatter={(tick) => formatDate(new Date(tick))}
                    interval="preserveStartEnd"
                />
                <YAxis orientation='right'/>
                <Tooltip labelFormatter={(label) => formatDate(new Date(label))} />
                <Bar dataKey="value" fill={lineColor} barSize={20}/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default EconomicBarChart;

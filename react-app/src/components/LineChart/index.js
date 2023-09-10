import React from 'react';
import { AreaChart, Area, Defs, linearGradient, stop, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function calculateYAxisBounds(data) {
    if (data.length === 0) {
        return [0, 0]; // Return a default range if there's no data
    }

    // Find the minimum and maximum values in the data
    const minPrice = Math.min(...data.map((entry) => entry.price));
    const maxPrice = Math.max(...data.map((entry) => entry.price));

    // Calculate the buffer size (20% of the difference between max and min)
    const buffer = 0.2 * (maxPrice - minPrice);

    // Calculate the new bounds
    const minY = minPrice - buffer;
    const maxY = maxPrice + buffer;

    return [minY, maxY];
}

function formatXAxisLabel(value, index) {
    const date = new Date(value);
    const timeOfDay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return timeOfDay;
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const timeOfDay = new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
      return (
        <div className="custom-tooltip">
          <p className="label">{`${timeOfDay}`}</p>
          <p className="price">{`$${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
};

const IndexPriceChart = ({ dataObj, title, lineColor }) => {

    let data = []
    let firstDate = ''
    let lastDate = ''

    if (dataObj) {
        data = Object.keys(dataObj).map((date) => ({
            date,
            price: parseFloat(dataObj[date]['4. close']),
        }));
        firstDate = data[0].date
        lastDate = data[data.length - 1].date
    }

    return (
        <>
            <ResponsiveContainer width="90%" height={250}>
                <AreaChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }} height={250}>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={lineColor} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickFormatter={formatXAxisLabel}
                        ticks={[firstDate, lastDate]}
                        interval="preserveStartEnd"
                        margin={0}
                    />
                    <YAxis
                        domain={calculateYAxisBounds(data)}
                        axisLine={false}
                        tick={false}
                        margin={0}
                    />
                    <Tooltip content={<CustomTooltip />}/>
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={lineColor}
                        fill={lineColor}
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default IndexPriceChart;

{/* <Line type="monotone" dataKey="price" stroke={lineColor} dot={false}/> */}

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

function formatXAxisLabel(value, index, props) {
    const { timeframe } = props; // Assuming you have timeframe as a prop

    const date = new Date(value);
    const timeOfDay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (timeframe === '1D') {
      return timeOfDay;
    } else {
      const formattedDate = date.toLocaleDateString();
      return `${formattedDate}`;
    }
}

const formatYAxisTick = (value) => {
    // Use Intl.NumberFormat for formatting numbers with commas, decimals, etc.
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD', // Change this to your desired currency or remove if not needed
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  };

  const calculateYAxisTicks = (data, numTicks = 5) => {
    const minValue = Math.min(...data.map((entry) => entry.price));
    const maxValue = Math.max(...data.map((entry) => entry.price));

    // Use a simple linear scale to calculate tick values
    const tickStep = (maxValue - minValue) / (numTicks - 1);
    const yAxisTicks = Array.from({ length: numTicks }, (_, index) => minValue + index * tickStep);

    return yAxisTicks;
  };

const CustomTooltip = ({ active, payload, label }, props) => {
    const { timeframe } = props; // Assuming you have timeframe as a prop

    if (active && payload && payload.length) {
      const date = new Date(label);
      const timeOfDay = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (timeframe === '1D') {
        // If the timeframe is one day, only display time
        return (
          <div className="custom-tooltip">
            <p className="label">{`${timeOfDay}`}</p>
            <p className="price">{`$${payload[0].value}`}</p>
          </div>
        );
      } else {
        // For larger timeframes, display both date and time
        const formattedDate = date.toLocaleDateString();
        return (
          <div className="custom-tooltip">
            <p className="label">{`${formattedDate}`}</p>
            <p className="price">{`$${payload[0].value}`}</p>
          </div>
        );
      }
    }

    return null;
};

const StockPriceChart = ({ dataObj, timeframe, lineColor }) => {
    // console.log('TIMEFRAME: ', timeframe)
    let data = []
    let firstDate = ''
    let lastDate = ''

    if (dataObj) {
        const dataArr = Object.keys(dataObj).map((date) => ({
            date,
            price: parseFloat(dataObj[date]['4. close']),
        }));
        // firstDate = data[0].date
        // lastDate = data[data.length - 1].date

        if (timeframe === '1D') {
            data = dataArr
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
        if (timeframe === '1W') {
            data = dataArr
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
        if (timeframe === '1M') {
            data = dataArr.slice(data.length - 25)
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
        if (timeframe === '3M') {
            data = dataArr.slice(data.length - 76)
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
        if (timeframe === '1Y') {
            data = dataArr.slice(data.length - 53)
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
        if (timeframe === '5Y') {
            data = dataArr.slice(data.length - 62)
            firstDate = data[0].date
            lastDate = data[data.length - 1].date
        }
    }

    return (
        <>
            <ResponsiveContainer width="90%" height={400}>
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
                        tickFormatter={(value, index) => formatXAxisLabel(value, index, { timeframe })}
                        ticks={[firstDate, lastDate]}
                        interval="preserveStartEnd"
                        margin={0}
                    />
                    <YAxis
                        domain={calculateYAxisBounds(data)}
                        axisLine={false}
                        tickFormatter={formatYAxisTick}
                        ticks={calculateYAxisTicks(data)}
                        interval="preserveStartEnd"
                        margin={0}
                        orientation='right'
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} timeframe={timeframe} />}/>
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={lineColor}
                        fill="url(#gradient)"
                        dot={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
};

export default StockPriceChart;

{/* <Line type="monotone" dataKey="price" stroke={lineColor} dot={false}/> */}

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetIndexPrices } from '../../store/markets';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line } from 'recharts';
import './test.css'

const TestChart = () => {
    const dispatch = useDispatch();
    const dowJones = useSelector((state) => state.markets.indices['DIA']);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
        try {
            await dispatch(thunkGetIndexPrices('DIA', 'INTRADAY'));
            setIsLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        }

        fetchData();
    }, [dispatch]);

    let data = [];
    if (dowJones) {
        data = Object.keys(dowJones).map((date) => ({
        date,
        price: parseFloat(dowJones[date]['4. close']),
        }));
    }

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

    function formatYAxisLabel(value) {
        return `$${value.toFixed(2)}`; // Format as currency, adjust as needed
    }

    function formatXAxisLabel(value) {
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
              <p className="price">{`${payload[0].value}`}</p>
            </div>
          );
        }

        return null;
    };

    return (
        <div className='test-div'>
        {isLoaded && dowJones ? (
            <ResponsiveContainer width="80%" height={300}>
            <LineChart data={data}>
                <XAxis dataKey="date" tickFormatter={formatXAxisLabel} interval={Math.floor(data.slice(1).length / 4)} />
                <YAxis domain={calculateYAxisBounds(data)} tickFormatter={formatYAxisLabel}/>
                <Tooltip content={<CustomTooltip />}/>
                <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
            </ResponsiveContainer>
        ) : (
            <div>Loading...</div>
        )}
        </div>
    );
};

export default TestChart;

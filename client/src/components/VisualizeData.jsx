import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./VisualizeData.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VisualizeData = () => {
  const [matchField, setMatchField] = useState("");
  const [matchValue, setMatchValue] = useState("");
  const [groupField, setGroupField] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const handleVisualize = async () => {
    try {
      // Build query parameters using JSON arrays for dynamic aggregation criteria
      const params = {};
      if (matchField && matchValue) {
        params.matchCriteria = JSON.stringify([{ field: matchField, value: matchValue }]);
      }
      if (groupField) {
        params.groupFields = JSON.stringify([groupField]);
      }
      if (sortField) {
        params.sortCriteria = JSON.stringify([{ field: sortField, order: sortOrder }]);
      }

      // Send GET request to your aggregated data endpoint
      const response = await axios.get("/reservation/aggregated-data", { params });
      const data = response.data.data;

      // Process aggregated data for charting
      const labels = data.map((item) =>
        typeof item._id === "object" ? JSON.stringify(item._id) : item._id
      );
      const counts = data.map((item) => item.count);

      const newChartData = {
        labels,
        datasets: [
          {
            label: "Count",
            data: counts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(newChartData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error fetching aggregated data");
      setChartData(null);
    }
  };

  return (
    <div className="visualize-container">
      <h2 className="visualize-header">Visualize Reservation Data</h2>
      <div className="visualize-form">
        <div className="form-group">
          <label htmlFor="matchField">Match Field:</label>
          <input
            type="text"
            id="matchField"
            value={matchField}
            onChange={(e) => setMatchField(e.target.value)}
            placeholder="e.g., status"
          />
        </div>
        <div className="form-group">
          <label htmlFor="matchValue">Match Value:</label>
          <input
            type="text"
            id="matchValue"
            value={matchValue}
            onChange={(e) => setMatchValue(e.target.value)}
            placeholder="e.g., REJECTED"
          />
        </div>
        <div className="form-group">
          <label htmlFor="groupField">Group Field:</label>
          <input
            type="text"
            id="groupField"
            value={groupField}
            onChange={(e) => setGroupField(e.target.value)}
            placeholder="e.g., category"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sortField">Sort Field:</label>
          <input
            type="text"
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            placeholder="e.g., count"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sortOrder">Sort Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button className="visualize-btn" onClick={handleVisualize}>
          Visualize Data
        </button>
      </div>
      <div className="chart-container">
        {error && <p className="error-message">{error}</p>}
        {chartData ? (
          <Bar data={chartData} options={{ maintainAspectRatio: true }} />
        ) : (
          <p>No data to display. Please enter criteria and click "Visualize Data".</p>
        )}
      </div>
    </div>
  );
};

export default VisualizeData;

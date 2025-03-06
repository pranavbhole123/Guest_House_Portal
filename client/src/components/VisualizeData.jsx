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
  // Use comma separated inputs for multiple criteria
  const [matchFields, setMatchFields] = useState("");
  const [matchValues, setMatchValues] = useState("");
  const [groupFields, setGroupFields] = useState("");
  const [sortFields, setSortFields] = useState("");
  const [sortOrders, setSortOrders] = useState("");
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const handleVisualize = async () => {
    try {
      const params = {};

      // Build matchCriteria array from comma separated inputs
      if (matchFields && matchValues) {
        const fieldsArray = matchFields
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
        const valuesArray = matchValues
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v);

        if (fieldsArray.length !== valuesArray.length) {
          setError("Number of match fields and match values must be equal");
          setChartData(null);
          return;
        }

        const matchCriteria = fieldsArray.map((field, index) => ({
          field,
          value: valuesArray[index],
        }));
        params.matchCriteria = JSON.stringify(matchCriteria);
      }

      // Build groupFields array from comma separated input
      if (groupFields) {
        const groupFieldsArray = groupFields
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
        params.groupFields = JSON.stringify(groupFieldsArray);
      }

      // Build sortCriteria array from comma separated inputs
      if (sortFields && sortOrders) {
        const sortFieldsArray = sortFields
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
        const sortOrdersArray = sortOrders
          .split(",")
          .map((o) => o.trim())
          .filter((o) => o);

        if (sortFieldsArray.length !== sortOrdersArray.length) {
          setError("Number of sort fields and sort orders must be equal");
          setChartData(null);
          return;
        }

        const sortCriteria = sortFieldsArray.map((field, index) => ({
          field,
          order: sortOrdersArray[index],
        }));
        params.sortCriteria = JSON.stringify(sortCriteria);
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
          <label htmlFor="matchFields">Match Fields (comma separated):</label>
          <input
            type="text"
            id="matchFields"
            value={matchFields}
            onChange={(e) => setMatchFields(e.target.value)}
            placeholder="e.g., status, type"
          />
        </div>
        <div className="form-group">
          <label htmlFor="matchValues">Match Values (comma separated):</label>
          <input
            type="text"
            id="matchValues"
            value={matchValues}
            onChange={(e) => setMatchValues(e.target.value)}
            placeholder="e.g., REJECTED, APPROVED"
          />
        </div>
        <div className="form-group">
          <label htmlFor="groupFields">Group Fields (comma separated):</label>
          <input
            type="text"
            id="groupFields"
            value={groupFields}
            onChange={(e) => setGroupFields(e.target.value)}
            placeholder="e.g., category, subCategory"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sortFields">Sort Fields (comma separated):</label>
          <input
            type="text"
            id="sortFields"
            value={sortFields}
            onChange={(e) => setSortFields(e.target.value)}
            placeholder="e.g., count, date"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sortOrders">
            Sort Orders (comma separated, e.g., asc, desc):
          </label>
          <input
            type="text"
            id="sortOrders"
            value={sortOrders}
            onChange={(e) => setSortOrders(e.target.value)}
            placeholder="e.g., asc, desc"
          />
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

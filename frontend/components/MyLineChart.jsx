import React, { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Container, Typography } from "@mui/material";

function MyLineChart({ xvalues, yvalues }) {
  const [seriesData, setSData] = useState([]);
  const [xAxisData, setXData] = useState([]);

  useEffect(() => {
    // Ensure the data is updated when props change
    setSData(yvalues || []);
    setXData(xvalues || []);
  }, [xvalues, yvalues]); // Re-run when xvalues or yvalues change

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Sample Line Chart
      </Typography>
      <LineChart
        series={[
          {
            id: "line-series",
            data: seriesData, // Pass the y-values here
            label: "Data Line", // Optional label
            color: "blue",
          },
        ]}
        xAxis={[
          {
            scaleType: "point",
            data: xAxisData, // Pass the x-values here
          },
        ]}
        width={500}
        height={300}
      />
    </Container>
  );
}

export default MyLineChart;

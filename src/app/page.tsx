"use client";
import Graph from "@/components/Graph";
import { useEffect, useState } from "react";
interface DataEntry {
  id: number;
  timestamp: string;
  voltage: number;
  humidity: number;
  temperature: number;
  inverter_status: number;
}

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getData");
      const result: DataEntry[] = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  const parseData = (key: keyof DataEntry): number[] =>
    data.map((item) => item[key] as number);

  const parseTimestamps = (): string[] => data.map((item) => item.timestamp);
  return (
    <div>
      <h1>Monitoring Dashboard</h1>
      {data.length > 0 && (
        <>
          <Graph
            title="Voltage Over Time"
            labels={parseTimestamps()}
            data={parseData("voltage")}
            yAxisLabel="Voltage (V)"
          />
          <Graph
            title="Humidity Over Time"
            labels={parseTimestamps()}
            data={parseData("humidity")}
            yAxisLabel="Humidity (%)"
          />
          <Graph
            title="Temperature Over Time"
            labels={parseTimestamps()}
            data={parseData("temperature")}
            yAxisLabel="Temperature (°C)"
          />
          <Graph
            title="Inverter Status Over Time"
            labels={parseTimestamps()}
            data={parseData("inverter_status")}
            yAxisLabel="Status (On/Off)"
          />
        </>
      )}
    </div>
  );
}

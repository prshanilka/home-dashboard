"use client";
import Graph from "@/components/Graph";
import { useEffect, useState } from "react";

interface DataEntry {
  id: number;
  createdAt: string;
  voltage: number;
  humidity: number;
  temperature: number;
  inverter_status: boolean;
}

export default function Home() {
  const [data, setData] = useState<DataEntry[]>([]);
  const [filters, setFilters] = useState({
    limit: 100,
    range: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams();

      if (filters.limit) queryParams.append("limit", filters.limit.toString());
      if (filters.range) queryParams.append("range", filters.range);
      if (filters.start_date)
        queryParams.append("start_date", localToUTC(filters.start_date));
      if (filters.end_date)
        queryParams.append("end_date", localToUTC(filters.end_date));

      const response = await fetch(
        `https://fetch-esp-32-data.ramesh-shanilka.workers.dev?${queryParams.toString()}`
      );
      const result: DataEntry[] = await response.json();

      // Convert all UTC times to local time
      const transformedResult = result.map((entry) => ({
        ...entry,
        createdAt: utcToLocal(entry.createdAt),
      }));

      setData(transformedResult);
    };

    fetchData();
  }, [filters]);

  // const utcToLocal = (utcTime: string): string => {
  //   const date = new Date(utcTime);
  //   console.log({ utcTime, date: date.toLocaleString() });

  //   return date.toLocaleString(); // Converts to local time string
  // };
  const utcToLocal = (utcTime: string) => {
    const date = new Date(utcTime);

    // Calculate the offset for +5:30 in minutes
    const offsetMinutes = 5 * 60 + 30;

    // Apply the offset to get the local time
    const localDate = new Date(date.getTime() + offsetMinutes * 60 * 1000);

    // Return the formatted string
    return localDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata", // Ensure +5:30 timezone
      hour12: false, // Optional: Use 24-hour format
    });
  };

  const localToUTC = (localTime: string): string => {
    const date = new Date(localTime);
    return date.toISOString(); // Converts to UTC ISO string
  };

  const parseData = (key: keyof DataEntry): number[] =>
    data.map((item) =>
      key === "inverter_status" ? +item[key] : (item[key] as number)
    );

  const parseTimestamps = (): string[] => data.map((item) => item.createdAt);

  return (
    <div>
      <h1>Monitoring Dashboard</h1>
      <div>
        <label>
          Limit:
          <input
            type="number"
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: +e.target.value })}
          />
        </label>
        <label>
          Range:
          <select
            value={filters.range}
            onChange={(e) => setFilters({ ...filters, range: e.target.value })}
          >
            <option value="">Select Range</option>
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="datetime-local"
            onChange={(e) =>
              setFilters({ ...filters, start_date: e.target.value })
            }
          />
        </label>
        <label>
          End Date:
          <input
            type="datetime-local"
            onChange={(e) =>
              setFilters({ ...filters, end_date: e.target.value })
            }
          />
        </label>
      </div>
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

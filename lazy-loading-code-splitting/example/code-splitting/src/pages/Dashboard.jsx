import { useState, } from "react";
import HeavyChart from "../components/HeavyChart";

export default function Dashboard() {
  const [show, setShow] = useState(false);

  return (
    <>
      <h1>Dashboard</h1>

      <button onClick={() => setShow(true)}>
        Load Chart
      </button>
        <button onClick={() => setShow(false)}>
        Hide Chart
      </button>
      {show && (
          <HeavyChart />

      )}
    </>
  );
}
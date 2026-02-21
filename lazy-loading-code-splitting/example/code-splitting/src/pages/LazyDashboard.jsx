import { useState, lazy, Suspense } from "react";

// Component splitting
const HeavyChart = lazy(() => import("../components/HeavyChart"));

export default function Dashboard() {
  const [show, setShow] = useState(false);

  return (
    <>
      <h1>Dashboard</h1>

      <button onClick={() => setShow(true)}>
        Load Chart
      </button>

      {show && (
        <Suspense fallback={<h3>Loading Chart...</h3>}>
          <HeavyChart />
        </Suspense>
      )}
    </>
  );
}
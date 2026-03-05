// Without Code Splitting
// import { Routes, Route, Link } from "react-router-dom";

// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";

// export default function App() {
//   return (
//     <>
      
//       <nav>
//         <Link to="/">Home</Link> |
//         <Link to="/dashboard">Dashboard</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </>
//   );
// }

// With Code Splitting
import { Routes, Route, Link } from "react-router-dom";
import { Suspense, lazy } from "react";

// Code Splitting here
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/LazyDashboard"));

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Suspense fallback={<h2>Loading Page...</h2>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </>
  );
}
import React, { useState, Suspense } from "react"
//import HeavyComponent from "./HeavyComponent"

const HeavyComponent = React.lazy(() => import("./HeavyComponent"))

function DynamicImport() {
  const [show, setShow] = useState(false)
  return (
    <>
    <div>
      <h1>Dynamic Import Demo</h1>

      <button onClick={() => setShow(true)}>
        Load Heavy Component
      </button>

      {show && (
        //<HeavyComponent/>
        <Suspense fallback={<p>Loading...</p>}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
    </>
  )
}

export default DynamicImport
import { add } from "../utils" //Named import size
console.log(add(10,5))

// import * as utils from "../utils"; //namesapce import size
// const randomKey = Object.keys(utils)[0];
// console.log(utils[randomKey](10, 5));

function TreeShaking() {
  return (
    <>
      <div>
        <h1>Tree Shaking Demo</h1>
      </div>

      {/* Bundle → add function only  
Bundle size → Smaller

With namsapce import
Bundle → All exports from utils
Bundle size → Larger */}
    </>
  );
}

export default TreeShaking;

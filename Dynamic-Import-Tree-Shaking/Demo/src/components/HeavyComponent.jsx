import _ from "lodash"

export default function HeavyComponent() {
  console.log("Heavy Component Loaded")
  return <h2>{_.capitalize("dynamic import demo")}</h2>

}
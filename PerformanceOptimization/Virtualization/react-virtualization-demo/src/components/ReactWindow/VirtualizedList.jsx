import { FixedSizeList as List } from "react-window";
import { data } from "./data";

const Row = ({ index, style }) => {
  const item = data[index];
  console.log("Rendering row:", index);

  return (
    <div style={style}>
      <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
        {item.name}
      </div>
    </div>
  );
};

export default function VirtualizedList() {
  return (
    <List
      height={500}
      width={300}
      itemSize={50}
      itemCount={data.length}
    >
      {Row}
    </List>
  );
}
import { data } from "./data";

const NormalList = () => {
  return (
    <div style={{ height: "500px", overflowY: "scroll" }}>
      {data.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          {item.name}
        </div>
      ))}


      
    </div>
  );
};

export default NormalList;
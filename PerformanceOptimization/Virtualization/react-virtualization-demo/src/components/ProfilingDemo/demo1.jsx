import React, { useState } from "react";

//Normal Child component
// const Child = ({ name }) => {
//   console.log("Child rendered");
//   return <div>{name}</div>;
// };

const Child = React.memo(({ name }) => {
  console.log("Child rendered");
  return <div>{name}</div>;
});

const Demo1 = () => {
   const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increase</button>
      <Child name="Kinjal" />
    </>
  );
};

export default Demo1;
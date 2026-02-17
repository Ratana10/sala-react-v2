import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const CountNumber = () => {
  const [count, setCount] = useState(0);

  const [fullName, setFullName] = useState("Guest");
  useEffect(() => {
    if (count === 5) {
      setFullName("Name 05");
      console.log("It's work");
    }
  }, [count]);

  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>+</Button>
      {count}
      <Button className="bg-red-500" onClick={() => setCount(count - 1)}>
        -
      </Button>
      {fullName}
    </div>
  );
};

export default CountNumber;

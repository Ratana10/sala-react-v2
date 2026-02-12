import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import ProductCard from "./components/ProductCard";
import { Button } from "./components/ui/button";
import UserCard from "./components/UserCard";

function App() {
  const user = {
    firstName: "Ratana",
    lastName: "San",
    gender: "Male",
  };

  const fullName = "San Ratana";

  const products = [
    {
      id: 1,
      productName: "T-shirt",
      productPrice: 100,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
    {
      id: 1,
      productName: "T-shirt 2",
      productPrice: 100,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
    {
      id: 3,
      productName: "T-shirt 3",
      productPrice: 100,
      qty: 10,
      imageUrl:
        "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
    },
  ];

  const [count, setCount] = useState(0);

  const [userName, setUsername] = useState("A");

  const handleDecrease = () => {
    if (count <= 0) {
      return;
    }
    setCount(count - 1);
  };

  function handleIncrease() {
    setCount(count + 1);
    console.log("Count ", count);
  }

  return (
    <>
      {/* <Login />
      <UserCard userName={"123123"} gender={"Male"} />
      <div className="flex gap-4">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            productName={item.productName}
            productPrice={item.productPrice}
            qty={item.qty}
            imageUrl={item.imageUrl}
          />
        ))}
      </div> */}
      <div className="flex gap-6">
        <Button size={"sm"} onClick={() => handleDecrease()}>
          -
        </Button>
        <p className="text-3xl">{count}</p>
        <Button size={"sm"} onClick={() => handleIncrease()}>
          +
        </Button>
      </div>

      <p className="mt-4 text-3xl">{ count >= 5 ? 'B' : 'A'}</p>
    </>
  );
}

export default App;

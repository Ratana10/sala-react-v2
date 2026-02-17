import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const Product = () => {
  return (
    <div>
      <Link to={"/"}>
        <Button>Back to Home</Button>
      </Link>

      This is the Product page
    </div>
  );
};

export default Product;

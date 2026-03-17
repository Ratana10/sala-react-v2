import React from "react";
import data from "./data.json";
import { DataTable } from "@/components/data-table-v2";

const Test = () => {
  return (
    <div>
      {" "}
      <DataTable data={data} />
    </div>
  );
};

export default Test;

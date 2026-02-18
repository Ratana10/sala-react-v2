import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import React from "react";

const User = () => {
  const users = [
    { id: 1, firstName: "Tola", lastName: "Jonh" },
    { id: 2, firstName: "Tola", lastName: "Jonh" },
  ];
  return (
    <div>
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default User;

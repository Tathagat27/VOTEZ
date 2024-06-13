
import React from "react";

const AdminOnly = (props) => {
  return (
    <div className="container-item attention border-t-4 border-tomato">
      <div className="text-center">
        <div className="my-4">
          <h1>{props.page}</h1>
        </div>
        <p>Admin access only.</p>
      </div>
    </div>
  );
};

export default AdminOnly;

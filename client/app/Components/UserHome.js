import React from "react";

function UserHome(props) {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold">{props.el.electionTitle}</h1>
        <br />
        <center className="text-lg">{props.el.organizationTitle}</center>
        <table className="mt-6 w-full">
          <tbody>
            <tr>
              <th className="text-left px-4 py-2">Admin</th>
              <td className="px-4 py-2">
                {props.el.adminName} ({props.el.adminTitle})
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2">Contact</th>
              <td className="px-4 py-2 text-gray-700">{props.el.adminEmail}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserHome;

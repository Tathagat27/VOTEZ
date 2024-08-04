import { useRouter } from "next/navigation";
import React from "react";

function UserHome(props) {

  const router = useRouter();

  return (
    <div className="snap-start snap-always container mx-auto p-4 h-[100vh] flex justify-center items-center">
      <div onClick={() => router.push("/voting")} className="bg-white ring-2 ring-red-200 shadow-xl rounded-xl z-0 px-8 py-12 mb-4 w-[45vw] flex flex-col items-center select-none cursor-pointer transition-transform duration-700 ease-in-out hover:scale-105">
        <h1 className="text-4xl font-bold font-sans bg-gradient-to-tr from-red-600 via-yellow-600 to-orange-900 text-transparent bg-clip-text ">{props.el.electionTitle?.toUpperCase()}</h1>
        <center className="text-lg font-mono mt-2 text-red-800">~ BY &ldquo;{props.el.organizationTitle?.toUpperCase()}&rdquo;</center>
        <table className="mt-6 w-full">
          <tbody>
            <tr>
              <th className="text-left px-4 py-2 font-sans text-red-900">Admin</th>
              <td className="px-4 py-2">
                <span className="font-serif text-red-800 capitalize font-semibold">{props.el.adminName}</span> <span className="font-mono text-pink-800 uppercase">({props.el.adminTitle})</span>
              </td>
            </tr>
            <tr>
              <th className="text-left px-4 py-2 font-sans text-red-900">Contact</th>
              <td className="px-4 py-2 font-mono text-red-700 ">{props.el.adminEmail}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserHome;

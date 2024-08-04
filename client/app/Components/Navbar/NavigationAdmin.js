"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarAdmin() {

  const [currentTab, setCurrentTab] = useState(null);
  const pathname = usePathname();
  console.log(pathname);
  
  useEffect(() => {
    setCurrentTab(pathname);
    console.log(currentTab);
    
  }, [pathname]);
  
  return (
    <nav className="w-fit flex items-center justify-between z-20 bg-white text-black rounded-full h-12  drop-shadow-2xl">
      <ul
        className={`flex items-center justify-between gap-2 text-sm fixed inset-y-0 right-0 w-1/2 rounded-full h-11 mx-6 px-2 text-black md:static md:flex md:space-x-6 md:w-auto md:transform-none`}
      >
        <li className="my-2 md:my-0">
          <Link href="/admin/verification" className={` py-2 pl-2 ${(currentTab === "/admin/verification") ? "text-black" : "text-gray-500"} hover:text-gray-700 font-semibold`}>
            Verification
          </Link>
        </li>
        <li className="my-2 md:my-0">
          <Link href="/admin/addCandidate" className={` py-2 pl-2 ${(currentTab === "/admin/addCandidate") ? "text-black" : "text-gray-500"} hover:text-gray-700 font-semibold`}>
            Add Candidate
          </Link>
        </li>
        <li className="my-2 md:my-0">
          <Link href="/registration" className={` py-2 pl-2 ${(currentTab === "/registration") ? "text-black" : "text-gray-500"} hover:text-gray-700 font-semibold`}>
           
              Registration

          </Link>
        </li>
        <li className="my-2 md:my-0">
          <Link href="/voting" className={` py-2 pl-2 ${(currentTab === "/voting") ? "text-black" : "text-gray-500"} hover:text-gray-700 font-semibold`}>

             Voting

          </Link>
        </li>
        <li className="my-2 md:my-0">
          <Link href="/results" className={` py-2 pl-2 ${(currentTab === "/results") ? "text-black" : "text-gray-500"} hover:text-gray-700 font-semibold`}>

             Results

          </Link>
        </li>
      </ul>
     
    </nav>
  );
}

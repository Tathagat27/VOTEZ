"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navigation";
import NavbarAdmin from "../../Components/Navbar/NavigationAdmin";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import AdminOnly from "../../Components/AdminOnly";
import Link from "next/link";

const AddCandidate = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [header, setHeader] = useState("");
  const [slogan, setSlogan] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCandidateCount] = useState(undefined);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      setWeb3(web3);
      setElectionInstance(instance);
      setAccount(accounts[0]);

      const candidateCount = await instance.methods.getTotalCandidate().call();
      setCandidateCount(candidateCount);

      const admin = await instance.methods.getAdmin().call();
      if (accounts[0] === admin) {
        setIsAdmin(true);
      }

      const candidates = [];
      for (let i = 0; i < candidateCount; i++) {
        const candidate = await instance.methods.candidateDetails(i).call();
        candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
        });
      }
      setCandidates(candidates);
    } catch (error) {
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };

  const updateHeader = (event) => setHeader(event.target.value);
  const updateSlogan = (event) => setSlogan(event.target.value);

  const addCandidate = async (event) => {
    event.preventDefault();
    await ElectionInstance.methods
      .addCandidate(header, slogan)
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  if (!web3) {
    return (
      <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit">
          <Navbar />
        </div>
        <Link
          href="/"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <div className="h-[80vh] flex justify-center items-center">
          <p className="font-mono text-3xl font-extrabold">
            Loading Web3, accounts, and contract...
          </p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
          <Navbar />
        </div>
        <Link
          href="/"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <AdminOnly page="Add Candidate Page." />
      </main>
    );
  }

  return (
    <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        <NavbarAdmin />
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className="px-14">
        <div className=" h-[80vh] flex flex-col items-center justify-start py-14 space-y-6  mb-24">
          <p className="text-center text-3xl font-sans font-bold ">
            Add a new candidate
          </p>
          <p className="text-center text-xl font-mono font-bold ">
            Total candidates: {candidateCount}
          </p>
          <div className="container-item ">
            <form className="form flex flex-col" onSubmit={addCandidate}>
              <label className="text-center text-lg font-sans font-semibold mb-8 w-[40vw] flex justify-end gap-6 items-center">
                Candidate&apos;s Name
                <input
                  className="p-4 font-normal"
                  type="text"
                  placeholder="eg. Marcus"
                  value={header}
                  onChange={updateHeader}
                />
              </label>
              <label className="text-center text-lg font-sans font-semibold mb-8 w-[40vw] flex justify-end gap-6 items-center">
                Slogan
                <input
                  className="p-4 font-normal"
                  type="text"
                  placeholder="eg. It is what it is"
                  value={slogan}
                  onChange={updateSlogan}
                />
              </label>
              <button
                className={`text-white ${
                  header.length < 3 || header.length > 21
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                } font-medium rounded-lg px-5 text-sm w-72 text-center mx-auto py-4 mb-2`}
                disabled={header.length < 3 || header.length > 21}
              >
                Add
              </button>
            </form>
          </div>
        </div>
        {loadAdded(candidates)}
      </div>
    </main>
  );
};

function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
      <div key={candidate.id} className="container-list success">
        <div>
          {+candidate.id + 1}. <strong>{candidate.header}</strong>:{" "}
          {candidate.slogan}
        </div>
      </div>
    );
  };
  return (
    <div className="container-main h-fit p-8">
      <div className="container-item info">
        <center className="text-center text-3xl font-sans font-bold ">
          Candidates List
        </center>
      </div>
      {candidates.length < 1 ? (
        <div className="container-item alert">
          <center className="text-center text-base font-sans font-bold mt-4">
            No candidates added
          </center>
        </div>
      ) : (
        <div
          className="container-item"
          style={{
            display: "block",
            backgroundColor: "#DDFFFF",
          }}
        >
          {candidates.map(renderAdded)}
        </div>
      )}
    </div>
  );
}

export default AddCandidate;

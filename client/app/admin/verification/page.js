"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../Components/Navbar/Navigation";
import NavbarAdmin from "../../Components/Navbar/NavigationAdmin";
import AdminOnly from "../../Components/AdminOnly";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import Link from "next/link";

const Verification = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterCount, setVoterCount] = useState(undefined);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
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

        const candidateCount = await instance.methods
          .getTotalCandidate()
          .call();
        const admin = await instance.methods.getAdmin().call();
        if (accounts[0] === admin) {
          setIsAdmin(true);
        }

        const voterCount = await instance.methods.getTotalVoter().call();
        setVoterCount(voterCount);

        const votersArray = [];
        for (let i = 0; i < voterCount; i++) {
          const voterAddress = await instance.methods.voters(i).call();
          const voter = await instance.methods
            .voterDetails(voterAddress)
            .call();
          votersArray.push({
            address: voter.voterAddress,
            name: voter.name,
            phone: voter.phone,
            hasVoted: voter.hasVoted,
            isVerified: voter.isVerified,
            isRegistered: voter.isRegistered,
          });
        }
        setVoters(votersArray);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    } else {
      loadBlockchainData();
    }
  }, []);

  const verifyVoter = async (verifiedStatus, address) => {
    await ElectionInstance.methods.verifyVoter(verifiedStatus, address).send({
      from: account,
      gas: 1000000,
    });
    window.location.reload();
  };

  const renderUnverifiedVoters = useCallback(
    (voter) => {
      return (
        <div className="">
          {voter.isVerified ? (
            <div className="border-2 border-black rounded-lg flex flex-col items-start shadow-xl w-[50vw] h-fit bg-cyan-50">
              <p className="my-4 self-center font-xl font-semibold">
                AC: {voter.address}
              </p>
              <table className="w-full h-full text-center">
                <thead>
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Voted</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">{voter.name}</td>
                    <td className="py-2">{voter.phone}</td>
                    <td className="py-2">
                      {voter.hasVoted ? "True" : "False"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-black rounded-lg flex flex-col shadow-xl w-[50vw] h-fit bg-cyan-50">
              <table className="w-full h-full ">
                <tbody>
                  <tr>
                    <th className="py-2">Account address</th>
                    <td className="py-2">{voter.address}</td>
                  </tr>
                  <tr>
                    <th className="py-2">Name</th>
                    <td className="py-2">{voter.name}</td>
                  </tr>
                  <tr>
                    <th className="py-2">Phone</th>
                    <td className="py-2">{voter.phone}</td>
                  </tr>
                  <tr>
                    <th className="py-2">Voted</th>
                    <td className="py-2">
                      {voter.hasVoted ? "True" : "False"}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2">Verified</th>
                    <td className="py-2">
                      {voter.isVerified ? "True" : "False"}
                    </td>
                  </tr>
                  <tr>
                    <th className="py-2">Registered</th>
                    <td className="py-2">
                      {voter.isRegistered ? "True" : "False"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className={`w-[45vw] rounded-lg py-2.5 my-4 self-center text-sm font-semibold ${
                  voter.isVerified
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 cursor-pointer"
                } `}
                disabled={voter.isVerified}
                onClick={() => verifyVoter(true, voter.address)}
              >
                Approve
              </button>
            </div>
          )}
        </div>
      );
    },
    [verifyVoter]
  );

  if (!web3) {
    return (
      <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
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
      <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
        <div className="self-center absolute w-fit ">
          <Navbar />
        </div>
        <Link
          href="/"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <AdminOnly page="Verification Page." />
      </main>
    );
  }

  return (
    <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8 ">
      <div className="self-center absolute w-fit ">
        <NavbarAdmin />
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className=" h-fit flex flex-col items-center justify-start space-y-6 py-14">
        <h3 className="text-center text-3xl font-sans font-bold ">
          Verification
        </h3>
        <p className="block text-center text-[5vw] font-mono font-extrabold ">
          Total Voters: {voters.length}
        </p>
        {voters.length < 1 ? (
          <div className="text-center text-xl text-orange-400 font-bold">
            None Has Registered Yet
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start pt-8 w-[60vw] h-fit">
            <div className="text-center text-2xl font-sans font-bold mb-8">
              List of registered voters
            </div>
            {voters.map((voter, index) => (
              <div key={index}>{renderUnverifiedVoters(voter)}</div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Verification;

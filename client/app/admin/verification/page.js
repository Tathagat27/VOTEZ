"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../Components/Navbar/Navigation";
import NavbarAdmin from "../../Components/Navbar/NavigationAdmin";
import AdminOnly from "../../Components/AdminOnly";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/Election.json";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Verification = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterCount, setVoterCount] = useState(undefined);
  const [voters, setVoters] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
        setIsLoaded(true);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    if (!isLoaded) {
      loadBlockchainData();
    }
  }, [isLoaded]);

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
        <div className="my-4">
          {voter.isVerified ? (
            <div className="border-2 border-red-200 rounded-xl flex flex-col items-startshadow-xl w-[50vw] h-fit bg-cyan-50 text-md font-sans">
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
            <div className="border-2 border-red-200 rounded-xl flex flex-col shadow-xl w-[50vw] h-fit bg-cyan-50 text-md font-sans">
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
          href="/home"
          className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
        >
          VOTEZ
        </Link>
        <div className="h-[80vh] flex flex-col justify-center items-center text-zinc-700">
          <p className="font-mono text-3xl font-extrabold mb-8">
            Loading Web3, Accounts, and Contract
          </p>
          <AiOutlineLoading3Quarters className="text-4xl animate-spin font-extrabold" />

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
          href="/home"
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
        href="/home"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className=" h-fit flex flex-col items-center justify-start py-14">
        <p className="text-center text-3xl font-sans font-bold tracking-wide text-zinc-700">
          Total Voters : <span className="text-green-500 text-4xl font-mono">{voters.length}</span>
        </p>
        {voters.length < 1 ? (
          <div className="text-xl text-orange-400 font-bold mt-24">
            None Has Registered Yet
          </div>
        ) : (
          <div className="flex flex-col items-center justify-start pt-8 w-[60vw] h-fit">
            <div className="text-center text-xl font-mono font-semibold text-zinc-700 mb-8">
              List of registered voters
            </div>
            <div className="flex flex-col-reverse">
              {voters.map((voter, index) => (
                <div key={index}>{renderUnverifiedVoters(voter)}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Verification;

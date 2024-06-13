"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";

const Voting = () => {
  const router = useRouter();
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);
  const [currentVoter, setCurrentVoter] = useState({
    address: undefined,
    name: null,
    phone: null,
    hasVoted: false,
    isVerified: false,
    isRegistered: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
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
        setCandidateCount(candidateCount);
        const start = await instance.methods.getStart().call();
        setIsElStarted(start);
        const end = await instance.methods.getEnd().call();
        setIsElEnded(end);
        const loadedCandidates = [];
        for (let i = 1; i <= candidateCount; i++) {
          const candidate = await instance.methods
            .candidateDetails(i - 1)
            .call();
          loadedCandidates.push({
            id: candidate.candidateId,
            header: candidate.header,
            slogan: candidate.slogan,
          });
        }
        setCandidates(loadedCandidates);
        const voter = await instance.methods.voterDetails(accounts[0]).call();
        setCurrentVoter({
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
        });
        const admin = await instance.methods.getAdmin().call();
        if (accounts[0] === admin) {
          setIsAdmin(true);
        }
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const castVote = async (id) => {
    await ElectionInstance.methods
      .vote(id)
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const confirmVote = (id, header) => {
    var r = window.confirm(
      "Vote for " + header + " with Id " + id + ".\nAre you sure?"
    );
    if (r === true) {
      castVote(id);
    }
  };

  const renderCandidates = (candidate) => (
    <div
      className="border-2 border-neutral-100 bg-orange-100 shadow-lg rounded-md flex items-center justify-between p-4 space-x-24"
      key={candidate.id}
    >
      <div className=" p-2">
        <p className="text-2xl font-sans font-bold py-2 text-zinc-700">
          {candidate.header}{" "}
          <small className="text-sm">(#{+candidate.id + 1})</small>
        </p>
        <p className="slogan">{candidate.slogan}</p>
      </div>
      <button
        onClick={() => confirmVote(candidate.id, candidate.header)}
        className={`rounded-md cursor-pointer h-[4vw] w-[4vw] flex items-center justify-center text-semibold
           ${
             !currentVoter.isRegistered ||
             !currentVoter.isVerified ||
             currentVoter.hasVoted
               ? "bg-gray-100 text-gray-400 cursor-not-allowed"
               : "text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
           } font-medium px-5 text-sm text-center mx-auto py-4 mb-2 `}
        disabled={
          !currentVoter.isRegistered ||
          !currentVoter.isVerified ||
          currentVoter.hasVoted
        }
      >
        Vote
      </button>
    </div>
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

  return (
    <main className="h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8 ">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className="px-14   h-fit py-8 flex flex-col">
        {!isElStarted && !isElEnded ? (
          <NotInit />
        ) : isElStarted && !isElEnded ? (
          <div className="  flex flex-col">
            {currentVoter.isRegistered ? (
              currentVoter.isVerified ? (
                currentVoter.hasVoted ? (
                  <div className="flex justify-center items-center gap-6 py-4 ">
                    <p className="text-3xl font-mono font-bold">
                      You've casted your vote
                    </p>
                    <button
                      onClick={() => router.push("/results")}
                      className="p-2 rounded-lg text-sm text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                    >
                      See Results
                    </button>
                  </div>
                ) : (
                  <div className="">
                    <center>Go ahead and cast your vote.</center>
                  </div>
                )
              ) : (
                <div className=" py-4">
                  <center className="font-mono text-2xl font-extrabold">
                    Please wait for admin to verify.
                  </center>
                </div>
              )
            ) : (
              <>
                <div className="  ">
                  <center>
                    <p>You're not registered. Please register first.</p>
                    <br />
                    <button
                      onClick={() => router.push("/registration")}
                      className="underline"
                    >
                      Registration Page
                    </button>
                  </center>
                </div>
              </>
            )}
            <div className="flex flex-col items-center ">
              <p className="text-center text-2xl font-sans font-bold py-4">
                Candidates
              </p>
              <small className="text-center text-3xl font-mono font-semibold">
                Total candidates: {candidates.length}
              </small>
              {candidates.length < 1 ? (
                <div className="container-item attention">
                  <center className="text-center text-normal font-sans font-semibold py-4">
                    No one to vote for.
                  </center>
                </div>
              ) : (
                <div className=" flex flex-col w-fit space-y-6 p-4 mt-4">
                  {candidates.map(renderCandidates)}
                  <div className="w-[20vw] bg-white rounded-md self-center py-2 font-semibold text-gray-700">
                    <center>That&apos;s all</center>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isElStarted && isElEnded ? (
          <>
            <div className="container-item attention">
              <center>
                <h3>The Election ended.</h3>
                <br />
                <button
                  onClick={() => router.push("/results")}
                  className="underline"
                >
                  See results
                </button>
              </center>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default Voting;

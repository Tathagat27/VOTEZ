"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Result = () => {
  const router = useRouter();
  const [web3, setWeb3] = useState(null);
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [candidateCount, setCandidateCount] = useState(undefined);
  const [candidates, setCandidates] = useState([]);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
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
          setCandidateCount(candidateCount);

          const start = await instance.methods.getStart().call();
          setIsElStarted(start);
          const end = await instance.methods.getEnd().call();
          setIsElEnded(end);

          const candidates = [];
          for (let i = 1; i <= candidateCount; i++) {
            const candidate = await instance.methods
              .candidateDetails(i - 1)
              .call();
            candidates.push({
              id: candidate.candidateId,
              header: candidate.header,
              slogan: candidate.slogan,
              voteCount: candidate.voteCount,
            });
          }
          setCandidates(candidates);

          const admin = await instance.methods.getAdmin().call();
          if (accounts[0] === admin) {
            setIsAdmin(true);
          }
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
    };
    init();
  }, [isLoaded]);

  const displayWinner = (candidates) => {
    const getWinner = (candidates) => {
      let maxVoteRecived = 0;
      let winnerCandidate = [];
      candidates.forEach((candidate) => {
        if (candidate.voteCount > maxVoteRecived) {
          maxVoteRecived = candidate.voteCount;
          winnerCandidate = [candidate];
        } else if (candidate.voteCount === maxVoteRecived) {
          winnerCandidate.push(candidate);
        }
      });
      return winnerCandidate;
    };

    const renderWinner = (winner) => (
      <div className="flex justify-center items-center w-full h-[62vh]">
      <div className="flex flex-col items-center justify-start pt-6 snap-center snap-always border-4 border-red-100 rounded-2xl w-[50vw] h-[40vh] bg-white shadow-2xl" key={winner.id}>
        <div className="winner-info">
          <p className="text-[3vw] font-serif italic capitalize font-bold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-transparent bg-clip-text my-2 ">{winner.header}</p>
          <p className="text-sm font-mono capitalize font-light my-2 text-red-700">{winner.slogan}x</p>
        </div>
        <div className="flex items-center justify-center text-pink-700">
          <div className="text-2xl font-sans font-bold mr-4 mt-4">Total Votes : </div>
          <div className="text-3xl font-serif mt-4 text-red-600 font-extrabold">{winner.voteCount}</div>
        </div>
      </div>
      </div>
    );

    const winnerCandidate = getWinner(candidates);
    return <>{winnerCandidate.map(renderWinner)}</>;
  };

  const displayResults = (candidates) => {
    const renderResults = (candidate) => (
      <tr className="" key={candidate.id}>
        <td className="border-r-2 border-r-red-200">{+candidate.id + 1 }</td>
        <td className="border-r-2 border-r-red-200 font-semibold">{candidate.header}</td>
        <td className="font-bold">{candidate.voteCount}</td>
      </tr>
    );

    return (
      <>
        <div className="h-[80vh] snap-end snap-always  flex flex-col justify-start items-center">
        {candidates.length > 0 ? (
            <>
            <div className="animate-pulse text-[5vw] font-sans font-bold bg-gradient-to-tr from-red-600 via-yellow-600 to-orange-300 text-transparent bg-clip-text">
               WINNER
            </div>
            <div className="border-2 border-orange-200 bg-orange-100/50 rounded-xl w-full h-[65vh] overflow-auto snap-y snap-mandatory flex flex-col items-center justify-start">
              {displayWinner(candidates)}
            </div>
            </>
        ) : (
          <div className="text-3xl font-serif tracking-wider  mb-4 text-red-800">
            No Candidates were added to the election
          </div>
        )}
          </div>
        <div className="h-[100vh] snap-start snap-always flex flex-col items-center justify-start pt-24 ">
          <small className="text-2xl font-mono font-semibold text-zinc-700 my-6">Total candidates : {candidates.length}</small>
          {candidates.length < 1 ? (
            <div className="container-item attention">
              <center>No candidates.</center>
            </div>
          ) : (
            <div className="border-2 border-orange-200 bg-orange-100/50 rounded-xl w-full h-[65vh] overflow-auto flex flex-col  justify-start">
              <div className="container-item">
                <table className="w-full">
                  <thead className="border-b-2 border-b-red-200 text-lg font-mono">
                    <tr>
                      <th className="border-r-2 border-r-red-200">ID</th>
                      <th className="border-r-2 border-r-red-200">Candidate</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody className="font-sans text-center text-md gap-4">{candidates.map(renderResults)}</tbody>
                </table>
              </div>
              <div
                className="container-item"
              >
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

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

  return (
    <main className=" h-screen w-full overflow-auto snap-y snap-mandatory scroll-smooth flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/home"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      <div className="px-14">
        {!isElStarted && !isElEnded ? (
          <NotInit />
        ) : isElStarted && !isElEnded ? (
          <div className="h-[80vh] py-8 flex flex-col justify-center">
          <div className="  flex flex-col text-xl bg-white rounded-xl shadow-xl border-2 border-red-200 py-16 ">
            <center>
              <h3 className="font-serif text-4xl text-red-800 mb-8">The election is being conducted at the moment.</h3>
              <p className="font-sans text-2xl text-orange-600 mb-12 font-bold">Result will be displayed once the election has ended.</p>
              <p className="font-mono text-xl text-pink-800 ">Go ahead and cast your vote {"(if not already)"}</p>
              <br />
              <button
                onClick={() => router.push("/voting")}
                className="p-4 rounded-lg text-sm font-sans text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              >
                Voting Page
              </button>
            </center>
          </div>
          </div>
        ) : (
          !isElStarted && isElEnded && displayResults(candidates)
        )}
      </div>
    </main>
  );
};

export default Result;

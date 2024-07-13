"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar/Navigation";
import NavbarAdmin from "../Components/Navbar/NavigationAdmin";
import NotInit from "../Components/NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";
import Link from "next/link";

const Registration = () => {
  const [web3, setWeb3] = useState(null);
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isElEnded, setIsElEnded] = useState(false);
  const [voterCount, setVoterCount] = useState(undefined);
  const [voterName, setVoterName] = useState("");
  const [voterPhone, setVoterPhone] = useState("");
  const [voters, setVoters] = useState([]);
  const [currentVoter, setCurrentVoter] = useState({
    address: undefined,
    name: null,
    phone: null,
    hasVoted: false,
    isVerified: false,
    isRegistered: false,
  });

  useEffect(() => {
    const init = async () => {
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

        const admin = await instance.methods.getAdmin().call();
        setIsAdmin(accounts[0] === admin);

        const start = await instance.methods.getStart().call();
        setIsElStarted(start);
        const end = await instance.methods.getEnd().call();
        setIsElEnded(end);

        const voterCount = await instance.methods.getTotalVoter().call();
        setVoterCount(voterCount);

        const voters = [];
        for (let i = 0; i < voterCount; i++) {
          const voterAddress = await instance.methods.voters(i).call();
          const voter = await instance.methods
            .voterDetails(voterAddress)
            .call();
          voters.push({
            address: voter.voterAddress,
            name: voter.name,
            phone: voter.phone,
            hasVoted: voter.hasVoted,
            isVerified: voter.isVerified,
            isRegistered: voter.isRegistered,
          });
        }
        setVoters(voters);

        const currentVoter = await instance.methods
          .voterDetails(accounts[0])
          .call();
        setCurrentVoter({
          address: currentVoter.voterAddress,
          name: currentVoter.name,
          phone: currentVoter.phone,
          hasVoted: currentVoter.hasVoted,
          isVerified: currentVoter.isVerified,
          isRegistered: currentVoter.isRegistered,
        });
      } catch (error) {
        console.error(error);
        alert(
          `Failed to load web3, accounts, or contract. Check console for details (f12).`
        );
      }
    };
    init();
  }, []);

  const registerAsVoter = async () => {
    await ElectionInstance.methods
      .registerAsVoter(voterName, voterPhone)
      .send({ from: account, gas: 1000000 });
    window.location.reload();
  };

  const updateVoterName = (event) => setVoterName(event.target.value);
  const updateVoterPhone = (event) => setVoterPhone(event.target.value);

  const loadCurrentVoter = (voter, isRegistered) => (
    <div className="flex flex-col items-center justify-start pt-24 h-[80vh] ">
      <div
        className={"container-item " + (isRegistered ? "success" : "attention")}
      >
        <center className="text-center text-2xl font-sans font-bold mb-8">
          Your Registered Info
        </center>
      </div>
      <div
        className={
          "border-2 border-black rounded-lg w-[50vw] h-[40vh] " +
          (isRegistered ? "bg-lime-100" : "bg-gray-100")
        }
      >
        <table className="w-full h-full rounded-lg shadow-xl">
          <tbody>
            <tr>
              <th>Account Address</th>
              <td>{voter.address}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{voter.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{voter.phone}</td>
            </tr>
            <tr>
              <th>Voted</th>
              <td>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verification</th>
              <td>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const loadAllVoters = (voters) => (
    <div className="flex flex-col items-center justify-start pt-8 w-[60vw] h-fit">
      <div className="container-item success">
        <center className="text-center text-2xl font-sans font-bold mb-8">
          List of voters
        </center>
      </div>
      {voters.map((voter, index) => (
        <div
          key={index}
          className="border-2 border-black rounded-lg w-[50vw] h-[40vh] bg-cyan-50"
        >
          <table className="w-full h-full rounded-lg shadow-xl">
            <tbody>
              <tr>
                <th>Account address</th>
                <td>{voter.address}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{voter.name}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{voter.phone}</td>
              </tr>
              <tr>
                <th>Voted</th>
                <td>{voter.hasVoted ? "True" : "False"}</td>
              </tr>
              <tr>
                <th>Verified</th>
                <td>{voter.isVerified ? "True" : "False"}</td>
              </tr>
              <tr>
                <th>Registered</th>
                <td>{voter.isRegistered ? "True" : "False"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
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
    <main className=" h-screen w-full overflow-auto flex flex-col gap-8 px-20 pt-8">
      <div className="self-center absolute w-fit ">
        {isAdmin ? <NavbarAdmin /> : <Navbar />}
      </div>
      <Link
        href="/"
        className="w-fit flex items-center text-3xl font-extrabold tracking-tight font-serif"
      >
        VOTEZ
      </Link>
      {!isElStarted && !isElEnded ? (
        <NotInit />
      ) : (
        <div className=" px-14  ">
          <div className="h-[80vh]   py-8">
            <div className="container-item info">
              <p className="text-center text-xl font-mono font-bold ">
                Total registered voters: {voters.length}
              </p>
            </div>
            <div className="container-main">
              {/* <p className="text-center text-3xl font-sans font-bold my-4">Registration</p> */}
              <p className="container-item info text-center text-lg text-orange-400 font-semibold my-4">
                Register to vote
              </p>
              <div className="container-item  ">
                <form>
                  <div className="mx-auto w-fit  ">
                    <div className="div-li">
                      <label className="text-center text-lg font-sans font-semibold mb-2 w-[55vw] flex justify-end gap-6 items-center  ">
                        Account Address
                        <input
                          className="w-[35vw] p-2 font-semibold text-zinc-500"
                          type="text"
                          value={account}
                          readOnly
                        />{" "}
                      </label>
                    </div>
                    <div className="div-li">
                      <label className="text-center text-lg font-sans font-semibold mb-2 w-[55vw] flex justify-end gap-6 items-center">
                        Name
                        <input
                          className="w-[35vw] p-2 font-normal"
                          type="text"
                          placeholder="eg. Ava"
                          value={voterName}
                          onChange={updateVoterName}
                        />{" "}
                      </label>
                    </div>
                    <div className="div-li">
                      <label className="text-center text-lg font-sans font-semibold mb-2 w-[55vw] flex justify-end gap-2 items-center">
                        Phone number <span style={{ color: "tomato" }}>*</span>
                        <input
                          className="w-[35vw] p-2 font-normal"
                          type="tel"
                          placeholder="eg. 9841234567"
                          value={voterPhone}
                          onChange={updateVoterPhone}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="  flex flex-col">
                    <p className="flex gap-4 mx-8">
                      <span style={{ color: "tomato" }}> Note: </span>
                      <p>
                        <br />* Make sure your account address and Phone number
                        are correct. <br />* Admin might not approve your
                        account if the provided Phone number does not match the
                        account address registered in admin&apos;s catalog.
                      </p>
                    </p>
                    <button
                      className={`text-white ${
                        voterPhone.length !== 10 || currentVoter.isVerified
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                      } font-medium rounded-lg px-5 text-sm w-72 text-center mx-auto py-4 mt-4`}
                      disabled={
                        voterPhone.length !== 10 || currentVoter.isVerified
                      }
                      onClick={registerAsVoter}
                    >
                      {currentVoter.isRegistered ? "Update" : "Register"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="container-main h-[80vh] mt-24">
            {loadCurrentVoter(currentVoter, currentVoter.isRegistered)}
          </div>
          {isAdmin && (
            <div className="flex flex-col items-center min-h-[80vh] mt-24 pt-24 pb-12">
              <small className="text-center text-xl font-mono font-bold ">
                Total Voters: {voters.length}
              </small>
              {loadAllVoters(voters)}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Registration;

// utils/getWeb3.js
import Web3 from "web3";

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    // Check if window is defined to ensure we are in the browser
    if (typeof window !== "undefined") {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          window.ethereum.request({ method: "eth_requestAccounts" })
            .then(() => resolve(web3))
            .catch((error) => reject(error));
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      } else {
        const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    } else {
      reject(new Error("Web3 is not available on the server side"));
    }
  });
};

export default getWeb3;

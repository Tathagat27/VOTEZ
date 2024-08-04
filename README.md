# VOTEZ


VOTEZ is an online voting system leveraging blockchain technology for secure, transparent, and decentralized elections. Built with Ethereum, Solidity, Next.js, Tailwind CSS, and Truffle, VOTEZ provides a robust platform for managing elections. Admins can add candidates and verify voters, while users can register, cast votes, and view results after the election concludes.

# 🧑🏻‍💻 Why did I build this?

I created VOTEZ to tackle the common issues in traditional voting systems, such as security concerns, lack of transparency, and accessibility problems. By integrating blockchain technology, VOTEZ ensures that every vote is securely recorded and transparently managed. My goal is to provide a seamless, trustworthy, and efficient voting experience for both voters and administrators.
# 🛠️ Local development

That's pretty easy. To ensure that you are able to install everything properly, we would recommend you to have <b>[Git](https://git-scm.com/downloads)</b>, and <b>[Node.js](https://nodejs.org/en/download)</b> installed.

Also, download [Ganache](https://archive.trufflesuite.com/ganache/) on your system, and run it by quickstart.

Then, install Truffle using :
```sh
npm install -g truffle
```

Also, download [Metamask extension](https://metamask.io/download/) for your browser. And, import 3-4 accounts from Ganache using private keys. 

We will first start with setting up the Local Project Environment:

```sh
git clone https://github.com/Tathagat27/VOTEZ.git

cd VOTEZ

npm install

cd /client

npm run dev:install

```



Now we are all set to run the app ✔️

On the root level run the following command:

```sh
truffle migrate --network development --reset
```

And, you are all set to use this application 🚀

# ✨ Main Features

- **Decentralized Voting System**: Leveraging Ethereum blockchain to ensure a decentralized and tamper-proof voting process, providing high levels of security and trust.

- **Role-Based Access Control**: Admins and users have distinct roles with specific permissions. Admins can add candidates and verify voters, while users can register, vote, and view results.

- **Transparent Voting Records**: Every vote is recorded on the blockchain, ensuring complete transparency. Voters can verify that their vote was counted correctly without compromising the anonymity of their ballot.

- **Immutable Data**: Once a vote is cast, it cannot be altered or deleted, ensuring the integrity of the election results.

- **User-Friendly Interface**: Simple and intuitive UI for both admins and voters, making the voting process straightforward and accessible.

- **Election Verification**: Admins can verify voter identities and validate the election process to ensure only eligible voters can participate.

- **Secure Voter Registration**: A robust registration system prevents fraud and ensures that each voter can only register once.


# 📜 LICENSE

[MIT LICENSE](https://github.com/Tathagat27/VOTEZ/blob/main/LICENSE)

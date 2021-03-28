# Chess Solidity Game
<br/>

![Gif](https://media.giphy.com/media/diYJJsl2q0r3dEZnmC/source.gif)<br/><br/>

Developed using:<br/>
-[Ganache](https://www.trufflesuite.com/ganache) to simulate a local blockchain<br/>
-[Truffle](https://www.trufflesuite.com/) to compile and migrate the smart contracts<br/>
-[Solidity](https://docs.soliditylang.org/) as a compiler for the smart contracts<br/>
-[Web3](https://web3js.readthedocs.io) to connect the front-end to the blockchain<br/>
-[React](https://it.reactjs.org/) for the front-end<br/>
-[Mocha](https://mochajs.org/) for testing (not implemented yet)<br/>
-[OpenZeppelin](https://openzeppelin.com/) for the library<br/>
-[HDWallet-provider](https://www.npmjs.com/package/@truffle/hdwallet-provider) used in the migration<br/>
-[Infura](https://infura.io/) I didn't wanted to create a local node in the testnet of Ropsten, so I used infura to have a node webhosted<br/>
-[Ropsten Testnet](https://faucet.ropsten.be/) faucet for the Ropsten testnet<br/><br/>

I used the library OpenZeppelin to develop an ERC20 token (in Solidity) in a few lines of code, added a function so that the token can work as a faucet, after that I used Truffle to compile and migrate (to Ganache) the smart contract, there 2 available networks, the [Ropsten Testnet](https://faucet.ropsten.be/) or a local blockchain using [Ganache](https://www.trufflesuite.com/ganache), Web3 was then used to connect React with Ganache through [Metamask](https://metamask.io/)

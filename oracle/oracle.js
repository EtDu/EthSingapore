const Web3 = require('web3')
const fs = require('fs')
const { Client, LocalAddress, CryptoUtils, LoomProvider } = require('loom-js')
const LoomTruffleProvider = require('loom-truffle-provider')

const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

const chainId = 'default'
const writeUrl = 'http://127.0.0.1:46658/rpc'
const readUrl = 'http://127.0.0.1:46658/query'

// Create the client
const client = new Client(
    'default',
    'ws://127.0.0.1:46658/websocket',
    'ws://127.0.0.1:46658/queryws',
)

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()

const contractJSON = JSON.parse(fs.readFileSync('./build/contracts/Payout.json', 'utf-8'))
const ABI = contractJSON.abi
const contractAddress = contractJSON.networks.default.address

// Instantiate web3 client using LoomProvider
const web3 = new Web3(new LoomProvider(client, privateKey))

const payoutContract = new web3.eth.Contract(ABI, contractAddress, { from })

const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
const loomProvider = loomTruffleProvider.getProviderEngine()

const localAddr = (LocalAddress.fromPublicKey(publicKey).toString())

payoutContract.methods.calculate(localAddr, 4).send()
// const testWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

payoutContract.events.dividendsCalculated({}, (err, event) => {
    if (err) {
        return console.error(err)
    }

    console.log(event.returnValues[1])
})





const oracle = {

    listenForEvents: function () {
        oracle.contractInst.lotteryContract.lottoInitialized({}, {
            fromBlock: '0',
            toBlock: 'latest'
        }).watch(function (error, event) {
            console.log(event)
        })
    }
}
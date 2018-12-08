const Web3 = require('web3')
const fs = require('fs')
const { Client, LocalAddress, CryptoUtils, LoomProvider } = require('loom-js')
const LoomTruffleProvider = require('loom-truffle-provider')

const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

// const chainId = 'default'
// const writeUrl = 'http://127.0.0.1:46658/rpc'
// const readUrl = 'http://127.0.0.1:46658/query'


// const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
// const loomProvider = loomTruffleProvider.getProviderEngine()

// loomTruffleProvider.createExtraAccounts(10)

// for (var [key, val] of loomProvider.accounts) {
//     console.log(key)
// }

const Oracle = {

    kovanWeb3Inst: null,
    kovanContractInst: {},
    kovanContractAddress: null,

    extDevWeb3Inst: null,
    extDevContractInst: {},
    extDevContractAddress: null,

    extDevPrivateKey: null,
    extDevPublicKey: null,

    kovanCoinbase: null,
    extDevCoinbase: null,
    extDevAccounts: null,

    initializeEvent: null,

    newKovanWeb3: function () {
        this.kovanWeb3Inst = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/${process.env.INFURA_API_KEY}`))
        console.log("Successfully created Kovan web3 object")

        this.newKovanContract()

    },

    newKovanContract: function () {
        const securityCoinJSON = JSON.parse(fs.readFileSync('./src/contracts/SecurityCoin.json', 'utf-8'))
        const ABI = securityCoinJSON.abi
        this.kovanContractAddress = securityCoinJSON.networks['42'].address

        this.kovanContractInst.securityCoinContract = this.kovanWeb3Inst.eth.contract(ABI).at(this.kovanContractAddress)

        this.listenForKovanEvents()
        return this.setKovanCoinbase()
    },

    listenForKovanEvents: function () {
        this.kovanContractInst.securityCoinContract.securityPurchase({}, {
            fromBlock: '0',
            toBlock: 'latest'
        }).watch(function (error, event) {
            console.log(event)
        })
    },

    setKovanCoinbase: function () {
        this.kovanCoinbase = fs.readFileSync('kovan_account', 'utf-8')
        console.log('KOVAN COINBASE SET')
    },

    newExtDevWeb3: function () {

        let baseKey = new Buffer(fs.readFileSync('extdev_private_key', 'utf-8'), 'base64')
        this.extDevPrivateKey = baseKey.toString('hex')
        this.extDevPublicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

        const client = new Client(
            'default',
            'ws://127.0.0.1:46658/websocket',
            'ws://127.0.0.1:46658/queryws',
        )

        this.extDevWeb3Inst = new Web3(new LoomProvider(client, privateKey))

        console.log("Successfully created ExtDev web3 object")

        this.newExtDevContract()
    },

    newExtDevContract: function () {

        const from = LocalAddress.fromPublicKey(this.extDevPublicKey).toString()
        console.log(from)

        const payoutJSON = JSON.parse(fs.readFileSync('./src/contracts/Payout.json', 'utf-8'))
        const ABI = payoutJSON.abi
        this.extDevContractAddress = payoutJSON.networks.default.address
        this.extDevContractInst = this.extDevWeb3Inst.eth.contract(ABI, this.extDevContractAddress, { from })

        this.listenForExtDevEvents()
        return this.setExtDevCoinbase()
    },

    listenForExtDevEvents: function() {
        this.extDevContractInst.payoutsCalculated({}, (err, event) => {
            if (err) {
                return console.error(err)
            }
            console.log(event.returnValues[1])
        })
    },

    setExtDevCoinbase: function () {
        this.extDevCoinbase = (LocalAddress.fromPublicKey(publicKey).toString())
        console.log('EXTDEV COINBASE SET')
    },
}

Oracle.newKovanWeb3()
Oracle.newExtDevWeb3()
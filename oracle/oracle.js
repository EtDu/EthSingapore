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

    vaultInstance: null,
    vaultAddress: null,

    tokenAddrs: [],
    newTokenInstances: [],
    initializeEvent: null,

    newKovanWeb3: function () {
        this.kovanWeb3Inst = new Web3(new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws'))
        console.log("Successfully created Kovan web3 object")

        this.newKovanContract()

    },

    newKovanContract: function () {
        const securityCoinJSON = JSON.parse(fs.readFileSync('./src/contracts/SecurityCoin.json', 'utf-8'))
        const coinABI = securityCoinJSON.abi
        this.kovanContractAddress = securityCoinJSON.networks['42'].address
        
        const factoryJSON = JSON.parse(fs.readFileSync('./src/contracts/SecurityCoinFactory.json', 'utf-8'))
        const factoryABI = factoryJSON.abi
        this.factoryAddress = factoryJSON.networks['42'].address

        const vaultJSON = JSON.parse(fs.readFileSync('./src/contracts/Vault.json', 'utf-8'))
        const vaultAbi = vaultJSON.abi
        this.vaultAddress = vaultJSON.networks['42'].address


        this.kovanContractInst.securityCoinContract = new this.kovanWeb3Inst.eth.Contract(coinABI, this.kovanContractAddress, { from: '0x61d26a7642d61d339e6d8e8d6724bd2dd4a91e27' })

        this.kovanContractInst.factoryContract = new this.kovanWeb3Inst.eth.Contract(factoryABI, this.factoryAddress, { from: '0x61d26a7642d61d339e6d8e8d6724bd2dd4a91e27' })

        this.kovanContractInst.vaultInstance = new this.kovanWeb3Inst.eth.Contract(vaultAbi, this.vaultAddress, { from: '0x61d26a7642d61d339e6d8e8d6724bd2dd4a91e27' })
        

        this.listenForKovanEvents()
        return this.setKovanCoinbase()
    },

    listenForKovanEvents: function () {
        const securityCoinJSON = JSON.parse(fs.readFileSync('./src/contracts/SecurityCoin.json', 'utf-8'))
        
        this.kovanContractInst.factoryContract.events.NewSecurityCoin({ fromBlock: 0, toBlock: 'latest' }, (err, events) => {
            if (err) {
                console.log(err)
            } else {
                this.tokenAddrs.push(events.returnValues[0])
                const ABI = securityCoinJSON.abi

                for (let i=0; i<this.tokenAddrs.length; i++) {

                    this.newTokenInstances.push(new this.kovanWeb3Inst.eth.Contract(ABI, this.tokenAddrs[i], { from: '0x61d26a7642d61d339e6d8e8d6724bd2dd4a91e27' })) 

                    this.newTokenInstances[i].events.securityPurchase({ fromBlock: 0, toBlock: 'latest' }, (err, newEvents) => {
                        if (err) {
                            console.log(err)
                        } else {
                            this.extDevContractInst.payoutContract.methods.calculate(newEvents.returnValues[0], this.tokenAddrs[i] ,newEvents.returnValues[1]).send()
                        }
                    })
                    

                }



            }
        })


        this.kovanContractInst.securityCoinContract.events.TriggerWithdraw({ fromBlock: 0, toBlock: 'latest'},(err, events) => {
            if (err) {
                console.log(err)
            } else {
                this.extDevContractInst.payoutContract.methods.withdraw(events.returnValues[0]).send()
            }
        })
    },

    setKovanCoinbase: function () {
        this.kovanCoinbase = fs.readFileSync('kovan_account', 'utf-8')
        console.log('KOVAN COINBASE SET')
    },

    newExtDevWeb3: function () {

        let baseKey = new Buffer(fs.readFileSync('private_key', 'utf-8'), 'base64')
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

        const payoutJSON = JSON.parse(fs.readFileSync('./src/contracts/Payout.json', 'utf-8'))
        const ABI = payoutJSON.abi
        this.extDevContractAddress = payoutJSON.networks.default.address
        this.extDevContractInst.payoutContract = new this.extDevWeb3Inst.eth.Contract(ABI, this.extDevContractAddress, { from })
        
        this.listenForExtDevEvents()
        return this.setExtDevCoinbase()
    },

    listenForExtDevEvents: function() {
        

        this.extDevContractInst.payoutContract.events.payoutsWithdrawn((err, event) => {
            if (err) {
                return console.error(err)
            }
            this.kovanContractInst.vaultInstance.methods.transfer(event.returnValues[0], event.returnValues[1]).send()
            
        })
    },

    setExtDevCoinbase: async function () {
        this.extDevCoinbase = (LocalAddress.fromPublicKey(publicKey).toString())
        console.log('EXTDEV COINBASE SET')
    },

    getRate: async function() {
        return this.extDevContractInst.payoutContract.methods.getRate().call()
    },

    getInterval: async function() {
        return this.extDevContractInst.payoutContract.methods.getInterval().call()
    },

    getDividends: async function(owner) {
        return this.extDevContractInst.payoutContract.methods.getDividends(owner).call()
    },

    calculate: async function(owner, contractAddr, amount) {
        return this.extDevContractInst.payoutContract.methods.calculate(owner, contractAddr, amount).send()
    }





}

module.exports.Oracle = Oracle
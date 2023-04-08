const { ethers, run } = require("hardhat")
const { NomicLabsHardhatPluginError } = require("hardhat/plugins")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()

    await simpleStorage.deployed()
    console.log(`Deployed contract to ${simpleStorage.address}`)

    // console.log(network.config)
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value is ${currentValue}`)

    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value is ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArgunents: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        }
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})

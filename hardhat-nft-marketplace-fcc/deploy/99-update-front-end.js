const fs = require("fs")
const { network, ethers } = require("hardhat")

const frontEndContractsFile = "../nextjs-nft-marketplace-fcc/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs-nft-marketplace-fcc/constants/"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("updating front end...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["NftMarketplace"].includes(nftMarketplace.address)) {
            contractAddresses[chainId]["NftMarketplace"].push(nftMarketplace.address)
        }
    } else {
        contractAddresses[chainId] = { NftMarketplace: [nftMarketplace.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )
}

module.exports.tags = ["all", "frontend"]

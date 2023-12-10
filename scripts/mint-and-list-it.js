const { ethers } = require("hardhat")

async function mintAndList() {
    const MIN = 0.01
    const MAX = 1.2
    const INCREMENT = 0.1
    const randomNumber = MIN + Math.floor((Math.random() * (MAX - MIN)) / INCREMENT) * INCREMENT
    const PRICE = ethers.utils.parseEther(randomNumber.toString())

    const NftMarketplace = await ethers.getContract("NftMarketplace")
    const contractNFT = await ethers.getContract("EtherealNFTs")
    const mintFee = await contractNFT.getMintFee()

    console.log("Minting...")
    const mintTx = await contractNFT.mintNFT({ value: mintFee.toString() })
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log("Approving Nft...")
    const approvalTx = await contractNFT.approve(NftMarketplace.address, tokenId)
    await approvalTx.wait(1)

    console.log("Listing NFT...")
    const tx = await NftMarketplace.listItem(contractNFT.address, tokenId, PRICE)
    console.log("Listed!")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

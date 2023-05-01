import { useMoralis } from "react-moralis"
import networkMapping from "../../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import NFTBox from "../components/NFTBox"

export default function Home() {
    // How do we show the recently listed NFTs?

    // We will index the events off-chain and then read from our database.
    // Setup a server to listen for those events to be fired, and we will add them to a database to query.
    /// TheGraph does this in a decentralized way
    /// Moralis does this in a centralized way

    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    console.log("chainString", chainString)
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled && chainId ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return marketplaceAddress ? (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div>Network error, please switch to a supported network.</div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}

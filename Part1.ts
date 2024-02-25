import {ethers, id, zeroPadValue} from "ethers";

/**
 * Get the transfer events for a given token and addresses where address is the sender or recipient
 * @dev: Max block range reached here
 */

const enum TransferType {
    SENT= "Sent",
    RECEIVED = "Received"
}

type Transfer = {
    hash: string;
    blockNumber: number;
    address: string;
    amount: number;
    transferType: TransferType;
}

type enrichedFilter = {
    address: string;
    transferType: TransferType;
    filter: ethers.Filter;
}


const providerUrl = 'https://polygon-mumbai-bor.publicnode.com';
const provider = new ethers.JsonRpcProvider(providerUrl);
const BAR_TOKEN_ADDRESS = '0x5B572ef94C96B6d95B0ADD49664b945eAb671dE8';

const years = 1;
const addresses = ['0x9F89836C22f250595DEA30327af026bA1c029f28', '0x812c44b6661aA519aA590B7DE43d8F1cf5f6D038', '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa'];

// async function getTransferEvents(years: number, addresses: string[]): Promise<Transfer[]> {
//     const currentBlock = await provider.getBlockNumber();
//     const blocksPerYear = 49000;
//     const startBlock = currentBlock - (blocksPerYear * years);
//
//     const transfers: Transfer[] = [];
//
//     try {
//
//         let filters: enrichedFilter[] = [];
//
//         addresses.forEach(address => {
//             filters.push({
//                 address: address,
//                 transferType: TransferType.SENT,
//                 filter: {address: BAR_TOKEN_ADDRESS,
//                     topics:[id('Transfer(address,address,uint256)'), zeroPadValue(address, 32), null]
//             }
//         });
//             filters.push({
//                 address: address,
//                 transferType: TransferType.RECEIVED,
//                 filter: {address: BAR_TOKEN_ADDRESS,
//                     topics:[id('Transfer(address,address,uint256)'), null, zeroPadValue(address,32)]
//                 }
//             });
//         })
//
//         for (const filter of filters) {
//             const events: ethers.Log[] = await provider.getLogs({ ...filter.filter, fromBlock: startBlock, toBlock: 'latest' });
//
//             for (const event of events) {
//
//                 const transferEvent: Transfer = {
//                     hash: event.transactionHash,
//                     blockNumber: event.blockNumber,
//                     address: filter.address,
//                     amount: Number(event.data),
//                     transferType: filter.transferType
//                 };
//
//                 transfers.push(transferEvent);
//             }
//       }
//     } catch (e) {
//         console.error(e);
//     }
//     console.log("transfers",transfers);
//     return transfers;
// }
// getTransferEvents(years, addresses);


/**
 * Get the transfer events for a given token and addresses where address is the sender or recipient
 * @dev: Looping on max block range over the average block amount per year
 */
async function getRangedTransferEvents(years: number, addresses: string[]): Promise<Transfer[]> {
    const currentBlock = await provider.getBlockNumber();
    const blocksPerYear = 2252571;
    let startBlock = currentBlock - Math.floor(blocksPerYear * years);
    const maxBlockRange = 49000;

    const transfers: Transfer[] = [];

    try {
        while (startBlock < currentBlock) {
            let endBlock = startBlock + maxBlockRange > currentBlock ? currentBlock : startBlock + maxBlockRange;

            let filters: enrichedFilter[] = [];

            addresses.forEach(address => {
                filters.push({
                    address: address,
                    transferType: TransferType.SENT,
                    filter: {address: BAR_TOKEN_ADDRESS,
                        topics:[id('Transfer(address,address,uint256)'), zeroPadValue(address, 32), null]
                    }
                });
                filters.push({
                    address: address,
                    transferType: TransferType.RECEIVED,
                    filter: {address: BAR_TOKEN_ADDRESS,
                        topics:[id('Transfer(address,address,uint256)'), null, zeroPadValue(address,32)]
                    }
                });
            })

            for (const filter of filters) {
                const events: ethers.Log[] = await provider.getLogs({ ...filter.filter, fromBlock: startBlock, toBlock: endBlock });

                for (const event of events) {

                    const transferEvent: Transfer = {
                        hash: event.transactionHash,
                        blockNumber: event.blockNumber,
                        address: filter.address,
                        amount: Number(event.data),
                        transferType: filter.transferType
                    };

                    transfers.push(transferEvent);
                }
            }

            startBlock = endBlock + 1;
        }
    } catch (e) {
        console.error(e);
    }
    console.log("transfers",transfers);
    return transfers;
}

getRangedTransferEvents(0.01, addresses);


/**
 * Potential Improvements:
 *  - Use an Indexer such as TheGraph to index all transfers and use GraphQL queries to get this info instead of onChain calls.
 *  - Paginate results, even with TheGraph (max 1000 results per query)
 *  - Use third party node providers to get faster results
 *  - Use Tools like Moralis to query directly by timestamp instead on estimating block numbers
 *  - Use env variables for constants, RPC Urls, etc
 *  - I would need more infos on what this function will be used for and the context to provide more accurate improvements. eg: if meant to be a public API, implement DDOS protections (cloudflare)
 */

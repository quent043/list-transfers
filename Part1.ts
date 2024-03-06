import {ethers, id, zeroPadValue} from "ethers";


/**
 * @notice: Types and enums
 */
const enum TransferType {
    SENT= "Sent",
    RECEIVED = "Received"
}

type Transfer = {
    blockHash: string;
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

/**
 * @notice: Definitions
 */
const BAR_TOKEN_ADDRESS = '0x5B572ef94C96B6d95B0ADD49664b945eAb671dE8';
const providerUrl = 'https://polygon-mumbai-bor.publicnode.com';
const provider = new ethers.JsonRpcProvider(providerUrl);


/**
 * @notice: Function variables
 */
const years = 0.02;
const addresses = ['0x9F89836C22f250595DEA30327af026bA1c029f28', '0x812c44b6661aA519aA590B7DE43d8F1cf5f6D038', '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa'];


/**
 * @notice: Get the transfer events for a given token and addresses where address is the sender or recipient
 * @dev: Max block range per call is 50,000, so this functions loops on this amount over the average block amount per year
 * @param: years: number of years to get the transfer events
 * @param: addresses: addresses to check for transfers
 * @returns: Transfer[] containing all detected transfers
 */
async function getRangedTransferEvents(years: number, addresses: string[]): Promise<Transfer[]> {
    const currentBlock = await provider.getBlockNumber();
    const averageBlocksPerYear = 2252571;
    let startBlock = currentBlock - Math.floor(averageBlocksPerYear * years);
    const maxBlockRange = 49000;

    const transfers: Transfer[] = [];

    try {
        while (startBlock < currentBlock) {
            const nextEndBlock = startBlock + maxBlockRange;
            let endBlock = nextEndBlock > currentBlock ? currentBlock : nextEndBlock;

            let filters: enrichedFilter[] = [];

            addresses.forEach(address => {
                // Add filters for sent transfers
                filters.push({
                    address: address,
                    transferType: TransferType.SENT,
                    filter: {address: BAR_TOKEN_ADDRESS,
                        topics:[id('Transfer(address,address,uint256)'), zeroPadValue(address, 32), null]
                    }
                });
                // Add filters for sent transfers
                filters.push({
                    address: address,
                    transferType: TransferType.RECEIVED,
                    filter: {address: BAR_TOKEN_ADDRESS,
                        topics:[id('Transfer(address,address,uint256)'), null, zeroPadValue(address,32)]
                    }
                });
            })

            const promises: Promise<ethers.Log[]>[] = filters.map(filter =>
                provider.getLogs({ ...filter.filter, fromBlock: startBlock, toBlock: endBlock })
            );

            const results: ethers.Log[][] = await Promise.all(promises);

            for(const [index, events] of results.entries()) {
                const filter = filters[index];

                for(const event of events) {
                    const transferEvent: Transfer = {
                        blockHash: event.transactionHash,
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

getRangedTransferEvents(years, addresses);

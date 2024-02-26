## Part 1

## Introduction
Setup and run the script like so:

```shell
npm i

ts-node Part1.ts
```

## Function
This script includes an async function taking 2 arguments: years and addresses. It returns a promise of an array of Transfer objects.

```typescript
async function getRangedTransferEvents(years: number, addresses: string[]): Promise<Transfer[]>;

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



/**
 * @notice: example of return function executed 26/02/2024 - 6:00 UTC
 * @dev: BLocks are regularly pruned on the provided RPC. Results may differ if executed later in time
 */
transfers [
    {
        blockHash: '0xfa659163847b6d5b814bd5a8134e847778d4b909c7d0e9d41dca0812a1290cea',
        blockNumber: 46340704,
        address: '0x9F89836C22f250595DEA30327af026bA1c029f28',
        amount: 16,
        transferType: 'Sent'
    },
        {
            blockHash: '0x36249e5ccddd87e8a2f8a6f297fcb059e6c47b7e2a3ba84b5687413087d69a97',
            blockNumber: 46340719,
            address: '0x9F89836C22f250595DEA30327af026bA1c029f28',
            amount: 16,
            transferType: 'Sent'
        },
        {
            blockHash: '0xfa659163847b6d5b814bd5a8134e847778d4b909c7d0e9d41dca0812a1290cea',
            blockNumber: 46340704,
            address: '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa',
            amount: 16,
            transferType: 'Received'
        },
        {
            blockHash: '0x36249e5ccddd87e8a2f8a6f297fcb059e6c47b7e2a3ba84b5687413087d69a97',
            blockNumber: 46340719,
            address: '0x4B3380d3A8C1AF85e47dBC1Fc6C3f4e0c8F78fEa',
            amount: 16,
            transferType: 'Received'
        }
    ]

```

----

## Possible Improvements

 - Current scripts are not accurate, as not possible to query by timestamp
 - If the current approach is kept (query by block number), the first block number of each year could be recorded and used for queries instead of estimating the block number based on an average number of blocks mined per year
 - Use an Indexer such as TheGraph to index all transfers or the BAR token and use GraphQL queries to get this info per timestamp instead of onChain calls.
 - With current method, very old block history has often been pruned, hence the need of using an indexer
 - Paginate results, even with TheGraph (max 1000 results per query)
 - Create a centralized indexer for BAR token events, and have redundancy in case of failure
 - Use third party node providers to get faster results
 - Use Tools like Moralis to query directly by timestamp instead on estimating block numbers
 - Use env variables for constants, RPC Urls, etc
 - I would need more infos on what this function will be used for and the context to provide more accurate improvements. eg: if meant to be a public API, implement DDOS protections (cloudflare)

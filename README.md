## Part 1

## Introduction
Setup and run the script like so:

```shell
npm i

ts-node Part1.ts
```

## Function
This script inclides an async function taking 2 arguments: years and addresses. It returns a promise of an array of Transfer objects.

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
```

----

## Possible Improvements

 - Current scripts are not accurate at all as not possible to query by timestamp
 - If we want to keep the current approach, we could record the first block of every year and use it for queries instead of estimating the block number based on an average
 - Use an Indexer such as TheGraph to index all transfers and use GraphQL queries to get this info instead of onChain calls.
 - - With current method, very old block history has often been pruned, hence the need of using an indexer
 - Paginate results, even with TheGraph (max 1000 results per query)
 - Use third party node providers to get faster results
 - Use Tools like Moralis to query directly by timestamp instead on estimating block numbers
 - Use env variables for constants, RPC Urls, etc
 - I would need more infos on what this function will be used for and the context to provide more accurate improvements. eg: if meant to be a public API, implement DDOS protections (cloudflare)

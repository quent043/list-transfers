# Part 1


Setup and run the script like so:

```shell
npm i

ts-node Part1.ts
```

----

# Possible Improvements

*  - Use an Indexer such as TheGraph to index all transfers and use GraphQL queries to get this info instead of onChain calls.
*  - Paginate results, even with TheGraph (max 1000 results per query)
*  - Use third party node providers to get faster results
*  - Use Tools like Moralis to query directly by timestamp instead on estimating block numbers
*  - Use env variables for constants, RPC Urls, etc
*  - I would need more infos on what this function will be used for and the context to provide more accurate improvements. eg: if meant to be a public API, implement DDOS protections (cloudflare)

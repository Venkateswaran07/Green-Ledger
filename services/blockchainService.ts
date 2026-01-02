
import { Block, StageData } from '../types';

async function computeHash(
  index: number,
  previousHash: string,
  timestamp: number,
  data: StageData,
  emissions: number,
  chainId: string
): Promise<string> {
  const content = `${index}${previousHash}${timestamp}${JSON.stringify(data)}${emissions}${chainId}`;
  const msgBuffer = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const createBlock = async (
  chain: Block[],
  actor: string,
  data: StageData,
  emissions: number,
  category: string,
  batchId: string,
  trustAnalysis?: any
): Promise<Block> => {
  const previousBlock = chain[chain.length - 1];
  const index = chain.length;
  const timestamp = Date.now();
  const previousHash = previousBlock ? previousBlock.hash : '0';
  const cumulativeEmissions = (previousBlock ? previousBlock.cumulativeEmissions : 0) + emissions;

  // ChainID format: CategoryCode-ProductCode
  const chainId = data.chainId || "000-000";
  const productCode = data.productCode || 0;

  const hash = await computeHash(index, previousHash, timestamp, data, emissions, chainId);

  return {
    index,
    timestamp,
    actor,
    category,
    batchId,
    chainId,
    productCode,
    data,
    emissions,
    cumulativeEmissions,
    previousHash,
    hash,
    trustAnalysis,
    isTampered: false,
  };
};

export const validateChain = async (chain: Block[]): Promise<boolean[]> => {
  return await Promise.all(
    chain.map(async (block, i) => {
      if (i === 0) return true;
      const prevBlock = chain[i - 1];
      if (block.previousHash !== prevBlock.hash) return false;

      const targetHash = await computeHash(
        block.index,
        block.previousHash,
        block.timestamp,
        block.data,
        block.emissions,
        block.chainId
      );

      return targetHash === block.hash;
    })
  );
};

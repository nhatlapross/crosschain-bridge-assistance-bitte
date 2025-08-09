// utils/across.ts
export async function getAcrossQuote(
  inputToken: string,
  outputToken: string,
  amount: string,
  destinationChainId: number,
  originChainId: number
) {
  const response = await fetch(`https://api.across.to/suggested-fees?${new URLSearchParams({
    inputToken,
    outputToken,
    amount,
    destinationChainId: destinationChainId.toString(),
    originChainId: originChainId.toString()
  })}`);
  
  return response.json();
}
// utils/stargate.ts
export async function getStargateQuote(
  srcChainId: number,
  dstChainId: number, 
  token: string,
  amount: string
) {
  const response = await fetch('https://api.stargate.finance/v1/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      srcChainId,
      dstChainId,
      token,
      amount
    })
  });
  
  return response.json();
}
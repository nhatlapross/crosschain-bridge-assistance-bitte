import { NextResponse } from 'next/server';
import { parseEther } from 'viem';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      protocol, 
      fromChain, 
      toChain, 
      token, 
      amount, 
      recipient,
      slippage = "0.5" 
    } = body;

    if (!protocol || !fromChain || !toChain || !token || !amount || !recipient) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const transaction = await buildBridgeTransaction({
      protocol,
      fromChain,
      toChain,
      token,
      amount,
      recipient,
      slippage
    });

    return NextResponse.json({
      success: true,
      transaction,
      estimatedGas: transaction.gas,
      bridgeInfo: {
        protocol,
        route: `${fromChain} → ${toChain}`,
        estimatedTime: getBridgeTime(protocol),
        fees: getBridgeFees(protocol, amount)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create bridge transaction' },
      { status: 500 }
    );
  }
}

async function buildBridgeTransaction(params: any) {
  const { protocol, fromChain, toChain, token, amount, recipient } = params;
  
  // Mock transaction data - thay bằng logic thật
  switch (protocol.toLowerCase()) {
    case 'stargate':
      return buildStargateTransaction(params);
    case 'across':
      return buildAcrossTransaction(params);
    case 'hop':
      return buildHopTransaction(params);
    default:
      throw new Error(`Unsupported protocol: ${protocol}`);
  }
}

function buildStargateTransaction(params: any) {
  return {
    to: "0x8731d54E9D02c286767d56ac03e8037C07e01e98", // Stargate Router
    data: "0x...", // Encoded bridge call
    value: parseEther(params.amount).toString(),
    gas: "200000",
    chainId: getChainId(params.fromChain)
  };
}

function buildAcrossTransaction(params: any) {
  return {
    to: "0x4D9079Bb4165aeb4084c526a32695dCfd2F77381", // Across SpokePool
    data: "0x...", // Encoded bridge call
    value: parseEther(params.amount).toString(),
    gas: "150000",
    chainId: getChainId(params.fromChain)
  };
}

function buildHopTransaction(params: any) {
  return {
    to: "0xb8901acB165ed027E32754E0FFe830802919727f", // Hop Bridge
    data: "0x...", // Encoded bridge call
    value: parseEther(params.amount).toString(),
    gas: "250000",
    chainId: getChainId(params.fromChain)
  };
}

function getChainId(chainName: string): number {
  const chainIds: { [key: string]: number } = {
    'ethereum': 1,
    'polygon': 137,
    'arbitrum': 42161,
    'optimism': 10,
    'base': 8453,
    'avalanche': 43114
  };
  return chainIds[chainName.toLowerCase()] || 1;
}

function getBridgeTime(protocol: string): string {
  const times: { [key: string]: string } = {
    'stargate': '2-5 minutes',
    'across': '1-3 minutes',
    'hop': '10-20 minutes'
  };
  return times[protocol.toLowerCase()] || '5-10 minutes';
}

function getBridgeFees(protocol: string, amount: string): string {
  const feeRates: { [key: string]: number } = {
    'stargate': 0.0005, // 0.05%
    'across': 0.0004,   // 0.04%
    'hop': 0.0008       // 0.08%
  };
  const rate = feeRates[protocol.toLowerCase()] || 0.001;
  const fee = parseFloat(amount) * rate;
  return fee.toFixed(6);
}
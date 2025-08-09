import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txHash = searchParams.get('txHash');
  const protocol = searchParams.get('protocol');

  if (!txHash || !protocol) {
    return NextResponse.json(
      { error: 'Missing transaction hash or protocol' },
      { status: 400 }
    );
  }

  try {
    const status = await getBridgeStatus(txHash, protocol);
    return NextResponse.json({
      success: true,
      status,
      estimatedCompletion: status.estimatedCompletion,
      explorerLinks: status.explorerLinks
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to track bridge status' },
      { status: 500 }
    );
  }
}

async function getBridgeStatus(txHash: string, protocol: string) {
  // Mock status - thay bằng API thật của từng protocol
  return {
    status: 'PENDING',
    sourceChain: {
      confirmed: true,
      confirmations: 12,
      txHash: txHash
    },
    destinationChain: {
      confirmed: false,
      txHash: null,
      estimatedTime: '2 minutes'
    },
    estimatedCompletion: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
    explorerLinks: {
      source: `https://etherscan.io/tx/${txHash}`,
      destination: null
    }
  };
}
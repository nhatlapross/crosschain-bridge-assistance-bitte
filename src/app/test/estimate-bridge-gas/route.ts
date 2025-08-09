import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromChain = searchParams.get('fromChain');
  const toChain = searchParams.get('toChain');
  const amount = searchParams.get('amount');

  if (!fromChain || !toChain || !amount) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const gasEstimate = await estimateGasCosts(fromChain, toChain, amount);
    return NextResponse.json({
      success: true,
      gasEstimate,
      recommendations: generateGasRecommendations(gasEstimate)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to estimate gas costs' },
      { status: 500 }
    );
  }
}

async function estimateGasCosts(fromChain: string, toChain: string, amount: string) {
  // Mock gas estimation - thay bằng API thật
  const sourceGas = {
    gasPrice: '25 gwei',
    gasLimit: '200000',
    totalCost: '0.005 ETH',
    usdCost: '$12.50'
  };

  const destinationGas = {
    gasPrice: '0.001 gwei',
    gasLimit: '100000',
    totalCost: '0.0001 MATIC',
    usdCost: '$0.08'
  };

  return {
    sourceChain: {
      chain: fromChain,
      ...sourceGas
    },
    destinationChain: {
      chain: toChain,
      ...destinationGas
    },
    totalUsdCost: '$12.58',
    bridgeFee: {
      percentage: '0.05%',
      amount: `${(parseFloat(amount) * 0.0005).toFixed(6)} ETH`,
      usdCost: '$1.25'
    }
  };
}

function generateGasRecommendations(gasEstimate: any): string[] {
  const recommendations = [];
  
  if (parseFloat(gasEstimate.sourceChain.totalCost) > 0.01) {
    recommendations.push("High gas fees detected. Consider waiting for lower gas prices.");
  }
  
  recommendations.push("Bridge during off-peak hours for lower fees.");
  recommendations.push("Consider batching multiple transactions if possible.");
  
  return recommendations;
}
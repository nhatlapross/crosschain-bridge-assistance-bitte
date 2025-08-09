import { NextResponse } from 'next/server';

interface BridgeRoute {
  protocol: string;
  fee: string;
  estimatedTime: string;
  security: 'HIGH' | 'MEDIUM' | 'LOW';
  minAmount: string;
  maxAmount: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromChain = searchParams.get('fromChain');
  const toChain = searchParams.get('toChain');
  const token = searchParams.get('token');
  const amount = searchParams.get('amount');

  if (!fromChain || !toChain || !token || !amount) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // Tích hợp với các bridge protocols
    const routes = await findBestRoutes(fromChain, toChain, token, amount);
    
    return NextResponse.json({
      success: true,
      routes,
      recommendation: routes[0], // Best route
      warnings: generateWarnings(fromChain, toChain, amount)
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to find bridge routes' },
      { status: 500 }
    );
  }
}

async function findBestRoutes(
  fromChain: string,
  toChain: string,
  token: string,
  amount: string
): Promise<BridgeRoute[]> {
  // Mock data - thay bằng API thật
  const mockRoutes: BridgeRoute[] = [
    {
      protocol: "Stargate",
      fee: "0.05%",
      estimatedTime: "2-5 minutes",
      security: "HIGH",
      minAmount: "10",
      maxAmount: "1000000"
    },
    {
      protocol: "Across",
      fee: "0.04%",
      estimatedTime: "1-3 minutes",
      security: "HIGH",
      minAmount: "1",
      maxAmount: "500000"
    },
    {
      protocol: "Hop",
      fee: "0.08%",
      estimatedTime: "10-20 minutes",
      security: "MEDIUM",
      minAmount: "0.1",
      maxAmount: "100000"
    }
  ];

  // Sort by fee (lowest first)
  return mockRoutes.sort((a, b) => 
    parseFloat(a.fee) - parseFloat(b.fee)
  );
}

function generateWarnings(fromChain: string, toChain: string, amount: string): string[] {
  const warnings = [];
  
  if (parseFloat(amount) > 10000) {
    warnings.push("Large amount detected. Consider splitting into smaller transactions.");
  }
  
  if (fromChain === 'ethereum' || toChain === 'ethereum') {
    warnings.push("Ethereum gas fees are currently high. Consider bridging during off-peak hours.");
  }
  
  return warnings;
}
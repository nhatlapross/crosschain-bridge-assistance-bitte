import { ACCOUNT_ID } from "@/app/config";
import { NextResponse } from "next/server";
import {
    chainIdParam,
    addressParam,
    SignRequestResponse200,
    AddressSchema,
    MetaTransactionSchema,
    SignRequestSchema,
} from "@bitte-ai/agent-sdk";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Cross chain bridge assistance",
            description: "API for the cross chain bridge assistance",
            version: "1.0.0"
        },
        servers: [
            {
                // Enter the base and open url of your agent here, make sure it is reachable
                url: "https://crosschain-bridge-assistance-bitte.vercel.app/"
            }
        ],
        "x-mb": {
            // The account id of the user who created the agent found in .env file
            "account-id": ACCOUNT_ID,
            // The email of the user who created the agent
            email: "nhatlapross@gmail.com",
            assistant: {
                name: "Cross-Chain Bridge Assistant",
                description: "Smart bridge assistant for seamless cross-chain asset transfers with best rates and security",
                instructions: `You are a Cross-Chain Bridge Assistant that helps users:
                1. Find the best bridge routes between different blockchains
                2. Compare fees, speed, and security of different bridge protocols
                3. Execute safe cross-chain transfers
                4. Track bridge transaction status
                5. Provide educational content about bridge risks and best practices
                
                Always prioritize user safety and explain risks before any bridge operation.
                Check gas fees on both source and destination chains.
                Recommend trusted bridge protocols based on amount and route.
                
                For bridge transactions, first use find-bridge-routes to show options, then create-bridge-transaction to generate payload, and finally use generate-evm-tx or generate-transaction to execute.`,
                tools: [
                    { type: "generate-transaction" }, 
                    { type: "generate-evm-tx" }, 
                    { type: "sign-message" }
                ],
                // Thumbnail image for your agent
                image: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/bridge-icon.svg`,
                // The repo url for your agent
                repo: 'https://github.com/nhatlapross/crosschain-bridge-assistance-bitte',
                // Bridge assistant supports multiple DeFi categories
                categories: ["Bridge", "DeFi", "Infrastructure"],
                // Support major chains for bridging
                chainIds: [1, 137, 56, 42161, 10, 8453, 43114, 250]
            },
        },
        paths: {
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Returns user account ID and EVM address",
                    operationId: "get-user",
                    parameters: [
                        {
                            name: "accountId",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's account ID"
                        },
                        {
                            name: "evmAddress",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The user's EVM address"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID, if you dont have it, return an empty string"
                                            },
                                            evmAddress: {
                                                type: "string",
                                                description: "The user's EVM address, if you dont have it, return an empty string"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description: "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The text content of the tweet"
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The URL to be shared in the tweet"
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "Comma-separated hashtags for the tweet"
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string"
                            },
                            description: "The Twitter username to attribute the tweet to"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description: "The generated Twitter share intent URL"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-near-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description: "Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The NEAR account ID of the receiver"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of NEAR tokens to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description: "The receiver's NEAR account ID"
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description: "The type of action (e.g., 'Transfer')"
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description: "The amount to transfer in yoctoNEAR"
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-evm-transaction": {
                get: {
                    operationId: "createEvmTransaction",
                    summary: "Create EVM transaction",
                    description: "Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool",
                    parameters: [
                        {
                            name: "to",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The EVM address of the recipient"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The amount of ETH to transfer"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Receiver address"
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value"
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction data"
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description: "Sender address"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/coinflip": {
                get: {
                    summary: "Coin flip",
                    description: "Flip a coin and return the result (heads or tails)",
                    operationId: "coinFlip",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description: "The result of the coin flip (heads or tails)",
                                                enum: ["heads", "tails"]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/eth-sign-request": {
                get: {
                    summary: "returns ethereum signature requests",
                    description:
                        "Constructs requested signature requests (eth_sign, personal_sign, eth_signTypedData, eth_signTypedData_v4)",
                    operationId: "eth-sign",
                    parameters: [
                        { $ref: "#/components/parameters/chainId" },
                        { $ref: "#/components/parameters/evmAddress" },
                        { $ref: "#/components/parameters/method" },
                        { $ref: "#/components/parameters/message" },
                    ],
                    responses: {
                        "200": { $ref: "#/components/responses/SignRequestResponse200" },
                    },
                },
            },
            "/api/tools/find-bridge-routes": {
                get: {
                    summary: "Find optimal bridge routes",
                    description: "Find the best bridge routes between chains with fees and time estimates",
                    operationId: "find-bridge-routes",
                    parameters: [
                        {
                            name: "fromChain",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Source blockchain (e.g., ethereum, polygon)"
                        },
                        {
                            name: "toChain",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Destination blockchain"
                        },
                        {
                            name: "token",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Token symbol (e.g., ETH, USDC)"
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: { type: "string" },
                            description: "Amount to bridge"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            routes: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        protocol: { type: "string" },
                                                        estimatedTime: { type: "string" },
                                                        fee: { type: "string" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/create-bridge-transaction": {
                post: {
                    summary: "Create bridge transaction",
                    description: "Generate bridge transaction for user to sign",
                    operationId: "create-bridge-transaction",
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["protocol", "fromChain", "toChain", "token", "amount", "recipient"],
                                    properties: {
                                        protocol: { type: "string" },
                                        fromChain: { type: "string" },
                                        toChain: { type: "string" },
                                        token: { type: "string" },
                                        amount: { type: "string" },
                                        recipient: { type: "string" },
                                        slippage: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transaction: {
                                                type: "object",
                                                properties: {
                                                    to: { type: "string" },
                                                    data: { type: "string" },
                                                    value: { type: "string" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/track-bridge-status": {
                get: {
                    summary: "Track bridge transaction status",
                    description: "Check the status of a bridge transaction",
                    operationId: "track-bridge-status",
                    parameters: [
                        {
                            name: "txHash",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        },
                        {
                            name: "protocol",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            status: { type: "string" },
                                            confirmations: { type: "number" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/estimate-bridge-gas": {
                get: {
                    summary: "Estimate bridge gas costs",
                    description: "Get gas cost estimates for bridge transactions",
                    operationId: "estimate-bridge-gas",
                    parameters: [
                        {
                            name: "fromChain",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        },
                        {
                            name: "toChain",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: { type: "string" }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            gasEstimate: { type: "string" },
                                            gasCostUSD: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            parameters: {
                evmAddress: { ...addressParam, name: "evmAddress" },
                method: {
                    name: "method",
                    description: 'The signing method to be used.',
                    in: "query",
                    required: true,
                    schema: {
                        type: "string",
                        enum: [
                            'eth_sign',
                            'personal_sign',
                            'eth_signTypedData',
                            'eth_signTypedData_v4',
                        ],
                    },
                    example: "eth_sign",
                },
                chainId: { ...chainIdParam, example: 8453, required: false },
                message: {
                    name: "message",
                    in: "query",
                    required: false,
                    description: "any text message",
                    schema: { type: "string" },
                    example: "Hello Bitte",
                },
            },
            responses: {
                SignRequestResponse200,
            },
            schemas: {
                Address: AddressSchema,
                MetaTransaction: MetaTransactionSchema,
                SignRequest: SignRequestSchema,
            },
        },
    };

    return NextResponse.json(pluginData);
}

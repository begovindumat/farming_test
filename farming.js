import express from "express";
import cors from "cors";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = "0xFA6Fb896412Ce22a2DadCf3Aca91d20819ac7a6f";
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "farmerName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			}
		],
		"name": "BatchCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "buyerName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "priceWei",
				"type": "uint256"
			}
		],
		"name": "BatchSold",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "buyerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "buyerLocation",
				"type": "string"
			}
		],
		"name": "buyBatch",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "farmerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farmerLocation",
				"type": "string"
			}
		],
		"name": "createBatch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "markForSale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum FarmTrace.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "by",
				"type": "address"
			}
		],
		"name": "StatusUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "enum FarmTrace.Status",
				"name": "newStatus",
				"type": "uint8"
			}
		],
		"name": "updateStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "batches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "farmerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farmerLocation",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "buyerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "buyerLocation",
				"type": "string"
			},
			{
				"internalType": "enum FarmTrace.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "updatedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceWei",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "currentOwner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "batchesOfOwner",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getBatch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "farmerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cropName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "farmerLocation",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "buyerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "buyerLocation",
				"type": "string"
			},
			{
				"internalType": "enum FarmTrace.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "updatedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "priceWei",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "currentOwner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

// Your wallet private key (KEEP SECURE)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

app.post("/api/store", async (req, res) => {
  try {
    const { farmerName, cropName, farmerLocation } = req.body;

    const tx = await contract.createBatch(
      farmerName,
      cropName,
      farmerLocation
    );

    const receipt = await tx.wait();

    const batchId = Number(receipt.logs[0].args[0]);

    console.log("Batch ID:", batchId);
    res.json({
      success: true,
      txHash: tx.hash
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
});

app.get("/",async (req, res) => {
    res.send("API is working");
})

app.listen(3000, () => console.log("Server running on port 3000"));

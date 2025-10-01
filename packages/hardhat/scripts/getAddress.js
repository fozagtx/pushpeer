// getAddress.js
import fs from "fs";
import { Wallet } from "ethers";

const keystorePath = ".env";

async function main() {
  try {
    const envContent = fs.readFileSync(keystorePath, "utf8");
    const match = envContent.match(/DEPLOYER_PRIVATE_KEY_ENCRYPTED=(.+)/);
    if (!match) {
      throw new Error("Could not find DEPLOYER_PRIVATE_KEY_ENCRYPTED in .env file");
    }
    const json = match[1].trim();
    const password = process.env.KEYSTORE_PASSWORD || "Pima@123";

    const wallet = await Wallet.fromEncryptedJson(json, password);
    console.log("\n=================================");
    console.log("📍 Deployer Address:", wallet.address);
    console.log("🔑 Private Key:", wallet.privateKey);
    if (wallet.mnemonic) {
      console.log("🔐 Mnemonic:", wallet.mnemonic.phrase);
    }
    console.log("=================================\n");
    console.log("⚠️  Fund this address with Push Chain Donut testnet tokens!");
    console.log("💰 Visit the Push Chain faucet to get testnet tokens\n");
  } catch (err) {
    console.error("Failed to decrypt keystore:", err.message || err);
    process.exit(2);
  }
}

main();

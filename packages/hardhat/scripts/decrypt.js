// decrypt.js
import fs from "fs";
import { Wallet } from "ethers";

// Replace with the path to your keystore JSON file, or paste the JSON string directly
const keystorePath = "./DEPLOYER_PRIVATE_KEY_ENCRYPTED.json";

async function main() {
  try {
    const json = fs.readFileSync(keystorePath, "utf8").trim();

    // Do NOT hardcode a password in a file you will share.
    // Replace the string below with your password when you run the script.
    const password = process.env.KEYSTORE_PASSWORD;
    if (!password) {
      console.error("Set the password in env KEYSTORE_PASSWORD. Example:");
      console.error("  KEYSTORE_PASSWORD='your-password' node decrypt.js");
      process.exit(1);
    }

    const wallet = await Wallet.fromEncryptedJson(json, password);
    console.log("Address:", wallet.address);
    console.log("Private key:", wallet.privateKey);
    // If the keystore also contains mnemonic info, you can get it if available:
    if (wallet.mnemonic) {
      console.log("Mnemonic phrase (if available):", wallet.mnemonic.phrase);
    }
  } catch (err) {
    console.error("Failed to decrypt keystore:", err.message || err);
    process.exit(2);
  }
}

main();

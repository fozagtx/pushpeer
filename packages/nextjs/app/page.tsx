"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [mintedNFTs, setMintedNFTs] = useState<number>(0);
  const [isMinting, setIsMinting] = useState(false);

  const { data: totalNFTsMinted } = useScaffoldReadContract({
    contractName: "MyEpicNFT",
    functionName: "getTotalNFTsMinted",
  });

  const { writeContractAsync: mintNFT } = useScaffoldWriteContract({ contractName: "MyEpicNFT" });

  useEffect(() => {
    if (totalNFTsMinted !== undefined) {
      setMintedNFTs(Number(totalNFTsMinted));
    }
  }, [totalNFTsMinted]);

  const handleMintNFT = async () => {
    if (!connectedAddress) {
      notification.error("Please connect your wallet first!");
      return;
    }

    try {
      setIsMinting(true);
      await mintNFT({
        functionName: "makeAnEpicNFT",
      });
      notification.success("NFT minted successfully! 🎨");
      // Note: The totalNFTsMinted will automatically update via the useScaffoldReadContract hook
      // No need for optimistic updates - wait for blockchain confirmation
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      notification.error(error?.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 w-full max-w-4xl">
          <h1 className="text-center">
            <span className="block text-4xl mb-2">🎨</span>
            <span className="block text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Epic NFT Minter
            </span>
            <span className="block text-xl mt-2 text-gray-400">Randomly Generated On-Chain NFTs</span>
          </h1>

          <div className="flex justify-center items-center space-x-2 flex-col mt-8">
            <p className="my-2 font-medium text-lg">Connected Wallet:</p>
            <Address address={connectedAddress} />
          </div>

          {/* Minting Section */}
          <div className="mt-12 bg-base-200 rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Mint Your Epic NFT</h2>
              <p className="text-gray-400">
                Each NFT is a unique combination of random words and colors generated on-chain!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-base-300 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">Total Minted</p>
                <p className="text-3xl font-bold text-primary">{mintedNFTs} / 50</p>
              </div>
              <div className="bg-base-300 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">Remaining</p>
                <p className="text-3xl font-bold text-secondary">{50 - mintedNFTs}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-base-300 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(mintedNFTs / 50) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">{((mintedNFTs / 50) * 100).toFixed(1)}% Minted</p>
            </div>

            {/* Mint Button */}
            <div className="flex justify-center">
              <button
                onClick={handleMintNFT}
                disabled={!connectedAddress || isMinting || mintedNFTs >= 50}
                className={`btn btn-lg btn-primary text-xl px-12 ${
                  isMinting ? "loading" : ""
                } ${mintedNFTs >= 50 ? "btn-disabled" : ""}`}
              >
                {!connectedAddress
                  ? "Connect Wallet to Mint"
                  : isMinting
                    ? "Minting..."
                    : mintedNFTs >= 50
                      ? "Sold Out!"
                      : "Mint NFT 🚀"}
              </button>
            </div>

            {mintedNFTs >= 50 && (
              <div className="mt-4 text-center">
                <p className="text-error font-bold text-lg">All NFTs have been minted! 🎉</p>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-base-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🎲</div>
              <h3 className="font-bold text-lg mb-2">Random Generation</h3>
              <p className="text-sm text-gray-400">
                Each NFT has a unique combination of 3 random words and a random background color
              </p>
            </div>
            <div className="bg-base-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⛓️</div>
              <h3 className="font-bold text-lg mb-2">On-Chain Storage</h3>
              <p className="text-sm text-gray-400">
                All metadata is stored directly on the blockchain using Base64 encoding
              </p>
            </div>
            <div className="bg-base-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🖼️</div>
              <h3 className="font-bold text-lg mb-2">SVG Graphics</h3>
              <p className="text-sm text-gray-400">NFTs are rendered as scalable SVG images with beautiful gradients</p>
            </div>
          </div>

          {/* Contract Info */}
          <div className="mt-8 bg-base-300 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-3 text-center">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="ml-2 font-bold">SquareNFT</span>
              </div>
              <div>
                <span className="text-gray-400">Symbol:</span>
                <span className="ml-2 font-bold">SQUARE</span>
              </div>
              <div>
                <span className="text-gray-400">Max Supply:</span>
                <span className="ml-2 font-bold">50 NFTs</span>
              </div>
              <div>
                <span className="text-gray-400">Network:</span>
                <span className="ml-2 font-bold">Push Chain Donut</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

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
            <span className="block text-6xl mb-4">🚀</span>
            <span className="block text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              PushPeer NFTs
            </span>
            <span className="block text-2xl mt-3 text-black font-semibold">
              Mint Unique On-Chain NFTs on Push Chain
            </span>
          </h1>

          <div className="flex justify-center items-center space-x-2 flex-col mt-8">
            <p className="my-2 font-medium text-lg text-black">Connected Wallet:</p>
            <Address address={connectedAddress} />
          </div>

          {/* Minting Section */}
          <div className="mt-12 bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-8 shadow-2xl border border-primary/20">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold mb-3 text-black">Mint Your PushPeer NFT</h2>
              <p className="text-lg text-black">
                Each NFT is a unique combination of random words and colors generated on-chain! ✨
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-6 text-center border border-primary/30 shadow-lg">
                <p className="text-sm text-black font-semibold uppercase tracking-wider mb-2">Total Minted</p>
                <p className="text-4xl font-bold text-black">{mintedNFTs} / 50</p>
              </div>
              <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-2xl p-6 text-center border border-secondary/30 shadow-lg">
                <p className="text-sm text-black font-semibold uppercase tracking-wider mb-2">Remaining</p>
                <p className="text-4xl font-bold text-black">{50 - mintedNFTs}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-base-300 rounded-full h-6 shadow-inner border border-base-100">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-6 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${(mintedNFTs / 50) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-base font-semibold text-black mt-3">
                {((mintedNFTs / 50) * 100).toFixed(1)}% Minted
              </p>
            </div>

            {/* Mint Button */}
            <div className="flex justify-center">
              <button
                onClick={handleMintNFT}
                disabled={!connectedAddress || isMinting || mintedNFTs >= 50}
                className={`btn btn-lg btn-primary text-xl px-16 py-4 shadow-2xl hover:scale-105 transition-transform duration-200 ${
                  isMinting ? "loading" : ""
                } ${mintedNFTs >= 50 ? "btn-disabled" : ""}`}
              >
                {!connectedAddress
                  ? "🔗 Connect Wallet to Mint"
                  : isMinting
                    ? "⏳ Minting a Peer..."
                    : mintedNFTs >= 50
                      ? "🎉 Sold Out!"
                      : "🚀 Mint a Peer"}
              </button>
            </div>

            {mintedNFTs >= 50 && (
              <div className="mt-6 text-center bg-success/10 border border-success/30 rounded-xl p-4">
                <p className="text-success font-bold text-xl">🎉 All NFTs have been minted! 🎉</p>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-primary/10">
              <div className="text-5xl mb-4">🎲</div>
              <h3 className="font-bold text-xl mb-3 text-black">Random Generation</h3>
              <p className="text-sm text-black leading-relaxed">
                Each NFT has a unique combination of 3 random words and a random background color
              </p>
            </div>
            <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-secondary/10">
              <div className="text-5xl mb-4">⛓️</div>
              <h3 className="font-bold text-xl mb-3 text-black">On-Chain Storage</h3>
              <p className="text-sm text-black leading-relaxed">
                All metadata is stored directly on the blockchain using Base64 encoding
              </p>
            </div>
            <div className="bg-gradient-to-br from-base-200 to-base-300 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-accent/10">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="font-bold text-xl mb-3 text-black">SVG Graphics</h3>
              <p className="text-sm text-black leading-relaxed">
                NFTs are rendered as scalable SVG images with beautiful gradients
              </p>
            </div>
          </div>

          {/* Contract Info */}
          <div className="mt-8 bg-gradient-to-br from-base-300 to-base-200 rounded-3xl p-8 shadow-xl border border-primary/20">
            <h3 className="font-bold text-2xl mb-6 text-center text-black">Contract Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
              <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                <span className="text-black font-medium">Name:</span>
                <span className="font-bold text-black">SquareNFT</span>
              </div>
              <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                <span className="text-black font-medium">Symbol:</span>
                <span className="font-bold text-black">SQUARE</span>
              </div>
              <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                <span className="text-black font-medium">Max Supply:</span>
                <span className="font-bold text-black">50 NFTs</span>
              </div>
              <div className="flex items-center justify-between bg-base-200 rounded-xl p-4">
                <span className="text-black font-medium">Network:</span>
                <span className="font-bold text-black">Push Chain Donut</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

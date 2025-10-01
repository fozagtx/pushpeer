"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface NFTData {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
}

const MyNFTs: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [allNFTs, setAllNFTs] = useState<NFTData[]>([]);
  const [myNFTs, setMyNFTs] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "MyEpicNFT",
    functionName: "getTotalNFTsMinted",
  });

  const { data: nftContract } = useScaffoldContract({
    contractName: "MyEpicNFT",
  });

  useEffect(() => {
    const fetchAllNFTs = async () => {
      if (!nftContract || !totalSupply) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const fetchedNFTs: NFTData[] = [];

      try {
        const total = Number(totalSupply);

        for (let i = 0; i < total; i++) {
          try {
            const tokenURI = await nftContract.read.tokenURI([BigInt(i)]);
            const owner = await nftContract.read.ownerOf([BigInt(i)]);

            if (tokenURI && typeof tokenURI === "string" && tokenURI.startsWith("data:application/json;base64,")) {
              const base64Data = tokenURI.split(",")[1];
              const jsonString = atob(base64Data);
              const metadata = JSON.parse(jsonString);

              fetchedNFTs.push({
                tokenId: i,
                name: metadata.name || `NFT #${i}`,
                description: metadata.description || "",
                image: metadata.image || "",
                owner: owner as string,
              });
            }
          } catch (error) {
            console.error(`Error fetching NFT ${i}:`, error);
          }
        }

        setAllNFTs(fetchedNFTs);

        if (connectedAddress) {
          const owned = fetchedNFTs.filter(nft => nft.owner.toLowerCase() === connectedAddress.toLowerCase());
          setMyNFTs(owned);
        }
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        notification.error("Failed to load NFTs");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [nftContract, totalSupply, connectedAddress]);

  if (!connectedAddress) {
    return (
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 max-w-4xl w-full">
          <h1 className="text-center text-5xl font-bold mb-4">🖼️ NFT Gallery</h1>
          <div className="bg-base-200 rounded-3xl p-12 text-center">
            <p className="text-xl mb-4">Connect your wallet to view your NFT collection</p>
            <p className="text-sm text-gray-400">You can also browse all minted NFTs below</p>
          </div>

          {!loading && allNFTs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center">All Minted NFTs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allNFTs.map(nft => (
                  <NFTCard key={nft.tokenId} nft={nft} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-7xl">
        <h1 className="text-center text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
          🖼️ NFT Gallery
        </h1>

        <div className="flex justify-center items-center space-x-2 flex-col mb-8">
          <p className="my-2 font-medium">Your Wallet:</p>
          <Address address={connectedAddress} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-base-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400">Total Minted</p>
            <p className="text-3xl font-bold text-primary">{allNFTs.length}</p>
          </div>
          <div className="bg-base-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400">You Own</p>
            <p className="text-3xl font-bold text-secondary">{myNFTs.length}</p>
          </div>
          <div className="bg-base-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400">Remaining</p>
            <p className="text-3xl font-bold text-accent">{50 - allNFTs.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="ml-4 text-lg">Loading NFTs...</p>
          </div>
        ) : (
          <>
            {myNFTs.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Your Collection ({myNFTs.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {myNFTs.map(nft => (
                    <NFTCard key={nft.tokenId} nft={nft} isOwned={true} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-base-200 rounded-3xl p-12 text-center mb-12">
                <p className="text-xl mb-2">You don&apos;t own any NFTs yet 😢</p>
                <p className="text-gray-400 mb-4">Mint your first NFT to start your collection!</p>
                <Link href="/" className="btn btn-primary">
                  Go to Mint Page
                </Link>
              </div>
            )}

            {allNFTs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">All NFTs ({allNFTs.length}/50)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allNFTs.map(nft => {
                    const isOwned = nft.owner.toLowerCase() === connectedAddress?.toLowerCase();
                    return <NFTCard key={nft.tokenId} nft={nft} isOwned={isOwned} />;
                  })}
                </div>
              </div>
            )}

            {allNFTs.length === 0 && (
              <div className="bg-base-200 rounded-3xl p-12 text-center">
                <p className="text-xl">No NFTs minted yet. Be the first! 🚀</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const NFTCard = ({ nft, isOwned = false }: { nft: NFTData; isOwned?: boolean }) => {
  return (
    <div
      className={`card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 ${
        isOwned ? "ring-2 ring-primary" : ""
      }`}
    >
      <figure className="px-4 pt-4">
        {nft.image ? (
          <img src={nft.image} alt={nft.name} className="rounded-xl w-full h-64 object-contain bg-base-300" />
        ) : (
          <div className="rounded-xl w-full h-64 bg-base-300 flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">
          {nft.name}
          {isOwned && <span className="badge badge-primary badge-sm">YOURS</span>}
        </h2>
        <p className="text-sm text-gray-400">{nft.description}</p>
        <div className="text-xs text-gray-500 mt-2">
          <p>Token ID: #{nft.tokenId}</p>
          <p className="truncate">
            Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;

import { useState } from "react";
import { BytesLike, ethers } from "ethers";
import { useContractRead, useContractWrite } from "wagmi";

export const BallotContract = (params: { address: `0x${string}`; tokenAddress?: string }) => {
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  const [proposals, setProposals] = useState<string[] | []>([]);

  // would have to store this somwhere serverside and fetch once deployed
  const [ballotContractAddress, setBallotContractAddress] = useState<string | undefined>(
    "0xa0960Bc65DdfB7F2eC63CC85d58c431F1D8e7931",
  );

  const [vote, setVote] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();

  const [deployedProposals, setDeployedProposals] = useState<string[] | []>([]);

  const [winningProposal, setWinningProposal] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const { writeAsync: castVote, isSuccess: isVoteSuccess } = useContractWrite({
    address: ballotContractAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "proposal",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "vote",
    account: params.address,
  });

  const { refetch: refetchWinningProposal } = useContractRead({
    address: ballotContractAddress,
    abi: [
      {
        inputs: [],
        name: "winnerName",
        outputs: [
          {
            internalType: "bytes32",
            name: "winnerName_",
            type: "bytes32",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "winnerName",
  });

  return (
    <div className="collapse collapse-arrow bg-primary text-primary-content px-6 py-2">
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">Voting</div>
      <div className="collapse-content">
        {error && <div>Something went wrong!</div>}
        {!ballotContractAddress && (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!blockNumber || !proposals.length) return;
                setIsLoading(true);
                fetch("http://localhost:4000/deploy-ballot", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ proposals, targetBlockNumber: blockNumber }),
                })
                  .then(res => res.json())
                  .then(async data => {
                    setBallotContractAddress(data.ballotAddress);
                    setDeployedProposals(data.deployedProposals);
                    setIsLoading(false);
                  })
                  .catch(error => {
                    console.log(error);
                    setError(true);
                  });
              }}
            >
              <input
                disabled={isLoading}
                onChange={e => {
                  const proposals = e.target.value.split(",");
                  setProposals(proposals);
                }}
                name="proposals"
                type="text"
                placeholder={"Enter proposals separated by a comma, e.g. >Me,You,Her,Him<"}
                className="input input-bordered w-full my-2"
              />
              <input
                disabled={isLoading}
                onChange={e => setBlockNumber(Number(e.target.value))}
                name="blockNumber"
                type="number"
                placeholder="Target Block Number"
                className="input input-bordered w-full my-2"
              />
              <button disabled={isLoading} type="submit" className="btn btn-active btn-neutral w-full mb-4">
                Deploy Ballot Contract
              </button>
            </form>
          </div>
        )}
        {/* if deployed already, fetch proposals either from onchain or from db? custom hook */}
        {ballotContractAddress && deployedProposals.length && (
          <div>
            <div>
              <h3>Proposals</h3>
              <ol className="max-w-md space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
                {deployedProposals.map(proposal => (
                  <li>
                    <span className="font-semibold text-gray-900 dark:text-white">{proposal}</span>
                  </li>
                ))}
              </ol>
            </div>
            {!isVoteSuccess ? (
              <div>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    if (!vote || !weight) return;
                    await castVote({ args: [vote, weight] })
                      .then(async () => {
                        return (await refetchWinningProposal()).data;
                      })
                      .then(data => {
                        setWinningProposal(ethers.decodeBytes32String(data as BytesLike));
                      });
                  }}
                >
                  <input
                    onChange={e => setVote(Number(e.target.value))}
                    name="vote"
                    type="number"
                    placeholder="Proposal Number"
                    className="input input-bordered w-full my-2"
                  />
                  <input
                    onChange={e => setWeight(Number(e.target.value))}
                    name="weight"
                    type="number"
                    placeholder="Amount of Tokens"
                    className="input input-bordered w-full my-2"
                  />
                  <button type="submit" className="btn btn-active btn-neutral w-full mb-4">
                    Vote
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {winningProposal ? <div>Currently winning: {winningProposal}</div> : <div>Something went wrong</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
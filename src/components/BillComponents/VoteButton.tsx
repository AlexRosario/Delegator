import React, { useEffect, useState } from 'react';
import { Requests } from '../../api';
import { Bill, Vote } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useDisplayBills } from '../../providers/BillProvider';
import { useAuthInfo } from '../../providers/AuthProvider';

interface VoteRecord {
  userId: string;
  billId: string;
  vote: string;
  date: Date;
}

export const VoteButton = ({ bill }: { bill: Bill }) => {
  const { user } = useAuthInfo();
  const userId = user.id;
  const { voteLog, setVoteLog, setVotedOnThisBill } = useDisplayBills();
  const billNumber = bill.type + bill.number;
  const userHasBillVote = voteLog.some(
    (vote) => vote.userId === userId && vote.billId === billNumber
  );
  const recordedVoteOnBill = userHasBillVote
    ? voteLog.find(
        (vote: Vote) => vote.userId === userId && vote.billId === billNumber
      )
    : undefined;

  const userVoteDate = recordedVoteOnBill
    ? new Date(recordedVoteOnBill.date)
    : null;
  const latestActionDateOnBill = new Date(bill.latestAction.actionDate);

  const [newActionsSinceVoted, setNewActionsSinceVoted] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    if (userVoteDate) {
      setNewActionsSinceVoted(userVoteDate < latestActionDateOnBill);
    }
  }, [userVoteDate, latestActionDateOnBill]);

  const recordMembersVotes = async (bill: Bill, vote: 'Yes' | 'No') => {
    const date = new Date();

    try {
      if (Array.isArray(voteLog)) {
        if (!userHasBillVote) {
          await Requests.addVote(userId, billNumber, vote, date);
          setVoteLog([...voteLog, { userId, billId: billNumber, vote, date }]);
          setVotedOnThisBill(true);
        }
      } else {
        console.error('Unexpected data format from getVoteLog:', voteLog);
      }
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const handleVote = (vote: 'Yes' | 'No') => {
    if (!userHasBillVote) {
      recordMembersVotes(bill, vote);

      Requests.addVotedBill(bill);

      setVotedOnThisBill(false);
    }
  };

  return (
    <>
      <div className="vote-buttons">
        <button onClick={() => handleVote('Yes')}>
          <FontAwesomeIcon icon={faThumbsUp} />
        </button>
        <button onClick={() => handleVote('No')}>
          <FontAwesomeIcon icon={faThumbsDown} />
        </button>
      </div>
      <div>
        {recordedVoteOnBill
          ? newActionsSinceVoted
            ? `Voted ${recordedVoteOnBill?.vote}. New actions since your last vote. Would you like to change vote?`
            : `Voted ${recordedVoteOnBill?.vote}`
          : 'Needs Vote'}
      </div>
    </>
  );
};

export default VoteButton;

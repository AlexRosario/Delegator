import React, { useEffect, useState } from 'react';
import { Requests } from '../api';
import { Bill } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useDisplayBills } from '../Providers/BillProvider';

interface VoteRecord {
  userId: string;
  billId: string;
  vote: string;
}

export const VoteButton = ({ bill }: { bill: Bill }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const { voteLog, setVoteLog, setVotedOnThisBill } = useDisplayBills();

  const [userHasVoteRecord, setUserHasVoteRecord] = useState(false);

  useEffect(() => {
    const billNumber = bill.type + bill.number;

    setUserHasVoteRecord(
      voteLog.some((record) => record.billId === billNumber)
    );
  }, [voteLog, bill]);

  const recordMembersVotes = async (bill: Bill, vote: string) => {
    const billNumber = bill.type + bill.number;
    const userId = user.id;

    try {
      if (Array.isArray(voteLog)) {
        const notOkToPost = voteLog.some(
          (record) => record.userId === userId && record.billId === billNumber
        );

        if (!notOkToPost) {
          await Requests.addVote(user, billNumber, vote);
          setVoteLog([...voteLog, { userId, billId: billNumber, vote }]);
          setVotedOnThisBill(true);
        }
      } else {
        console.error('Unexpected data format from getVoteLog:', voteLog);
      }
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const handleVote = (vote: string) => {
    if (!userHasVoteRecord) {
      recordMembersVotes(bill, vote);

      bill.voted = true;

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
      <div>{userHasVoteRecord ? 'Voted' : 'Needs Vote'}</div>
    </>
  );
};

export default VoteButton;

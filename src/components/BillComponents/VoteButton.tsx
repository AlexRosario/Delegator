import { useEffect, useState } from 'react';
import { Requests } from '../../api';
import { Bill, Vote } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useDisplayBills } from '../../providers/BillProvider';

export const VoteButton = ({ bill }: { bill: Bill }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = String(user.id);
  const {
    voteLog,
    setVoteLog,
    setVotedOnThisBill,
    newBills,
    setNewBills,
    setVotedBills
  } = useDisplayBills();
  const billId = bill.type + bill.number;
  const userHasBillVote =
    Array.isArray(voteLog) &&
    voteLog.some((vote) => vote.userId === userId && vote.billId === billId);
  const recordedVoteOnBill = userHasBillVote
    ? voteLog.find(
        (vote: Vote) => vote.userId === userId && vote.billId === billId
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

  const recordMembersVotes = async (vote: 'Yes' | 'No') => {
    const date = new Date();

    try {
      if (Array.isArray(voteLog)) {
        if (!userHasBillVote) {
          await Requests.addVote(billId, vote, date);
          setVoteLog([...voteLog, { userId, billId: billId, vote, date }]);

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
      recordMembersVotes(vote);

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

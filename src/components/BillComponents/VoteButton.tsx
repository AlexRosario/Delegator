import { useEffect, useState } from 'react';
import { Requests } from '../../api';
import { Bill, Vote, RecordedVote } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useDisplayBills } from '../../providers/BillProvider';
import { User } from '@prisma/client';
import { useAuthInfo } from '../../providers/AuthProvider';

export const VoteButton = ({ bill }: { bill: Bill }) => {
  const { user } = useAuthInfo();
  const { id } = user;
  const { voteLog, setVoteLog, setVotedOnThisBill } = useDisplayBills();
  const billId = bill.type + bill.number;
  const userHasBillVote =
    Array.isArray(voteLog) &&
    voteLog.some((vote) => vote.userId === id && vote.billId === billId);
  const recordedVoteOnBill = userHasBillVote
    ? voteLog.find((vote: Vote) => vote.userId === id && vote.billId === billId)
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
          setVoteLog([...voteLog, { userId: id, billId: billId, vote, date }]);

          setVotedOnThisBill(true);
        }
      } else {
        console.error('Unexpected data format from getVoteLog:', voteLog);
      }
    } catch (error) {
      console.error('Error recording vote:', error);
    }
  };

  const handleVote = async (vote: 'Yes' | 'No') => {
    if (!userHasBillVote) {
      const rollCallActions = bill.actions.filter(
        (action) => action.recordedVotes?.length > 0
      );
      if (rollCallActions.length > 0) {
        console.log('Roll call found:', rollCallActions, bill);
        const houseAction =
          (await rollCallActions.find((action) =>
            /house/i.test(action.sourceSystem.name)
          )) || null;
        const senateAction =
          (await rollCallActions.find((action) =>
            /senate/i.test(action.sourceSystem.name)
          )) || null;
        if (houseAction) {
          console.log('house:', houseAction.recordedVotes[0].url);
        }
        if (senateAction) {
          console.log('senate', senateAction.recordedVotes[0].url);
        }
      } else {
        console.log('No roll call vote recorded.');
      }
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

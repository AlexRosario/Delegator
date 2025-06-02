import { useEffect, useState } from 'react';
import { Requests } from '../../api';
import { Bill, Vote } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useDisplayBills } from '../../providers/BillProvider';
import { useDisplayMember } from '../../providers/MemberProvider';
import { useAuthInfo } from '../../providers/AuthProvider';

type HouseVote = {
  id: string | null;
  name?: string | null;
  party?: string | null;
  vote?: string | null;
};

type SenateVote = {
  firstName: string;
  fullName: string;
  lastName: string;
  lisMemberId: string;
  party: string;
  state: string;
  voteCast: string;
};
type Meta = {
  party: Element | null;
  yeas: Element | null;
  nays: Element | null;
  present: Element | null;
  no_vote: Element | null;
};

export const VoteButton = ({ bill }: { bill: Bill }) => {
  const { user } = useAuthInfo();
  const { houseReps, senators } = useDisplayMember();
  const { id } = user;
  const { voteLog, congress, setVoteLog, setVotedOnThisBill } =
    useDisplayBills();
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

  const recordVotes = async (
    vote: 'Yes' | 'No',
    repVotes: { bioguideId: string; vote: string }[]
  ) => {
    const date = new Date();

    try {
      if (Array.isArray(voteLog)) {
        if (!userHasBillVote) {
          await Requests.addVote(billId, vote, date);
          setVoteLog([...voteLog, { userId: id, billId: billId, vote, date }]);
          if (repVotes.length > 0) {
            await repVotes.forEach((repVote) => {
              const { bioguideId, vote } = repVote;

              Requests.addMemberVote(
                bioguideId,
                billId,
                vote,
                latestActionDateOnBill
              );
            });
          }
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
    let allRepVotes: { bioguideId: string; vote: string }[] = [];
    if (!userHasBillVote) {
      const rollCallActions = bill.actions.filter(
        (action) => action.recordedVotes?.length > 0
      );

      if (rollCallActions.length > 0) {
        try {
          const houseAction =
            (await rollCallActions.find((action) =>
              /house/i.test(action.sourceSystem.name)
            )) || null;

          const senateAction =
            (await rollCallActions.find((action) =>
              /senate/i.test(action.sourceSystem.name)
            )) || null;

          if (houseAction) {
            const year = String(new Date()).split(' ')[3];
            const rollNum = houseAction.recordedVotes[0].rollNumber;
            const result = (await Requests.getHouseRollCall(rollNum, year)) ?? [
              [],
              []
            ];
            const [metaData, votes] = result as [Meta[], HouseVote[]];
            houseReps.forEach((rep) => {
              const match = votes.find(
                (voteSearch: HouseVote) =>
                  `${rep.lastName} (${rep.state})` === voteSearch.name ||
                  rep.lastName === voteSearch.name
              );
              /*match structure 
              id: null
              name : "Goldman (NY)"
              party: null
              vote : "No"
              */
              if (match) {
                allRepVotes.push({
                  bioguideId: rep.bioguideId,
                  vote: match.vote ?? ''
                });
              }
            });
          }

          if (senateAction) {
            const sessionNum = senateAction.recordedVotes[0].sessionNumber;
            const rollNum = senateAction.recordedVotes[0].rollNumber;
            const senateRoll = await Requests.getSenateRollCall(
              rollNum,
              congress,
              sessionNum
            );
            if (senateRoll && Array.isArray(senateRoll)) {
              const [metaData, votes] = senateRoll;
              senators.forEach((rep) => {
                if (Array.isArray(votes)) {
                  const match = votes.find(
                    (voteSearch: SenateVote) =>
                      rep.firstName === voteSearch.firstName &&
                      rep.lastName.includes(voteSearch.lastName)
                  );
                  if (match) {
                    allRepVotes.push({
                      bioguideId: rep.bioguideId,
                      vote: match.voteCast
                    });
                  }
                }
              });
            }
          }
        } catch (error) {
          console.error('Error fetching roll call data:', error);
        }
      }
      await recordVotes(vote, allRepVotes);
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

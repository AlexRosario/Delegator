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

  const recordMembersVotes = async (
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
    console.log(houseReps, senators);
    let allRepVotes: { bioguideId: string; vote: string }[] = [];
    if (!userHasBillVote) {
      const rollCallActions = bill.actions.filter(
        (action) => action.recordedVotes?.length > 0
      );

      if (rollCallActions.length > 0) {
        console.log('Roll call found:', rollCallActions, bill);
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
            console.log('house', houseAction.recordedVotes[0].url);
            const year = String(new Date()).split(' ')[3];
            const rollNum = houseAction.recordedVotes[0].rollNumber;
            const result = (await Requests.getHouseRollCall(rollNum, year)) ?? [
              [],
              []
            ];
            const [metaData, votes] = result as [Meta[], HouseVote[]];
            console.log('h', metaData, votes);
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
              console.log(
                'Matched vote for rep',
                rep.bioguideId,
                match,
                allRepVotes
              );
            });
          }

          if (senateAction) {
            console.log('senate', senateAction.recordedVotes[0].url);
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
                      `${rep.firstName} ${rep.lastName}` ===
                      `${voteSearch.firstName} ${voteSearch.lastName}`
                  );
                  if (match) {
                    allRepVotes.push({
                      bioguideId: rep.bioguideId,
                      vote: match.voteCast
                    });
                  }
                  console.log(
                    'Matched vote for rep',
                    rep.bioguideId,
                    match,
                    allRepVotes
                  );
                } else {
                  console.error('Votes data is not an array:', votes);
                }
              });
              console.log('senateRoll', senateRoll);
            } else {
              console.error('Invalid senateRoll data:', senateRoll);
            }
          }
        } catch (error) {
          console.error('Error fetching roll call data:', error);
        }
      } else {
        console.log('No roll call vote recorded.');
      }
      await recordMembersVotes(vote, allRepVotes);
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

import { CongressMember } from '../../types';

export const RepCard = ({ member }: { member: CongressMember }) => {
  const title = member.area == 'US House' ? 'Representative' : 'Senator';

  /*const totalVotes = Object.values(user.vote_log).reduce(
		(
			total: { count: number; sameKnownVotes: number; withPartyVotes: number },
			vote
		) => {
			const repVote = (vote as VoteLogEntry).RepVotes[member.name];
			const userVote = (vote as VoteLogEntry).RepVotes[user.username];

			if (repVote === 'Yes' || repVote === 'No' || repVote === 'Not Voting') {
				total.count++;
				repVote === userVote
					? (total.sameKnownVotes += 1)
					: (total.sameKnownVotes += 0);
			} else {
				total.withPartyVotes += 1;
			}
			return total;
		},
		{ count: 0, sameKnownVotes: 0, withPartyVotes: 0 }
	);

	const score =
		totalVotes.count > 0
			? ((totalVotes.sameKnownVotes / totalVotes.count) * 100).toFixed(2) + '%'
			: 'No clear votes recorded';*/

  return (
    <div className="rep-card">
      <div className="rep-card-left">
        <div className="name-title">
          <h3 className="font-face-Barlow">{member.name.toUpperCase()}</h3>
          <h5>{title}</h5>
        </div>
        {title == 'Senator' || title === 'Representative' ? (
          <div className="rep-score">
            <div>Score: </div>
          </div>
        ) : null}
      </div>

      <div className="rep-card-right">
        <img
          src={`${member?.depiction.imageUrl}`}
          alt=""
          className="rep-photo"
        />
        <div className="rep-info">
          {(member.bioguideId || member.id) && (
            <div>Bioguide-ID: {member.bioguideId || member.id} </div>
          )}
          {member.district && member.bioguideId ? (
            <span className="rep-district">
              {member.state} District {member.district}
            </span>
          ) : title === 'Senator' ? (
            <span>{member.state} Senator</span>
          ) : null}

          <div>{member.party}</div>
          <div>Phone: {member.phone}</div>
          <div>
            <span>
              <span className="rep-links">
                Link:
                <a href={`${member.url}}`} className="rep-links-link">
                  {member.url}
                </a>
                <br />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

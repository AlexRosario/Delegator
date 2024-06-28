import { useDisplayBills } from "../Providers/BillProvider";
import { HouseBill } from "../types";
import VoteButton from "./VoteButton";


export const BillCard = ({bill}: {bill:Bill}) => {

const {billsToDisplay} = useDisplayBills();
    function getBillStatusMessage(bill: Bill) {
		if (bill.vetoed !== null) return bill.vetoed;

		const passedHouse = bill.house_passage !== null;
		const passedSenate = bill.senate_passage !== null;
		const lastVote = bill.last_vote !== null;

		if (passedHouse && passedSenate) {
			return lastVote
				? 'Passed House and Senate'
				: 'Passed both chambers with floor vote. No roll call.';
		} else if (passedHouse) {
			return lastVote
				? 'Passed House, waiting on Senate'
				: 'Passed House with floor vote. No roll call.';
		} else if (passedSenate) {
			return lastVote
				? 'Passed Senate, waiting on House'
				: 'Passed Senate with floor vote. No roll call.';
		}

		// Default case if none of the above conditions are met
		return `Waiting on vote from House and Senate`;
	}
return(
    <>
    {billsToDisplay && billsToDisplay.length > 0 && (
      
            <div key={bill.bill_id} className='bill-card'>
                <div className='bill-header'>
                    <b>{bill.number}</b> - <em>{bill.title}</em>
                    <div>
                        Sponsor: {bill.sponsor_title} {bill.sponsor_name},{' '}
                        {bill.sponsor_party === 'D'
                            ? 'Democrat'
                            : bill.sponsor_party === 'R'
                            ? 'Republican'
                            : 'Independent'}
                        , {bill.sponsor_state}
                    </div>
                    <div>
                        Cosponsors: Republicans: {bill.cosponsors_by_party.R || 'none'}, Democrats: {bill.cosponsors_by_party.D || 'none'}
                    </div>
                </div>

                <div className='bill-summary'>
                    {bill.summary || (
                        <a href={bill.congressdotgov_url}>More info</a>
                    )}
                </div>
                <div className='bill-member_positions'>
                    <b>{bill.latest_major_action_date}</b>
                    <div>{bill.latest_major_action}</div>
                </div>
                <div className='bill-status'>{getBillStatusMessage(bill)}</div>
                <VoteButton bill={bill} />
            </div>
       
    )}
</>
)
;
};
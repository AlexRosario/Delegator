import {

	useEffect,
	useState,

} from 'react';
import { Requests } from '../api.tsx';
import { Bill } from '../types.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons/faThumbsDown';
import { useDisplayBills } from '../Providers/BillProvider.tsx';



export const VoteButton = ({ bill }: { bill: Bill }) => {
	const userString = localStorage.getItem('user');
	const user = userString ? JSON.parse(userString) : '';
	let relevantVotes: VoteRecord[] = [];
	const {
		newBills,
		activeIndex,
		voteLog,
		fetchVoteLog,
	} = useDisplayBills();
	const [voted, setVoted] = useState(false);
	const getRecentRollCallVotes = async (
		date: string,
		chamber: string,
		billNumber: string
	) => {
		relevantVotes = [];
		try {
			let currentDate: Date = new Date(date);
			const today = new Date().toISOString().split('T')[0];
			do {
				const createDateWindow = (date: Date) => {
					const startDate = new Date(date);
					const endDate = new Date(date); // Start with a copy of the original date
					endDate.setDate(endDate.getDate() + 30); // Then add 30 days for the end date

					// Helper function to format dates into "YYYY-MM-DD"
					const format = (d: Date) =>
						`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
							2,
							'0'
						)}-${String(d.getDate()).padStart(2, '0')}`;

					// Format the date window string
					const dateWindow = `${format(startDate)}/${format(endDate)}`;

					return { dateWindow, newStartDate: endDate };
				};
				const { dateWindow, newStartDate } = createDateWindow(currentDate);
				const rollCalls = await Requests.getVotesByDate(dateWindow, chamber);
				console.log(dateWindow);
				if (rollCalls.results.votes.length) {
					// Use .filter to find all relevant votes
					const filteredVotes = rollCalls.results.votes.filter(
						(vote: { bill?: { number: string } }) =>
							vote?.bill?.number === billNumber
					);

					relevantVotes = [...relevantVotes, ...filteredVotes];

					console.log('Filtered Roll Call Votes:', filteredVotes);
				}

				currentDate = new Date(newStartDate.toISOString().split('T')[0]);
			} while (currentDate <= new Date(today)); // Adjust the loop condition appropriately
		} catch (error) {
			console.error('Failed to fetch votes:', error);
		}

		return relevantVotes; // Return the array of relevant votes
	};
	const getLatestVoteRecordAndBillStatus = async (
		pertinentRollCalls: VoteRecord[],
		bill: Bill
	): Promise<MemberPositionRollCall> => {
		const isBillEnacted = bill.enacted !== null;
		const isBillVetoed = bill.vetoed !== null;
		const isBillActive = bill.active;
		const billOrigin = bill.bill_type.slice(0, 1) === 'h' ? 'House' : 'Senate';
		const notBillOrigin =
			bill.bill_type.slice(0, 1) === 'h' ? 'Senate' : 'House';
		if (pertinentRollCalls.length > 0) {
			console.log('Pertinent Roll Calls:', pertinentRollCalls[0]);
		}
		return {
			member_positions:
				pertinentRollCalls.length > 0 //Indicates that there is at least one roll call vote
					? await Requests.getRollCallVotes(
						pertinentRollCalls[0].congress,
						'house',
						pertinentRollCalls[0].session,
						pertinentRollCalls[0].roll_call
						// eslint-disable-next-line no-mixed-spaces-and-tabs
					)
					: bill.house_passage !== null && isBillEnacted //Indicates that the bill has passed the house and made into law without a roll call vote
						? 'Made into law. House Voted yes with a floor vote and no individual vote record is available.'
						: isBillActive &&
							(bill.senate_passage !== null || bill.house_passage !== null) &&
							(bill.house_passage === null || bill.senate_passage === null) //Indicates that bill was passed to House from Senate. House hasn't passed bill, but it remains under consideration and subject to further action, debate, and potential modification
							? `${billOrigin} passed  bill to ${notBillOrigin}, it remains under consideration and subject to further action, debate, and potential modification.`
							: isBillActive && isBillVetoed //Indicates that the bill was vetoed with message to Congress
								? 'President vetoed bill with a message to Congress.'
								: bill.house_passage !== null &&
									bill.senate_passage !== null &&
									!isBillEnacted &&
									!isBillVetoed
									? bill.latest_major_action
									: 'Way too much fuckery in Congress',
			VoteRecord:
				pertinentRollCalls.length !== 0
					? pertinentRollCalls[0]
					: bill.house_passage !== null
						? 'No Roll Calls found, but bill was passed.'
						: 'No Roll Calls yet.',
		};
	};

	const getPartyVotes = (
		pertinentVoteRecord: MemberPositionRollCall,
		chamber: string
	) => {
		return typeof pertinentVoteRecord.VoteRecord !== 'string' &&
			typeof pertinentVoteRecord.member_positions !== 'string'
			? {
				Democratic: {
					...pertinentVoteRecord?.VoteRecord?.democratic,
				},
				Republican: {
					...pertinentVoteRecord?.VoteRecord?.republican,
				},
				Independent: {
					...pertinentVoteRecord?.VoteRecord?.independent,
				},
			}
			: `${chamber} : No Votes recorded yet.`;
	};

	const recordMembersVotes = async (bill: Bill, vote: string) => {
		const introDate = bill.introduced_date;
		const billNumber = bill.number;
		const allRepVotes: { [key: string]: string } = {};

		bill.bill_type.slice(0, 1) === 'h' ? 'house' : 'senate';
		const username = user.username;

		let partyVotes = {};

		allRepVotes[username] = vote;

		const relevantRollCalls = await getRecentRollCallVotes(
			introDate,
			'both',
			billNumber.toString()
		);

		const latestVoteRecordOfHouse = await getLatestVoteRecordAndBillStatus(
			relevantRollCalls.filter((vote) => vote.chamber === 'House'),
			bill
		);

		console.log('Roll Call Info:2', latestVoteRecordOfHouse);

		const latestVoteRecordOfSenate = await getLatestVoteRecordAndBillStatus(
			relevantRollCalls.filter((vote) => vote.chamber === 'Senate'),
			bill
		);
		console.log('Roll Call Info1:', latestVoteRecordOfSenate);
		const HouseVotes = getPartyVotes(latestVoteRecordOfHouse, 'House');
		const SenateVotes = getPartyVotes(latestVoteRecordOfSenate, 'Senate');

		partyVotes = {
			HouseVotes,
			SenateVotes,
		};


		Requests.addVoteToUser(user, billNumber, partyVotes); 


	};
	const handleVote = () => {
		bill.voted = true;
		
		newBills.splice(activeIndex, 1);
		

		Requests.addVotedBill(bill);
	fetchVoteLog();
	};




	return (
		<>
			<div className='vote-buttons'>
				<button
					onClick={() => {
					recordMembersVotes(bill, 'Yes'); // Provide the missing argument
					handleVote();
					}}>
					<FontAwesomeIcon icon={faThumbsUp} />
				</button>
				<button
					onClick={() => {
						recordMembersVotes(bill, 'No'); // Provide the missing argument
						handleVote();

					}}>
					<FontAwesomeIcon icon={faThumbsDown} />
				</button>
			</div>
			<div>{!voteLog.includes(bill.number) ? 'Needs Vote' : 'Voted'}</div>
		</>
	);
};

export default VoteButton;
import toast from 'react-hot-toast';
import { Bill, User } from './types';

export const myHeaders = {
	'Content-Type': 'application/json',
};


export const proPublicaHeader = new Headers();
proPublicaHeader.append(
	'X-API-Key',
	'nymVg76FlGKy3VBdYBy96ZAYgk56fhvoYf8mUKmi'
);

proPublicaHeader.append('Content-Type', 'application/json');


export const Requests = {
	register: (
		username: string,
		email: string,
		password: string,
		address: {
			street: string;
			city: string;
			state: string;
			zipcode: string;
		}
	) => {
		const url = 'http://localhost:3000/users';

		return fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: username,
				email: email,
				password: password,
				address: {
					street: address.street,
					city: address.city,
					state: address.state,
					zipcode: address.zipcode,
				}
			}),
		})
			.then((response) => {
				console.log('Response received:', response);
				if (!response.ok) {
					throw new Error(
						`HTTP Error: ${response.status} ${response.statusText}`
					);
				}

				return response.json();
			})
			.catch((error) => {
				toast.error('Not a valid zipcode');
				error.message = 'Not a valid zipcode';
			});
	},
	checkExistingReps: async () => {
		const response = await fetch('http://localhost:3000/representatives');
		if (!response.ok) {
			throw new Error('Failed to fetch existing representatives');
		}
		return response.json();
	},


	addVoteToUser: async (
		user: { id: string; vote_log: object },
		billId: string,
		partyVotes: object
	) => {
		const response = await fetch(`http://localhost:3000/users/${user.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				vote_log: {
					...(user as { vote_log: object }).vote_log,
					[billId]: {
						PartyVotes: partyVotes,
					},
				},
			}),
		});

		if (response.ok) {
			console.log('Vote log updated successfully');
		} else {
			console.error('Failed to update vote log');
		}
	},
getVoteLogByUserId: async (userId: string) => {
    try {
        const response = await fetch(`http://localhost:3000/users/${userId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Vote log fetched successfully');
            const userData = await response.json();
            // Assuming userData returns directly the user object which has vote_log
          
                return userData.vote_log; // Return the parsed vote log
           
        } else {
            console.error(`Failed to fetch vote log, status code: ${response.status}`);
            throw new Error(`HTTP error ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error fetching vote log:', error);
        throw error; // Rethrow after logging to handle it further up the chain
    }
},


	getBillsBySubject: (subject: string, offset: number) => {
		const url = `https://api.propublica.org/congress/v1/bills/search.json?query=${subject}&&offset=${offset}`;
		return new Promise((resolve, reject) => {
			const attemptFetch = (retryCount: number, backoffDelay: number) => {
				fetch(url, {
					method: 'GET',
					headers: proPublicaHeader,
				})
					.then((response) => {
						if (!response.ok) throw new Error('Response not ok');
						console.log('Response received:', response);
						return response.text();
					})
					.then((text) => {
						try {
							console.log('Text received:');
							return JSON.parse(text); // Attempt to parse the text as JSON
						} catch (error) {
							// Throw if JSON parsing fails
							throw new Error('Failed to parse JSON');
						}
					})
					.then((data) => {
						resolve(data);
					})
					.catch((error) => {
						if (retryCount > 0) {
							console.log(`Retrying... Attempts left: ${retryCount}`);
							setTimeout(() => {
								attemptFetch(retryCount - 1, backoffDelay * 2);
							}, backoffDelay);
						} else {
							reject(error);
						}
					});
			};

			attemptFetch(3, 2000);
		});
	},
	getBillById: (billId: string) => {
		const url = `https://api.propublica.org/congress/v1/{congress}/bills/${billId}.json`;
		return fetch(url, {
			method: 'GET',
			headers: proPublicaHeader,
		}).then((response) => {
			return response.json();
		});
	},
	getVotesByDate: (date: string, chamber: string) => {
		const url = `https://api.propublica.org/congress/v1/${chamber}/votes/${date}.json`; //roll call number, session number, congress, and chamber. use house passage date plus minus 1 to 2 days
		return fetch(url, {
			method: 'GET',
			headers: proPublicaHeader,
		}).then((response) => {
			return response.json();
		});
	},
	getRollCallVotes: (
		congress: string,
		chamber: string,
		session: string,
		rollCallNumber: string
	) => {
		const url = `https://api.propublica.org/congress/v1/${congress}/${chamber}/sessions/${session}/votes/${rollCallNumber}.json`;
		return fetch(url, {
			method: 'GET',
			headers: proPublicaHeader,
		}).then((response) => {
			return response.json();
		});
	},

	getAllUsers: () => {
		const url = 'http://localhost:3000/users';
		return fetch(url, {
			method: 'GET',
			headers: myHeaders,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.catch((error) => console.error('Fetch error:', error));
	},
	addVotedBill: (bill:Bill) => {
		const url = 'http://localhost:3000/Bills';
		return fetch(url, {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(bill),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.catch((error) => console.error('Fetch error:', error));
	},
getBillsRecord: () => {
		const url = 'http://localhost:3000/Bills';
		return fetch(url, {
			method: 'GET',
			headers: myHeaders,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.catch((error) => console.error('Fetch error:', error));
	}	
}
	/*updateVoteLog: (vote) => {
		const url = 'http://localhost:3000/voteLogs';
		return fetch(url, {
			method: 'PATCH',
			headers: myHeaders,
			body: JSON.stringify({ voteLog: vote }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.catch((error) => console.error('Fetch error:', error));
	},*/


/*	getCongressMembers: (zipcode: string) => {
		const url = `/api/getall_mems.php?zip=${zipcode}&output=json`;

		return fetch(url, {
			method: 'GET',
			headers: myHeaders,
		}).then((response) => {
			return response.json();
		});
	},*/
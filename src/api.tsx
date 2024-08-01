import toast from 'react-hot-toast';
import { Bill, User } from './types';

export const myHeaders = {
  'Content-Type': 'application/json'
};

export const congressGovHeader = new Headers();
congressGovHeader.append(
  'X-API-Key',
  'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3'
);

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
          zipcode: address.zipcode
        }
      })
    })
      .then((response) => {
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

  addVote: async (
    user: { id: string; vote_log: object },
    billId: string,
    vote: string
  ) => {
    const response = await fetch(`http://localhost:3000/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        billId: billId,
        vote: vote
      })
    });
  },
  getVoteLog: async (user: User) => {
    try {
      const response = await fetch(`http://localhost:3000/votes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        // Assuming userData returns directly the user object which has vote_log

        const filteredData = userData.filter(
          (voteRecord) => voteRecord.userId === user
        );
        console.log('f:', filteredData);
        return filteredData; // Return the parsed vote log
      } else {
        console.error(
          `Failed to fetch vote log, status code: ${response.status}`
        );
        throw new Error(
          `HTTP error ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error fetching vote log:', error);
      throw error; // Rethrow after logging to handle it further up the chain
    }
  },
  getBills: async (congress: string, billType: string, offset: number) => {
    const url = `/congressGov/v3/bill${congress ? `/${congress}` : ''}${billType ? `/${billType}` : ''}${offset !== 0 ? `?offset=${offset}` : ''}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3' // Ensure correct API key is sent
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
  getFullBill: async (
    congress: string,
    billType: string,
    billNumber: string
  ) => {
    const url = `/congressGov/v3/bill/${congress}/${billType}/${billNumber}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },
  getBillSummary: async (
    congress: string,
    billType: string,
    billNumber: string,
    billDetail: string
  ) => {
    const url = `/congressGov/v3/bill/${congress}/${billType}/${billNumber}/${billDetail}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3' // Ensure correct API key is sent
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  getAllUsers: () => {
    const url = 'http://localhost:3000/users';
    return fetch(url, {
      method: 'GET',
      headers: myHeaders
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .catch((error) => console.error('Fetch error:', error));
  },

  addVotedBill: (bill: Bill) => {
    const url = 'http://localhost:3000/Bills';
    return fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(bill)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => console.error('Fetch error:', error));
  },
  postAllBills: (bills: Bill[], subject: string) => {
    const url = 'http://localhost:3000/Bills';
    const payload = {
      [subject]: [...[subject], ...bills]
    };

    return fetch(url, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(payload)
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
      headers: myHeaders
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => console.error('Fetch error:', error));
  }
};
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

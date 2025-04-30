import toast from 'react-hot-toast';
import { Bill, User, Vote, CongressMember } from './types';
import DOMPurify from 'dompurify';

export const googleCivicHeader = new Headers();
googleCivicHeader.append('Content-Type', 'application/json');
googleCivicHeader.append('key', import.meta.env.VITE_GOOGLE_API_KEY);
export const myHeaders = {
  'Content-Type': 'application/json'
};

export const congressGovHeader = new Headers({
  ...myHeaders,
  'X-API-Key': import.meta.env.VITE_API_KEY
});

const fiveCallsHeader = new Headers({
  ...myHeaders,
  'X-5Calls-Token': import.meta.env.VITE_FIVECALLS_API_KEY
});

const jwt = localStorage.getItem('token');
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
    const url = 'http://localhost:3000/auth/register';

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
      .then(async (response) => {
        if (!response.ok) {
          const errorBody = await response.json();
          console.log('err', errorBody, response.status);
          throw new Error(
            errorBody.message || `HTTP Error: ${response.status}`
          );
        }

        return response.json();
      })
      .catch((error) => {
        toast.error(error.message);
        return error.message;
      });
  },
  async loginUser(credentials: { username: string; password: string }) {
    console.log('api call', credentials);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('dang');
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
  addVote: async (billId: string, vote: string, date: Date) => {
    console.log('Sending vote:', {
      billId,
      vote,
      date: date.toISOString()
    });

    try {
      await fetch(`http://localhost:3000/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt?.replace(/^"|"$/g, '')}`
        },
        body: JSON.stringify({
          billId: billId,
          vote: vote,
          date: date.toISOString()
        })
      });
      console.log('Vote posted successfully');
    } catch (error) {
      console.error('Error posting vote:', error);
    }
  },
  getVoteLog: async (token: string) => {
    try {
      console.log('JWT being sent:', token);
      const response = await fetch(`http://localhost:3000/votes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token?.replace(/^"|"$/g, '')}`
        }
      });
      console.log('response:', response);
      if (response.ok) {
        return await response.json();
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
      throw error;
    }
  },
  addVotedBill: async (bill: Bill) => {
    const url = 'http://localhost:3000/bills';

    try {
      const addBillResponse = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(bill)
      });

      if (!addBillResponse.ok) {
        throw new Error(`HTTP error! status: ${addBillResponse.status}`);
      }

      return await addBillResponse.json();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  },
  getBillsRecord: () => {
    const url = 'http://localhost:3000/bills';
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
  //External api calls
  getBills: async (congress: string, billType: string, offset: number) => {
    const url = `/congressGov/v3/bill${congress ? `/${congress}` : ''}${billType ? `/${billType}` : ''}${offset !== 0 ? `?offset=${offset}` : ''}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: congressGovHeader
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
    billNumber: string,
    signal?: AbortSignal
  ) => {
    const url = `/congressGov/v3/bill/${congress}/${billType}/${billNumber}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: congressGovHeader,
        signal
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
  getBillDetail: async (
    congress: string,
    billType: string,
    billNumber: string,
    billDetail: string,
    signal?: AbortSignal
  ) => {
    const url = `/congressGov/v3/bill/${congress}/${billType}/${billNumber}/${billDetail}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: congressGovHeader,
        signal
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
  checkExistingReps: async (userId: String) => {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/representatives`
    );
    if (!response.ok) {
      return [];
    }
    return response.json();
  },
  postNewReps: async (rep: CongressMember, userId: string) => {
    const response = await fetch(
      `http://localhost:3000/users/${userId}/representatives`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rep)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to post new representative');
    }

    return response.json();
  },
  getCongressMembersFromFive: async (address: string) => {
    console.log('address:', address);
    const response = await fetch(
      `/fiveCalls/representatives?location=${address}`,
      {
        method: 'GET'
      }
    );

    return response.json();
  },
  getCongressMember: async (bioID: string) => {
    const url = `/congressGov/v3/member/${bioID}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: congressGovHeader
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  getCongressMembersDB: (reps: string[]) => {
    const url = `http://localhost:3000/representatives`; // Assuming user has an 'id' property
    return fetch(url, {
      method: 'GET',
      headers: myHeaders
    })
      .then((response) => {
        return response.json();
      })
      .then((members) => {
        return members.filter((memberName: string) =>
          reps.includes(memberName)
        );
      })
      .catch((error) => console.error('Fetch error:', error));
  }
};
export const searchForBill = async (
  billType: string,
  billNumber: string,
  signal?: AbortSignal
) => {
  try {
    const fullBillDataPromise = Requests.getFullBill(
      '118',
      billType,
      billNumber,
      signal
    );
    const summariesDataPromise = Requests.getBillDetail(
      '118',
      billType,
      billNumber,
      'summaries',
      signal
    );
    const subjectsDataPromise = Requests.getBillDetail(
      '118',
      billType,
      billNumber,
      'subjects',
      signal
    );

    const [fullBillData, summariesData, subjectsData] = await Promise.all([
      fullBillDataPromise,
      summariesDataPromise,
      subjectsDataPromise
    ]);

    return {
      ...fullBillData.bill,
      summary:
        summariesData.summaries.length > 0
          ? DOMPurify.sanitize(
              summariesData.summaries[summariesData.summaries.length - 1].text
            )
          : 'No Summary Available',
      subjects: subjectsData.subjects
    };
  } catch (error) {
    console.error('Failed to fetch bills:', error);
    return null;
  }
};

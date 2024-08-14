import toast from 'react-hot-toast';
import { Bill, User, Vote } from './types';

export const myHeaders = {
  'Content-Type': 'application/json'
};

export const congressGovHeader = new Headers();
congressGovHeader.append(
  'X-API-Key',
  'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3'
);

export const Requests = {
  //Local
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
  addVote: async (userId: string, billId: string, vote: string, date: Date) => {
    const response = await fetch(`http://localhost:3000/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        billId: billId,
        vote: vote,
        date: date
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

        const filteredData = userData.filter(
          (voteRecord: Vote) => voteRecord.userId === user.id
        );
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
      throw error;
    }
  },
  addVotedBill: async (bill: Bill) => {
    const url = 'http://localhost:3000/Bills';
    try {
      const existingBillsResponse = await fetch(url, {
        method: 'GET',
        headers: myHeaders
      });

      if (!existingBillsResponse.ok) {
        throw new Error(`HTTP error! status: ${existingBillsResponse.status}`);
      }

      const existingBills = await existingBillsResponse.json();

      const billExists = existingBills.some(
        (existingBill: Bill) => existingBill.number === bill.number
      );

      if (billExists) {
        return;
      }

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
  },
  //External api calls
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
    billNumber: string,
    signal?: AbortSignal
  ) => {
    const url = `/congressGov/v3/bill/${congress}/${billType}/${billNumber}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'wbWdJxHyM4R2Vo9dCkI5jqdApMidOokgNWmHb8e3' // Ensure correct API key is sent
        },
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
  }
};

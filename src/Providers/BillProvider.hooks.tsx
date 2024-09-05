import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Requests } from '../api';
import { Bill, User, Vote } from '../types';
import DOMPurify from 'dompurify';

export const useBillFetching = (
  congress: string,
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>,
  allBills: Bill[],
  setAllBills: React.Dispatch<React.SetStateAction<Bill[]>>
): (() => Promise<Bill[]>) => {
  const fetchBills = useCallback(async (): Promise<Bill[]> => {
    let fetchedBills: Bill[] = [];
    try {
      const data = await Requests.getBills(congress, '', offset);
      fetchedBills = [...fetchedBills, ...(data ? data.bills : [])];

      const billPromises = fetchedBills.map(async (bill: Bill) => {
        const fullBillData = await Requests.getFullBill(
          congress,
          bill.type.toLowerCase(),
          bill.number
        );
        const summariesData = await Requests.getBillDetail(
          congress,
          bill.type.toLowerCase(),
          bill.number,
          'summaries'
        );
        const subjectsData = await Requests.getBillDetail(
          congress,
          bill.type.toLowerCase(),
          bill.number,
          'subjects'
        );

        return {
          ...bill,
          ...fullBillData.bill,
          summary:
            summariesData.summaries.length > 0
              ? DOMPurify.sanitize(
                  summariesData.summaries[summariesData.summaries.length - 1]
                    .text
                )
              : 'No Summary Available',
          subjects: subjectsData.subjects
        };
      });

      fetchedBills = await Promise.all(billPromises);

      // Update the shared state for all bills
      setAllBills((prevBills) => [...prevBills, ...fetchedBills]);

      // Update the offset after fetching
      setOffset((prevOffset) => prevOffset + 20);
      return fetchedBills;
    } catch (error) {
      console.error('Failed to fetch bills:', error);
      return [];
    }
  }, [congress, offset, setOffset, setAllBills]);

  return fetchBills;
};

export const useBillData = (
  user: User,
  congress: string,
  offset: number,
  setOffset: React.Dispatch<React.SetStateAction<number>>
) => {
  const [voteLog, setVoteLog] = useState<Vote[]>([]);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [newBills, setNewBills] = useState<Bill[]>([]);
  const [votedBills, setVotedBills] = useState<Bill[]>([]);
  const [activeBillTab, setActiveBillTab] = useState<
    'discover-bills' | 'voted-bills'
  >('discover-bills');

  // Memoize the calculated bills to display
  const billsToDisplay = useMemo<Bill[]>(
    () => (activeBillTab === 'discover-bills' ? newBills : votedBills),
    [activeBillTab, newBills, votedBills]
  );

  const fetchVoteLog = useCallback(async (): Promise<Vote[]> => {
    try {
      const data: Vote[] = await Requests.getVoteLog(user);
      setVoteLog(data);
      return data;
    } catch (error) {
      console.error('Error fetching vote log:', error);
      return [];
    }
  }, [user]);

  const fetchUserBills = useCallback(
    async (VoteLog: Vote[]): Promise<Bill[]> => {
      try {
        const Bills: Bill[] = await Requests.getBillsRecord();
        const userBills = Bills.filter((bill: Bill) =>
          VoteLog.some(
            (vote) =>
              vote.billId === bill.type + bill.number && vote.userId === user.id
          )
        );
        return userBills;
      } catch (error) {
        console.error('Error fetching bill record:', error);
        return [];
      }
    },
    [user]
  );

  const fetchBills = useBillFetching(
    congress,
    offset,
    setOffset,
    allBills,
    setAllBills
  );

  useEffect(() => {
    fetchVoteLog().then((voteLog) => {
      setNewBills(
        allBills.filter(
          (bill) =>
            !voteLog.some((vote) => vote.billId === bill.type + bill.number)
        )
      );

      fetchUserBills(voteLog).then((userBills) => {
        if (userBills) setVotedBills(userBills);
      });

      setVoteLog(voteLog);
    });
  }, [activeBillTab, allBills, fetchUserBills, fetchVoteLog]);

  return {
    billsToDisplay,
    voteLog,
    setVoteLog,
    allBills,
    setAllBills,
    newBills,
    votedBills,
    fetchBills
  };
};

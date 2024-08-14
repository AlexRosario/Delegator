import React, {
  useContext,
  ReactNode,
  createContext,
  useState,
  useEffect,
  useRef,
  MutableRefObject
} from 'react';
import { Requests } from '../api';
import { Bill, Vote } from '../types';
import { useAuthInfo } from './AuthProvider';
import DOMPurify from 'dompurify';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';

type TBillProvider = {
  billsToDisplay: Bill[];
  billSubject: string;
  setBillSubject: (subject: string) => void;
  offset: number;
  setOffset: (offset: number | ((prevOffset: number) => number)) => void;
  congress: string;
  filterPassedBills: boolean;
  setFilterPassedBills: (filterPassed: boolean) => void;
  setActiveBillTab: (tab: string) => void;
  activeBillTab: string;
  allBills: Bill[];
  setAllBills: (allBills: Bill[]) => void;
  newBills: Bill[];
  votedBills: Bill[];
  voteLog: Vote[];
  setVoteLog: (voteLog: Vote[]) => void;
  setVotedOnThisBill: (votedOnThisBill: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

export const BillContext = createContext<TBillProvider>({
  billsToDisplay: [],
  billSubject: '',
  setBillSubject: () => {},
  offset: 0,
  setOffset: () => {},
  congress: '118',
  filterPassedBills: false,
  setFilterPassedBills: () => {},
  setActiveBillTab: () => {},
  activeBillTab: '',
  allBills: [],
  setAllBills: () => {},
  newBills: [],
  votedBills: [],
  voteLog: [],
  setVoteLog: () => {},
  setVotedOnThisBill: () => {},
  currentIndex: 0,
  setCurrentIndex: () => {}
});

export const BillProvider = ({ children }: { children: ReactNode }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : '';
  const [voteLog, setVoteLog] = useState<Vote[]>([]);
  const [votedOnThisBill, setVotedOnThisBill] = useState(false);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [newBills, setNewBills] = useState<Bill[]>([]);
  const [votedBills, setVotedBills] = useState<Bill[]>([]);
  const [activeBillTab, setActiveBillTab] = useState<string>('discover-bills');
  const [billSubject, setBillSubject] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [filterPassedBills, setFilterPassedBills] = useState(false);
  const [congress, setCongress] = useState('118');
  const [billType, setBillType] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndexRef = useRef(currentIndex);
  const billsToDisplay =
    activeBillTab === 'all'
      ? allBills
      : activeBillTab === 'discover-bills'
        ? newBills
        : activeBillTab === 'voted-bills'
          ? votedBills
          : [];

  let uniqueBillsMap = new Map<string, Bill>(
    allBills.map((bill) => [bill.number, bill])
  );

  const fetchVoteLog = async () => {
    try {
      const data = await Requests.getVoteLog(user);
      setVoteLog(data);
      return data;
    } catch (error) {
      console.error('Error fetching vote log:', error);
    }
  };

  const fetchUserBills = async (VoteLog: Vote[]) => {
    try {
      const Bills = await Requests.getBillsRecord();
      const userBills = Bills.filter((bill: Bill) =>
        VoteLog.some((vote) => {
          return (
            vote.billId === bill.type + bill.number && vote.userId === user.id
          );
        })
      );
      return userBills;
    } catch (error) {
      console.error('Error fetching bill record:', error);
    }
  };

  const fetchBills = async () => {
    let fetchedBills: Bill[] = [];

    try {
      const data = await Requests.getBills(congress, billType, offset);

      fetchedBills = [...fetchedBills, ...(data ? data.bills : [])];

      const billPromises = await fetchedBills.map(async (bill) => {
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

      return fetchedBills;
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setOffset(offset + 20);
    }
  };

  useEffect(() => {
    if (
      (currentIndex === billsToDisplay.length - 9 &&
        prevIndexRef.current !== currentIndex) ||
      allBills.length === 0
    ) {
      fetchBills()
        .then((bills) => {
          setAllBills((prevBills: Bill[]) => [
            ...prevBills,
            ...(bills as Bill[])
          ]);
        })

        .catch((error) => console.error('Failed to fetch bills dawg:', error));
    }
  }, [user, currentIndex]);

  useEffect(() => {
    fetchVoteLog()
      .then((VoteLog) => {
        setNewBills(
          allBills.filter(
            (bill: Bill) =>
              !VoteLog.some(
                (vote: Vote) => vote.billId === bill.type + bill.number
              )
          )
        );

        fetchUserBills(VoteLog).then((bills) => {
          setVotedBills(bills);
        });
        setVoteLog(VoteLog);
      })
      .finally(() => (prevIndexRef.current = currentIndex));
  }, [activeBillTab, allBills, votedOnThisBill]);

  return (
    <BillContext.Provider
      value={{
        billsToDisplay,
        billSubject,
        setBillSubject,
        offset,
        setOffset,
        congress,
        filterPassedBills,
        setFilterPassedBills,
        setActiveBillTab,
        activeBillTab,
        allBills,
        setAllBills,
        newBills,
        votedBills,
        voteLog,
        setVoteLog,
        setVotedOnThisBill,
        setCurrentIndex,
        currentIndex
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useDisplayBills = () => {
  return useContext(BillContext);
};

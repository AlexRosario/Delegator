import {
  useContext,
  ReactNode,
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';
import { Requests } from '../api';
import { Bill, Vote } from '../types';
import DOMPurify from 'dompurify';
import { useAuthInfo } from './AuthProvider';

type TBillProvider = {
  billsToDisplay: Bill[];
  billSubject: string;
  setBillSubject: (subject: string) => void;
  offset: number;
  setOffset: (offset: number | ((prevOffset: number) => number)) => void;
  congress: string;
  filterPassedBills: boolean;
  setFilterPassedBills: (filterPassed: boolean) => void;
  setActiveBillTab: (tab: 'discover-bills' | 'voted-bills') => void;
  activeBillTab: 'discover-bills' | 'voted-bills';
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
  activeBillTab: 'discover-bills',
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
  const { user } = useAuthInfo();
  const [voteLog, setVoteLog] = useState<Vote[]>([]);
  const [votedOnThisBill, setVotedOnThisBill] = useState(false);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [newBills, setNewBills] = useState<Bill[]>([]);
  const [votedBills, setVotedBills] = useState<Bill[]>([]);
  const [activeBillTab, setActiveBillTab] = useState<
    'discover-bills' | 'voted-bills'
  >('discover-bills');
  const [billSubject, setBillSubject] = useState<string>('');
  const [offset, setOffset] = useState(0);
  const [filterPassedBills, setFilterPassedBills] = useState(false);
  const [congress] = useState('118');
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevIndexRef = useRef(currentIndex);
  const hasFetchedRef = useRef(false); // Tracks if fetchBills has been called

  const billsToDisplay =
    activeBillTab === 'discover-bills' ? newBills : votedBills;

  const fetchVoteLog = useCallback(async () => {
    try {
      const data = await Requests.getVoteLog(user);

      setVoteLog(data);
      return data;
    } catch (error) {
      console.error('Error fetching vote log:', error);
    }
  }, [user]);

  const fetchUserBills = useCallback(
    async (VoteLog: Vote[]) => {
      try {
        const Bills = await Requests.getBillsRecord();
        const userBills = Bills.filter((bill: Bill) =>
          VoteLog.some(
            (vote) =>
              vote.billId === bill.type + bill.number && vote.userId === user.id
          )
        );
        return userBills;
      } catch (error) {
        console.error('Error fetching bill record:', error);
      }
    },
    [user]
  );

  const fetchBills = useCallback(async () => {
    let fetchedBills: Bill[] = [];
    try {
      const data = await Requests.getBills(congress, '', offset);
      fetchedBills = [...fetchedBills, ...(data?.bills ?? [])];

      const billPromises = fetchedBills.map(async (bill) => {
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
      setOffset((prevOffset) => prevOffset + 20);
    }
  }, [congress, offset]);

  useEffect(() => {
    const isScrollingForward = currentIndex >= prevIndexRef.current;
    const isNearEnd = billsToDisplay.length - currentIndex <= 20;

    if (isScrollingForward && isNearEnd && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setTimeout(() => {
        fetchBills()
          .then((bills) => {
            if (bills && bills.length > 0) {
              setAllBills((prevBills) => [...prevBills, ...bills]);
            }
            hasFetchedRef.current = false;
          })
          .catch((error) => {
            console.error('Failed to fetch bills:', error);
            hasFetchedRef.current = false;
          });
      }, 500);
    }

    prevIndexRef.current = currentIndex;
  }, [currentIndex]);
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
          if (bills) setVotedBills(bills);
        });
        setVoteLog(VoteLog);
      })
      .finally(() => {
        prevIndexRef.current = currentIndex;
        console.log('billsToDisplay', billsToDisplay);
      });
  }, [activeBillTab, allBills, fetchUserBills, fetchVoteLog, votedOnThisBill]);

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

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
import { Bill } from '../types';
import { useAuthInfo } from './AuthProvider';
import DOMPurify from 'dompurify';
import { s } from 'vite/dist/node/types.d-aGj9QkWt';

interface VoteRecord {
  userId: string;
  billId: string;
  vote: string;
}

type TBillProvider = {
  billsToDisplay: Bill[];
  billSubject: string;
  setBillSubject: (subject: string) => void;
  setIsButtonClicked: (isClicked: boolean) => void;
  offset: number;
  setOffset: (offset: number | ((prevOffset: number) => number)) => void;
  chamber: string;
  setChamber: (chamber: string) => void;
  congress: string;
  prevChamberRef: React.MutableRefObject<string>;
  prevSubjectRef: React.MutableRefObject<string>;
  filterPassedBills: boolean;
  setFilterPassedBills: (filterPassed: boolean) => void;
  setActiveBillTab: (tab: string) => void;
  activeBillTab: string;
  activeIndex: number;
  setActiveIndex: (index: number | ((prevIndex: number) => number)) => void;
  allBills: Bill[];
  setAllBills: (allBills: Bill[]) => void;
  newBills: Bill[];
  votedBills: Bill[];
  voteLog: VoteRecord[];
  setVoteLog: (voteLog: VoteRecord[]) => void;
  setVotedOnThisBill: (votedOnThisBill: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

export const BillContext = createContext<TBillProvider>({
  billsToDisplay: [],
  billSubject: '',
  setBillSubject: () => {},
  setIsButtonClicked: () => {},
  offset: 0,
  setOffset: () => {},
  chamber: 'house',
  setChamber: () => {},
  congress: '118',
  prevChamberRef: { current: 'house' } as React.MutableRefObject<string>,
  prevSubjectRef: { current: '' } as React.MutableRefObject<string>,
  filterPassedBills: false,
  setFilterPassedBills: () => {},
  setActiveBillTab: () => {},
  activeBillTab: '',
  activeIndex: 0,
  setActiveIndex: () => {},
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
  const [voteLog, setVoteLog] = useState<VoteRecord[]>([]);
  const [votedOnThisBill, setVotedOnThisBill] = useState(false);
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const [newBills, setNewBills] = useState<Bill[]>([]);
  const [votedBills, setVotedBills] = useState<Bill[]>([]);
  const [activeBillTab, setActiveBillTab] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [billSubject, setBillSubject] = useState<string>('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [offset, setOffset] = useState(0);
  const [chamber, setChamber] = useState<string>('house');
  const prevSubjectRef = useRef(billSubject);
  const prevChamberRef = useRef(chamber);
  const [filterPassedBills, setFilterPassedBills] = useState(false);
  const [congress, setCongress] = useState('118');
  const [billType, setBillType] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [billDetail, setBillDetail] = useState('');
  const args = [congress, billType, billNumber, billDetail] as const;
  const [currentIndex, setCurrentIndex] = useState(0);
  const billsToDisplay =
    activeBillTab === 'all'
      ? allBills
      : activeBillTab === 'new'
        ? newBills
        : activeBillTab === 'voted'
          ? votedBills
          : [];

  let uniqueBillsMap = new Map<string, Bill>(
    allBills.map((bill) => [bill.number, bill])
  );

  const fetchBills = async () => {
    let fetchedBills: Bill[] = [];
    // Reset bills and offset only if billSubject has changed

    try {
      const data = await Requests.getBills(congress, billType, offset);

      fetchedBills = [
        ...fetchedBills,
        ...((data ? data?.bills : []) as Bill[])
      ];

      fetchedBills.forEach((bill) => {
        Requests.getBillSummary(
          '118',
          bill.type.toLowerCase(),
          bill.number,
          'summaries'
        ).then((data) => {
          data.summaries.length > 0
            ? (bill.summary = DOMPurify.sanitize(
                data.summaries[data.summaries.length - 1].text
              ))
            : (bill.summary = 'No Summary Available');
        });

        console.log('Bill:', bill);
      });

      return filterNewBills(fetchedBills);
    } catch (error) {
      console.error('Failed to fetch bills:', error);
    } finally {
      setOffset(offset + 20);

      prevSubjectRef.current = billSubject;
      prevChamberRef.current = chamber;
    }
  };

  const filterNewBills = async (fetchedBills: Bill[]) => {
    try {
      fetchedBills.forEach((bill) => {
        uniqueBillsMap.set(bill.number, bill);
      });
    } catch (error) {
      console.error('Failed to filter new bills:', error);
    }
    // Update the state with the new unique bills map
    console.log('Unique Bills Map:', uniqueBillsMap);

    return Array.from(uniqueBillsMap.values());
  };

  const fetchVoteLog = async () => {
    try {
      const data = await Requests.getVoteLog(user.id);
      setVoteLog(data);
      return data;
    } catch (error) {
      console.error('Error fetching vote log:', error);
    }
  };

  useEffect(() => {
    if (currentIndex === allBills.length - 9 || allBills.length === 0) {
      // Fetch new bills if the current index is the last index and when there are no bills

      fetchBills()
        .then((fetchedBills) => {
          fetchedBills?.forEach((bill) => {
            Requests.getFullBill(
              '118',
              bill.type.toLowerCase(),
              bill.number
            ).then((data) => {
              bill = { ...bill, ...data.bill };
              console.log('Bill:', bill);
            });
          });
          return filterNewBills(fetchedBills as Bill[]);
        })
        .then((bills) => {
          setAllBills(bills);
        })

        .catch((error) => console.error('Failed to fetch bills dawg:', error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentIndex]);

  useEffect(() => {
    if (votedOnThisBill || billsToDisplay.length === 0)
      fetchVoteLog().then((VoteLog) => {
        console.log('vot', VoteLog);
        setNewBills(
          allBills.filter(
            (bill: Bill) =>
              !VoteLog.some((vote) => vote.billId === bill.type + bill.number)
          )
        );

        setVotedBills(
          allBills.filter((bill: Bill) =>
            VoteLog.some((vote) => vote.billId === bill.type + bill.number)
          )
        );
      });
  }, [activeBillTab, allBills, votedOnThisBill]);

  return (
    <BillContext.Provider
      value={{
        billsToDisplay,
        billSubject,
        setBillSubject,
        setIsButtonClicked,
        offset,
        setOffset,
        chamber,
        setChamber,
        congress,
        prevChamberRef,
        prevSubjectRef,
        filterPassedBills,
        setFilterPassedBills,
        setActiveBillTab,
        activeBillTab,
        activeIndex,
        setActiveIndex,
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

import {
    useContext,
    ReactNode,
    createContext,
    useState,
    useEffect,
    useRef,
} from 'react';
import { Requests } from '../api.tsx';
import { Bill } from '../types.ts';
import { useAuthInfo } from './AuthProvider.tsx';

type TBillProvider = {
    billsToDisplay: Bill[];
    billSubject: string;
    setBillSubject: (subject: string) => void;
    isButtonClicked: boolean;
    setIsButtonClicked: (isClicked: boolean) => void;
    subjectOffset: number;
    setSubjectOffset: (offset: number | ((prevOffset: number) => number)) => void;
    chamber: string;
    setChamber: (chamber: string) => void;
    prevChamberRef: React.MutableRefObject<string>;
    prevSubjectRef: React.MutableRefObject<string>;
    filterPassedBills: boolean;
    setFilterPassedBills: (filterPassed: boolean) => void;
    setActiveBillTab: (tab: string) => void;
    activeBillTab: string;
    activeIndex: number;
    setActiveIndex: (index: number | ((prevIndex: number) => number)) => void;
    newBills: Bill[];
    votedBills: Bill[];
    voteLog: string[];
    fetchVoteLog: () => void;
    
};

export const BillContext = createContext<TBillProvider>({
    billsToDisplay: [],
    billSubject: '',
    setBillSubject: () => { },
    isButtonClicked: false,
    setIsButtonClicked: () => { },
    subjectOffset: 0,
    setSubjectOffset: () => { },
    chamber: 'house',
    setChamber: () => { },
    prevChamberRef: { current: 'house' } as React.MutableRefObject<string>,
    prevSubjectRef: { current: '' } as React.MutableRefObject<string>,
    filterPassedBills: false,
    setFilterPassedBills: () => { },
    setActiveBillTab: () => { },
    activeBillTab: '',
    activeIndex: 0,
    setActiveIndex: () => { },
    newBills: [],
    votedBills: [],
    voteLog: [],
    fetchVoteLog: () => { },
});

export const BillProvider = ({ children }: { children: ReactNode }) => {
    const user  = useAuthInfo();
    const voteLog = useRef<string[]>([]);
    const [allBills, setAllBills] = useState<Bill[]>([]);
    const [activeBillTab, setActiveBillTab] = useState<string>('all');
    const [activeIndex, setActiveIndex] = useState(0);

    const [billSubject, setBillSubject] = useState<string>('');
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [subjectOffset, setSubjectOffset] = useState(0);
    const [chamber, setChamber] = useState<string>('house');
    const prevSubjectRef = useRef(billSubject);
    const prevChamberRef = useRef(chamber);
    const [filterPassedBills, setFilterPassedBills] = useState(false);

const votedBills: Bill[] =allBills.filter((bill: Bill) =>
      voteLog.current.find((votekey) => votekey === bill.number)
    );
  const newBills: Bill[] = allBills.filter((bill) => !votedBills.some((votedBill) => votedBill.number === bill.number));

    const billsToDisplay =
        activeBillTab === 'all'
            ? allBills
            : activeBillTab === 'new'
                ? newBills
                : activeBillTab=== 'voted' ? votedBills
                : [];

    let uniqueBillsMap = new Map<string, Bill>(allBills.map((bill) => [bill.number, bill]));

    // Extracting bill numbers from user vote log

    const fetchBillsBySubject = async () => {
        // Reset bills and subjectOffset only if billSubject has changed
        if (prevSubjectRef.current !== billSubject) {
            setAllBills([]);
            setSubjectOffset(0);
            uniqueBillsMap = new Map();
        }

        try {

            const data = await Requests.getBillsBySubject(billSubject, subjectOffset);
            const fetchedBills = (
                data
                    ? (data as { results: { bills: Bill[] }[] }).results[0]?.bills
                    : []
            ) as Bill[];


            return fetchedBills;


        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setIsButtonClicked(false);

            prevSubjectRef.current = billSubject;
            prevChamberRef.current = chamber;

        }
    };


    const filterNewBills = async (
        fetchedBills: Bill[]    
    ) => {
        try {
           
        

        fetchedBills.filter((bill) => !votedBills.some((votedBill) => votedBill.number === bill.number)).forEach((bill) => {
            uniqueBillsMap.set(bill.number, bill);
        })
    
    } catch (error) {console.error('Failed to filter new bills:', error);}
        // Update the state with the new unique bills map
        console.log('Unique Bills Map:', uniqueBillsMap);


        return Array.from(uniqueBillsMap.values());
    };

    const fetchVoteLog = async () => {
        try {
            await Requests.getVoteLogByUserId(user.id).then((log) => {
            // Ensure log is not null or undefined
              voteLog.current = log ? Object.keys(log) : [];
           
            });
        } catch (error) {
            console.error('Failed to fetch vote log:', error);
            voteLog.current = []; // Reset or handle accordingly
        }
    };

    useEffect(() => {   
        fetchVoteLog();
    }, [user, activeBillTab]);


    useEffect(() => {
        fetchBillsBySubject()
        .then((fetchedBills) => {
            fetchedBills?.forEach((bill) => {bill.voted = false;});
            return filterNewBills(fetchedBills as Bill[])
        })
        .then(setAllBills)
        .catch((error) => console.error('Failed to fetch bills dawg:', error));
  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isButtonClicked, subjectOffset]);


    
    return (
        <BillContext.Provider
            value={{
                billsToDisplay,
                billSubject,
                setBillSubject,
                isButtonClicked,
                setIsButtonClicked,
                subjectOffset,
                setSubjectOffset,
                chamber,
                setChamber,
                prevChamberRef,
                prevSubjectRef,
                filterPassedBills,
                setFilterPassedBills,
                setActiveBillTab,
                activeBillTab,
                activeIndex,
                setActiveIndex,
                newBills,
                votedBills,
                voteLog: voteLog.current,
                fetchVoteLog,
            }}>
            {children}
        </BillContext.Provider>
    );
};

export const useDisplayBills = () => {
    return useContext(BillContext);
};
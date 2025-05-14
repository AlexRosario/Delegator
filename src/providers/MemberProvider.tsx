import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { CongressMember, Representative5Calls } from '../types';
import { Requests } from '../api';

type MemberContextType = {
  senators: CongressMember[];
  houseReps: CongressMember[];
  chamber: string;
  setChamber: (chamber: string) => void;
  representatives: CongressMember[];
};

export const MemberContext = createContext<MemberContextType>(
  {} as MemberContextType
);

export const MemberProvider = ({
  children,
  address
}: {
  children: ReactNode;
  address: any;
}) => {
  const representatives = useRef<CongressMember[]>([] as CongressMember[]);
  const [senators, setSenators] = useState<CongressMember[]>([]);
  const [houseReps, setHouseReps] = useState<CongressMember[]>([]);
  const [chamber, setChamber] = useState('house');

  const findReps = async (addressString: string) => {
    return await Requests.getCongressMembersFromFive(addressString).then(
      (reps) => reps
    );
  };
  const getRepInfoFromMultipleAPIs = async (address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  }) => {
    try {
      const reps = await findReps(String(Object.values(address)));
      const fetchCongressMember = async (bioID: string) => {
        return await Requests.getCongressMember(bioID);
      };
      console.log('reps', reps);
      const congressDataResults = await Promise.all(
        reps.representatives.map(async (member: Representative5Calls) => {
          return await fetchCongressMember(member.id);
        })
      );

      return congressDataResults.map((obj) => {
        const rep = reps.representatives.find(
          (r: Representative5Calls) => r.id == obj.member.bioguideId
        );
        return { ...obj.member, ...rep };
      });
    } catch (error) {
      console.error('Error fetching member bios:', error);
      throw error;
    }
  };

  const setStateVariables = async (reps: CongressMember[]) => {
    const house = await reps.filter(
      (member: CongressMember) => member.area == 'US House'
    );
    const senate = await reps.filter(
      (member: CongressMember) => member.area == 'US Senate'
    );
    setHouseReps(house);
    setSenators(senate);
    localStorage.setItem('houseReps', JSON.stringify(house));
    localStorage.setItem('senators', JSON.stringify(senate));
  };

  useEffect(() => {
    if (address)
      getRepInfoFromMultipleAPIs(address)
        .then((data) => {
          representatives.current = data;
          setStateVariables(data);
        })
        .catch((error) => {
          console.error('Fetch error:', error.message);
          if (error.response) {
            console.error('Response text:', error.response.statusText);
          }
        });
  }, []);

  return (
    <MemberContext.Provider
      value={{
        senators,
        houseReps,
        chamber,
        setChamber,
        representatives: representatives.current
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useDisplayMember = () => {
  return useContext(MemberContext);
};

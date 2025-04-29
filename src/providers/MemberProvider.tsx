import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { CongressMember } from '../types';
import { Requests } from '../api';
import { useLocation } from 'react-router-dom';

type MemberContextType = {
  senators: CongressMember[];
  houseReps: CongressMember[];
  chamber: string;
  setChamber: (chamber: string) => void;
  representatives: CongressMember[];
};
type GoogleDataType = {
  name: string;
  offices: { officialIndices: number[]; name: string }[];
  officials: CongressMember[];
};
type CongressDataType = CongressMember[];

export const MemberContext = createContext<MemberContextType>(
  {} as MemberContextType
);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const representatives = useRef<CongressMember[]>([] as CongressMember[]);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};
  const [senators, setSenators] = useState<CongressMember[]>([]);
  const [houseReps, setHouseReps] = useState<CongressMember[]>([]);
  const [chamber, setChamber] = useState('house');
  const location = useLocation();

  const getRepInfoFromMultipleAPIs = async (address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  }) => {
    const { street, city, state, zipcode } = address;

    try {
      const congressDataGoogle: GoogleDataType =
        await Requests.getCongressMembers(
          `${street} ${city} ${state} ${zipcode}`
        );

      const fetchCongressMembers = async (offset: number) => {
        const response = await Requests.getCongressMembersBioIds(offset);
        return response.members;
      };

      const offsets = Array.from(
        { length: Math.ceil(555 / 20) },
        (_, i) => i * 20
      );

      const congressDataResults = await Promise.all(
        offsets.map(fetchCongressMembers)
      );

      const congressDataCongressGov: CongressDataType =
        congressDataResults.flat();

      return {
        congressDataGoogle,
        congressDataCongressGov
      };
    } catch (error) {
      console.error('Error fetching member bios:', error);
      throw error;
    }
  };

  const congressGovMemberDetails = (
    member: CongressMember,
    membersCongressGov: CongressDataType
  ) => {
    const memberName = member.name;

    const congressObject = membersCongressGov.find((member) => {
      const [lastName, firstname] = member.name.split(', ');
      if (memberName == `${firstname} ${lastName}`) {
        return member;
      }
    });

    return {
      ...congressObject,
      ...member
    };
  };

  const setStateVariables = (reps: CongressMember[]) => {
    setHouseReps(
      reps.filter((member: CongressMember) =>
        member.urls[0].includes('.house.gov')
      )
    );
    setSenators(
      reps.filter((member: CongressMember) =>
        member.urls[0].includes('.senate.gov')
      )
    );
  };

  /*const addNewRepresentativesToUserDB = async (reps: CongressMember[]) => {
    try {
      const existingRepresentatives = await Requests.checkExistingReps();
      const existingIds = new Set(
        existingRepresentatives.map((rep: CongressMember) => rep.name)
      );
      console.log('ei:', existingIds);
      for (const rep of reps) {
        if (!existingIds.has(rep.name)) {
          const postedRep = await Requests.postNewReps(rep);
        }
      }
    } catch (error) {
      console.error('Error adding new representatives to DB:', error);
    }
  };*/

  useEffect(() => {
    const address = location.state?.address;

    if (address)
      getRepInfoFromMultipleAPIs(address)
        .then((data) => {
          console.log('Data received:', data);

          const filteredRepresentatives: CongressMember[] = [];

          data?.congressDataGoogle.officials.forEach((member, i) => {
            const office_title = data.congressDataGoogle.offices?.find(
              (office) => office.officialIndices.includes(i)
            )?.name;

            const mergedMember = {
              ...congressGovMemberDetails(member, data.congressDataCongressGov),
              ...{ office_title: office_title }
            };

            filteredRepresentatives.push({
              ...(mergedMember as CongressMember)
            });
          });

          representatives.current = filteredRepresentatives;

          setStateVariables(filteredRepresentatives);

          //  addNewRepresentativesToUserDB(filteredRepresentatives);
        })
        .catch((error) => {
          console.error('Fetch error:', error.message);
          if (error.response) {
            console.error('Response text:', error.response.statusText);
          }
        });
  }, [location.state]);

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

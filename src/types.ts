interface Actions {
  count: number;
  url: string;
}

interface Committees {
  count: number;
  url: string;
}

interface Cosponsors {
  count: number;
  countIncludingWithdrawnCosponsors: number;
  url: string;
}

interface LatestAction {
  actionDate: string;
  text: string;
}

interface Sponsor {
  bioguideId: string;
  firstName: string;
  fullName: string;
  isByRequest: string;
  lastName: string;
  middleName: string;
  party: string;
  state: string;
  url: string;
}

interface Titles {
  count: number;
  url: string;
}

export interface Bill {
  subjects: any;
  actions: Actions;
  committees: Committees;
  congress: number;
  cosponsors: Cosponsors;
  introducedDate: string;
  latestAction: LatestAction;
  number: string;
  originChamber: string;
  originChamberCode: string;
  sponsors: Sponsor[];
  summary: string;
  title: string;
  titles: Titles;
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
  url: string;
  policyArea: {
    name: string;
  };
}
export type User = {
  id: string;
  username: string;
  email: string;
  zipcode: string;
};

export interface Vote {
  userId: string;
  billId: string;
  vote: 'Yes' | 'No';
  date: Date;
}

export type AddressInformation = {
  city: string;
  district: string;
  officeAddress: string;
  phoneNumber: string;
  zipCode: number;
};

export type Depiction = {
  attribution: string;
  imageUrl: string;
};

export type LegislationInfo = {
  count: number;
  url: string;
};

export type PartyHistory = {
  party: string;
  startDate?: string;
  endDate?: string;
};

export type Term = {
  congress: string;
  startDate: string;
  endDate: string;
  state: string;
  district?: string;
};

export type FieldOffice = {
  phone: string;
  city: string;
};

export type CongressMember = {
  addressInformation: AddressInformation;
  area: 'US House' | 'US Senate';
  bioguideId: string;
  birthYear: string;
  cosponsoredLegislation: LegislationInfo;
  currentMember: boolean;
  depiction: Depiction;
  directOrderName: string;
  district: string;
  field_offices: FieldOffice[];
  firstName: string;
  honorificName: string;
  id: string;
  invertedOrderName: string;
  lastName: string;
  name: string;
  officialWebsiteUrl: string;
  party: string;
  partyHistory: PartyHistory[];
  phone: string;
  photoURL: string;
  reason: string;
  sponsoredLegislation: LegislationInfo;
  state: string;
  terms: Term[];
  updateDate: string; // ISO date string
  url: string;
};

export type Representative5Calls = {
  id: string;
  name: string;
  phone: string;
  url: string;
  photoURL: string;
  party: string;
  state: string;
  district?: string; // optional, since senators don't have it
  reason: string;
  area: 'US House' | 'US Senate';
  field_offices: FieldOffice[];
};

export interface RelevantVote {
  chamber: string;
  roll_call(
    congress: string,
    arg1: string,
    session: string,
    roll_call: string
  ): unknown;
  congress: string;
  session: string;
  roll_Call: string;
}
export type MemberVote = {
  cook_pvi: string | null;
  district: string;
  dw_nominate: number | null;
  member_id: string;
  name: string;
  party: 'D' | 'R' | 'I';
  state: string;
  vote_position: 'Yes' | 'No' | 'Present' | 'Not Voting';
};
type PartyVotes = {
  yes: number;
  no: number;
  present: number;
  not_voting: number;
};

export type RollCall = {
  copyright: string;
  results: {
    votes: {
      vacant_seats: Array<Record<string, unknown>>;
      vote: {
        amendment: Record<string, unknown>;
        bill: string;
        chamber: string;
        congress: number;
        date: string;
        democratic: PartyVotes;
        description: string;
        independent: PartyVotes;
        positions: Array<Record<string, unknown>>;
        question: string;
        question_text: string;
        republican: PartyVotes;
        result: string;
        roll_call: number;
        session: number;
        source: string;
        time: string;
        total: PartyVotes;
        url: string;
        vote_type: string;
      };
    };
  };
  status: string;
};

export type VoteRecord = {
  amendment: Record<string, unknown>;
  bill: {
    bill_id: string;
    number: string;
    sponsor_id: string;
    api_uri: string;
    title: string;
  };
  chamber: string;
  congress: string;
  date: string;
  democratic: {
    yes: number;
    no: number;
    present: number;
    not_voting: number;
    majority_position: string;
  };
  description: string;
  independent: {
    yes: number;
    no: number;
    present: number;
    not_voting: number;
  };
  question: string;
  question_text: string;
  republican: {
    yes: number;
    no: number;
    present: number;
    not_voting: number;
    majority_position: string;
  };
  result: string;
  roll_call: string;
  session: string;
  source: string;
  time: string;
  total: {
    yes: number;
    no: number;
    present: number;
    not_voting: number;
  };
  url: string;
  vote_type: string;
  vote_uri: string;
};

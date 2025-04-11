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
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  vote_log: object;
};

export interface Vote {
  userId: string;
  billId: string;
  vote: 'Yes' | 'No';
  date: Date;
}

export interface CongressMember {
  bioguideId: string;
  name: string;
  party: string;
  partyName: string;
  state: string;
  phones: string[];
  urls: string[];
  photoUrl: string;
  district: string;
  url: string;
  address: string[];
  terms: {
    item: string[];
  };
  updateDate: string;
  channels: string[];
  depiction: string[];
  votes_with_party_pct?: number;
  office_title: string;
  office: string;
  title: { name: string };
}

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

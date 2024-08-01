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

import React, { useState } from 'react';
import { useDisplayBills } from '../../providers/BillProvider';
import BillCard from './BillCard';
import { allPolicies } from '../../constants/policy-terms';
import { Bill } from '../../types';

export const BillCollection = () => {
  const { billsToDisplay, billSubject, setBillSubject, votedBills } =
    useDisplayBills();
  const [searchType, setSearchType] = useState('all');

  const policyBills = allPolicies.reduce<Record<string, Bill[]>>(
    (acc, policy) => {
      acc[policy] = billsToDisplay.filter((bill) => {
        return bill.policyArea?.name === policy;
      });

      return acc;
    },
    {}
  );
  const createSelector = (category: string, label: string) => {
    return (
      <div
        className={`selector ${searchType === category ? 'active' : ''}`}
        onClick={() => {
          setSearchType(category);
          setBillSubject('');
        }}
      >
        {label}
      </div>
    );
  };
  const formPolicyRow = (policy: string) => {
    return (
      policyBills[policy].length > 0 && (
        <div key={policy}>
          <b>{policy}:</b>
          <div className="policy-row">
            {policyBills[policy].map((bill, index) => (
              <BillCard
                bill={bill}
                key={index}
                className="bill-collection-card"
              />
            ))}
          </div>
        </div>
      )
    );
  };

  const formOtherRow = () => {
    return (
      <div className="policy-row">
        {billsToDisplay
          .filter(
            (bill) =>
              !allPolicies.some(
                (policy) =>
                  policy.toLowerCase() === bill.policyArea?.name.toLowerCase()
              )
          )
          .map((bill, index) => (
            <BillCard
              bill={bill}
              key={index}
              className="bill-collection-card"
            />
          ))}
      </div>
    );
  };

  return (
    <div className="bill-collection-container">
      <div className="search-subject">
        <div className="selectors">
          {createSelector('all', 'All')}
          {createSelector('policy', ' Filter by Policy')}
          {createSelector('legislative-term', 'Filter by Legislative Term')}
        </div>

        <div className="subject-fields">
          {searchType === 'policy' && (
            <select
              value={billSubject || 'default'}
              onChange={(e) => {
                setBillSubject(e.target.value);
              }}
            >
              <option value="default">
                Select a subject by suggested policy terms
              </option>
              {allPolicies.map((policy) => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ))}
            </select>
          )}
          {searchType === 'legislative-term' && (
            <div className="legislative-term">
              <div id="leg-term">
                <input
                  type="text"
                  placeholder="Search for bills by legislative term"
                  onChange={(e) => {
                    setBillSubject(e.target.value);
                  }}
                />
                <a
                  href="https://www.congress.gov/advanced-search/legislative-subject-terms?congresses%5B%5D=118"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  List of Acceptable Terms
                </a>
              </div>
            </div>
          )}
          {searchType === 'bill-number' && (
            <div className="bill-number">
              <div id="bill-num">
                <input
                  type="text"
                  placeholder="Search for bills by number"
                  onChange={(e) => {
                    setBillSubject(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bill-collection">
        {searchType === 'all' ? (
          <>
            {allPolicies.map((policy) => {
              return formPolicyRow(policy);
            })}

            <b>Other Bills:</b>
            {formOtherRow()}
          </>
        ) : (searchType === 'policy' || searchType === 'legislative-term') &&
          billsToDisplay.length > 0 ? (
          <div className="policy-row">
            {billsToDisplay
              .filter((bill) => {
                return (
                  bill.policyArea?.name.toLowerCase() ===
                    billSubject.toLowerCase() ||
                  bill.subjects.legislativeSubjects?.some(
                    (legislativeSubject: { name: string; date: Date }) =>
                      legislativeSubject.name
                        .toLowerCase()
                        .startsWith(billSubject.toLowerCase())
                  )
                );
              })
              .map((bill, index) => (
                <BillCard
                  bill={bill}
                  key={index}
                  className="bill-collection-card"
                />
              ))}
          </div>
        ) : (
          <h1>No Bills</h1>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useDisplayBills } from '../Providers/BillProvider';
import { Bill } from '../types';
import VoteButton from './VoteButton';
import { Requests } from '../api'; // Import the Request object

export const BillCard = ({
  bill,
  className,
  onClick
}: {
  bill: Bill;
  className: string;
  onClick?: () => void;
}) => {
  const { congress } = useDisplayBills();
  const [billLinks, setBillLinks] = useState<{ [key: string]: string }>({});
  const [okToRender, setOkToRender] = useState(false);
  const [summary, setSummary] = useState('');

  function getBillStatusMessage(bill: Bill) {
    if (bill.vetoed !== null) return bill.vetoed;

    const passedHouse = bill.house_passage !== null;
    const passedSenate = bill.senate_passage !== null;
    const lastVote = bill.last_vote !== null;

    if (passedHouse && passedSenate) {
      return lastVote
        ? 'Passed House and Senate'
        : 'Passed both chambers with floor vote. No roll call.';
    } else if (passedHouse) {
      return lastVote
        ? 'Passed House, waiting on Senate'
        : 'Passed House with floor vote. No roll call.';
    } else if (passedSenate) {
      return lastVote
        ? 'Passed Senate, waiting on House'
        : 'Passed Senate with floor vote. No roll call.';
    }

    // Default case if none of the above conditions are met
    return `Waiting on vote from House and Senate`;
  }

  const getMoreInfo = async (
    congress: string,
    billType: string,
    billNumber: string
  ) => {
    try {
      const data = await Requests.getBillSummary(
        congress,
        billType.toLowerCase(),
        billNumber,
        'text'
      );
      console.log('Data:', data);
      if (data.textVersions.length > 0) {
        const url = data.textVersions[0].formats[0].url;
        setBillLinks((prevLinks) => ({
          ...prevLinks,
          [billType + billNumber]: url
        }));
        console.log('Bill Links:', billLinks);
      } else {
        console.error('No text versions available');
      }
    } catch (error) {
      console.error('Error fetching bill summary:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (Array.isArray(bill) && bill.length > 0 && 'summary' in bill[0]) {
        setOkToRender(true);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [bill]);

  return (
    <div className={className} onClick={onClick}>
      <div className="bill-header">
        <b>{`${bill.originChamberCode}${bill.number}`}</b>
      </div>
      {bill.summary === 'No Summary Available' ? <b>{bill.title}</b> : ''}
      <div dangerouslySetInnerHTML={{ __html: bill.summary }} />
      {!billLinks[bill.type + bill.number] ? (
        <b
          onClick={() => {
            getMoreInfo(congress, bill.type, bill.number);
          }}
        >
          Read Full Text
        </b>
      ) : (
        <a
          href={billLinks[bill.type + bill.number]}
          target="_blank"
          rel="noreferrer"
          className="bill-url"
        >
          {billLinks[bill.type + bill.number]}
        </a>
      )}
      <div className="bill-member_positions">
        <b>{bill.latestAction.actionDate}</b>
        <div>{bill.latestAction.text}</div>
      </div>
      <div className="bill-status">{getBillStatusMessage(bill)}</div>
      <VoteButton bill={bill} />
    </div>
  );
};

export default BillCard;

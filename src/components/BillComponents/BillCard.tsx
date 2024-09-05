import React, { useEffect, useState } from 'react';
import { useDisplayBills } from '../../providers/BillProvider';
import { Bill } from '../../types';
import VoteButton from './VoteButton';
import { Requests } from '../../api';
import { useAuthInfo } from '../../providers/AuthProvider';
import { Link } from 'react-router-dom';

export const BillCard = ({
  bill,
  className,
  onClick
}: {
  bill: Bill;
  className: string;
  onClick?: () => void | number;
}) => {
  const { congress } = useDisplayBills();
  const [billLinks, setBillLinks] = useState<{ [key: string]: string }>({});
  const [okToRender, setOkToRender] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const getMoreInfo = async (
    congress: string,
    billType: string,
    billNumber: string
  ) => {
    try {
      const data = await Requests.getBillDetail(
        congress,
        billType.toLowerCase(),
        billNumber,
        'text'
      );

      if (data.textVersions.length > 0) {
        const url = data.textVersions[0].formats[0].url;
        setBillLinks((prevLinks) => ({
          ...prevLinks,
          [billType + billNumber]: url
        }));
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
      {user ? (
        <VoteButton bill={bill} />
      ) : (
        <Link to="/Home" className="sign-in-link">
          Sign in to Vote
        </Link>
      )}
    </div>
  );
};

export default BillCard;

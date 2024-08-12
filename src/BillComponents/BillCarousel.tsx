import React, { useEffect, useState, useRef } from 'react';
import { useDisplayBills } from '../Providers/BillProvider';
import { BillCard } from './BillCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleLeft,
  faHourglass2
} from '@fortawesome/free-solid-svg-icons';
import { Bill } from '../types';

export const BillCarousel = () => {
  const {
    billsToDisplay,
    activeBillTab,
    setCurrentIndex,
    currentIndex,
    setActiveBillTab,
    filterPassedBills
  } = useDisplayBills();
  const {} = useDisplayBills();

  const next = currentIndex < billsToDisplay.length - 1 ? currentIndex + 1 : 0;
  const prev = currentIndex > 0 ? currentIndex - 1 : billsToDisplay.length - 1;
  const isLoading = billsToDisplay.length === 0 ? true : false;

  useEffect(() => {
    updateSlides();
  }, [currentIndex]);

  const updateSlides = () => {
    document.querySelectorAll('.bill-card').forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      if (index === currentIndex) slide.classList.add('active');
      if (index === prev) slide.classList.add('prev');
      if (index === next) slide.classList.add('next');
    });
  };

  const goToNum = (number: number) => {
    setCurrentIndex(number);
  };

  const goToNext = () => {
    currentIndex < billsToDisplay.length - 1
      ? goToNum(currentIndex + 1)
      : goToNum(0);
  };

  const goToPrev = () => {
    currentIndex > 0
      ? goToNum(currentIndex - 1)
      : goToNum(billsToDisplay.length - 1);
  };

  return (
    <>
      <div className="carousel-container">
        <FontAwesomeIcon
          icon={faAngleLeft}
          onClick={goToPrev}
          className="arrows-carousel"
        />
        <div className="carousel">
          {!isLoading ? (
            billsToDisplay
              .filter((bill) => {
                return filterPassedBills
                  ? bill.latestAction.text.includes('Became Public Law No:')
                  : !bill.latestAction.text.includes('Became Public Law No:');
              })
              .map((bill, index) => (
                <BillCard
                  bill={bill}
                  key={index}
                  className={`bill-card ${index === currentIndex ? 'active' : ''} ${index === prev ? 'prev' : ''} ${index === next ? 'next' : ''}`}
                  onClick={
                    index === prev
                      ? goToPrev
                      : index === next
                        ? goToNext
                        : undefined
                  }
                ></BillCard>
              ))
          ) : (
            <FontAwesomeIcon icon={faHourglass2} size="3x" />
          )}
        </div>
        <FontAwesomeIcon
          icon={faAngleRight}
          onClick={goToNext}
          className="arrows-carousel"
        />
      </div>
    </>
  );
};

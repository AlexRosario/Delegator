import React, { useEffect, useState, useRef } from 'react';
import { useDisplayBills } from '../Providers/BillProvider';
import { BillCard } from './BillCard';

export const BillCarousel = () => {
  const {
    billsToDisplay,
    activeBillTab,
    setCurrentIndex,
    currentIndex,
    setActiveBillTab
  } = useDisplayBills();
  const {} = useDisplayBills();

  const [activeIndex, setActiveIndex] = useState([0, 1, 2]);

  const next = currentIndex < billsToDisplay.length - 1 ? currentIndex + 1 : 0;
  const prev = currentIndex > 0 ? currentIndex - 1 : billsToDisplay.length - 1;

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

  useEffect(() => {
    setActiveIndex([0, 1, 2]);
  }, [activeBillTab]);

  return (
    <>
      <div className="bill-status">
        <button
          className={`bill-list-button ${activeBillTab === 'all' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('all');
          }}
        >
          All Bills
        </button>
        <button
          className={`bill-list-button ${activeBillTab === 'new' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('new');
          }}
        >
          New Bills
        </button>
        <button
          className={`bill-list-button ${activeBillTab === 'voted' ? 'selected' : ''}`}
          onClick={() => {
            setActiveBillTab('voted');
          }}
        >
          Voted Bills
        </button>
      </div>
      <div className="carousel">
        {billsToDisplay.map((bill, index) => (
          <BillCard
            bill={bill}
            key={index}
            className={`bill-card ${index === currentIndex ? 'active' : ''} ${index === prev ? 'prev' : ''} ${index === next ? 'next' : ''}`}
            onClick={
              index === prev ? goToPrev : index === next ? goToNext : undefined
            }
          ></BillCard>
        ))}
      </div>
      <button onClick={goToPrev}>Previous</button>
      <button onClick={goToNext}>Next</button>
    </>
  );
};

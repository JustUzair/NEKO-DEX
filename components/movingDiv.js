import React, { useState, useEffect } from 'react';

const MovingDiv = () => {
  const [maxWidth, setMaxWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    const parentDiv = document.querySelector('.parent');
    setMaxWidth(parentDiv.offsetWidth - 50);
    setMaxHeight(parentDiv.offsetHeight - 50);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMaxWidth(parentDiv.offsetWidth - 50);
      setMaxHeight(parentDiv.offsetHeight - 50);
    };

    const parentDiv = document.querySelector('.parent');
    parentDiv.addEventListener('resize', handleResize);

    return () => {
      parentDiv.removeEventListener('resize', handleResize);
    };
  }, []);

  const moveDiv = () => {
    setLeft(getRandomNumber(0, maxWidth));
    setTop(getRandomNumber(0, maxHeight));
  };

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div
      className="parent"
      style={{
        position: 'relative',
        width: '800px',
        height: '600px',
        border: '1px solid #000',
        overflow: 'hidden'
      }}
    >
      <div
        className="moving-div"
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          backgroundColor: 'red',
          left: `${left}px`,
          top: `${top}px`
        }}
        onClick={moveDiv}
      ></div>
    </div>
  );
};

export default MovingDiv;

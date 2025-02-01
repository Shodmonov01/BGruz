import { useState, useEffect } from 'react';

const CurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString();
    return `${day} ${month} ${year} ${time}`;
  };

  return (
    <div className="text-center px-4 py-3 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-[10px] md:text-[15px] font-bold text-gray-800">
        {formatTime(time)}
      </h1>
    </div>
  );
};

export default CurrentTime;
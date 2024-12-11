import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function CurrentDateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-gray-600 text-base mb-3">
      <div className="font-medium text-lg capitalize">
        {format(currentTime, 'EEEE', { locale: pl })}
      </div>
      <div className="text-lg">
        {format(currentTime, 'HH:mm', { locale: pl })}
      </div>
    </div>
  );
}

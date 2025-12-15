import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Simple calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(calendarDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  const changeMonth = (delta: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + delta, 1));
  };

  return (
    <div className="relative">
      <div 
        className="flex flex-col items-center justify-center px-3 py-1 hover:bg-white/10 rounded-md cursor-pointer transition-colors h-full"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <span className="text-xs font-medium text-white">{formatTime(time)}</span>
        <span className="text-[10px] text-gray-300">{formatDate(time)}</span>
      </div>

      {showCalendar && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowCalendar(false)} 
          />
          <div className="absolute bottom-14 right-0 w-72 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-4 z-50 text-white animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">
                {calendarDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-1">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/20 rounded">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/20 rounded">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {blanksArray.map(b => <div key={`blank-${b}`} />)}
              {daysArray.map(d => {
                const isToday = d === time.getDate() && 
                                calendarDate.getMonth() === time.getMonth() && 
                                calendarDate.getFullYear() === time.getFullYear();
                return (
                  <div 
                    key={d} 
                    className={`h-8 w-8 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 font-bold' : 'hover:bg-white/10'}`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
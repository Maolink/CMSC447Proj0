import './App.css';
import React from 'react';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';

function App() {
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      {
        id: 1,
        title: 'CMSC 447',
        start: '2025-04-08 05:30',
        end: '2025-04-08 06:45',
      },
    ],
    selectedDate: '2025-04-07',
  });

  if (!calendar) return <div>Loading calendar...</div>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      {calendar ? (
        <ScheduleXCalendar calendarApp={calendar} />
      ) : (
        <p>Loading calendar...</p>
      )}
    </div>
  );
  
}

export default App;


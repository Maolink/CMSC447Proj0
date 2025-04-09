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
        start: '2025-04-08 17:30',
        end: '2025-04-08 18:45',
      },
    ],
    selectedDate: '2025-04-07',
  });

  if (!calendar) return <div>Loading calendar...</div>;

  return (
      <>
      <div className='tableContainer'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Course ID</th>
              <th>Description</th>
              <th>Class Time</th>
              <th>Room</th>
              <th>Add Class to Schedule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Software Engineering</td>
              <td>CMSC447</td>
              <td>Develop websites in group projects</td>
              <td>5:30pm to 6:45pm, Tues/Thurs</td>
              <td>SOND205</td>
              <td><button className='addClassButton'>Add Class</button></td>
            </tr>
            <tr>
              <td>Malware Analysis</td>
              <td>CMSC449</td>
              <td>Dynamic and Stat analysis of malware</td>
              <td>5:30pm - 6:45pm, Mon/Wed</td>
              <td>MP012</td>
              <td><button className='addClassButton'>Add Class</button></td>
            </tr>
            <tr>
              <td>Algorithms</td>
              <td>CMSC441</td>
              <td>Run time analysis of algorithms used on different data structures</td>
              <td>10am - 11:15am, Mon/Wed</td>
              <td>ITE233</td>
              <td><button className='addClassButton'>Add Class</button></td>
            </tr>
            <tr>
              <td>Mobile Computing</td>
              <td>CMSC491</td>
              <td>Develop android apps using android studio in java</td>
              <td>4pm - 5:15pm, Mon/Wed</td>
              <td>MP012</td>
              <td><button className='addClassButton'>Add Class</button></td>
            </tr>
          </tbody>
        </table>
        </div>
      <div
      style={{
        border: '#4f4f4f',
        backgroundColor: '#f9f9f9',
      }}
    >
      {calendar ? (
        <ScheduleXCalendar calendarApp={calendar} />
      ) : (
        <p>Loading calendar...</p>
      )}
    </div>
    <div className='advisorRec'>
      <p>Software Engineering has a semester-long group project where students choose one of four projects and use Agile and Scrum methodologies to work in a team to develop the project. Part of the Agile workflow features sprints, daily stand-ups, reviews, and retrospectives. These methodologies will simulate real-world software development practices.</p>
      <p>Required Pre-requisites: </p> <p>CMSC 341 and one additional 400-level CMSC course with a grade of ‘C’ or better. </p>
    </div>
    </>
  );
  
}

export default App;


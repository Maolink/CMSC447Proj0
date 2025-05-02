import './App.css';
import React from 'react';
import CourseLister from './components/courseLister';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';

const eventServicePlugin = createEventsServicePlugin();

const courseColumns: string[] = [
  "course_id",
  "name",
  "description",
  "meeting_times",
  "room",
];

function App() {
  const calendar = useCalendarApp({
    plugins: [eventServicePlugin],
    views: [createViewWeek(), createViewMonthGrid()],
    events: [
      // {
      //   id: 1,
      //   title: 'CMSC 447',
      //   start: '2025-04-08 17:30',
      //   end: '2025-04-08 18:45',
      // },
    ],
    selectedDate: '2025-04-07',
  });

  if (!calendar) return <div>Loading calendar...</div>;

  var advisorRecs = '<p>Advisor recommendations will be here when a class is selected.</p>'
  return (
      <>
      <div className="topBar">
        <h1 style={{ margin: 0 }}>My Academic Pathway</h1>
      </div>
      <div className="tableContainer">
        <h1>courses:</h1>
        <CourseLister
          columns={courseColumns}
        />
      </div>
      {/* <div className='tableContainer'>
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
              <td>CMSC 447</td>
              <td>Develop websites in group projects</td>
              <td>5:30pm to 6:45pm, Tues/Thurs</td>
              <td>SOND205</td>
              <td><button className='buttonClass' 
              onClick={() => {
                // var advisorRecs = '<p>Software Engineering has a semester-long group project where students choose one of four projects and use Agile and Scrum methodologies to work in a team to develop the project. Part of the Agile workflow features sprints, daily stand-ups, reviews, and retrospectives. These methodologies will simulate real-world software development practices.</p><p>Required Pre-requisites: </p> <p>CMSC 341 and one additional 400-level CMSC course with a grade of ‘C’ or better. </p>'
                if (eventServicePlugin.get(1) === undefined) {
                  eventServicePlugin.add({
                    id:1,
                    title: 'CMSC 447',
                    start: '2025-04-08 17:30',
                    end: '2025-04-08 18:45',
                  })
                  eventServicePlugin.add({
                    id:1,
                    title: 'CMSC 447',
                    start: '2025-04-10 17:30',
                    end: '2025-04-10 18:45',
                  })                }
              }}>Add Class</button></td>
              <td><button className='buttonClass' onClick={() => {
                if (eventServicePlugin.get(1) !== undefined) {
                eventServicePlugin.remove(1)
                eventServicePlugin.remove(1)
              }}}>Remove Class</button></td>
            </tr>
            <tr>
              <td>Malware Analysis</td>
              <td>CMSC449</td>
              <td>Dynamic and Stat analysis of malware</td>
              <td>5:30pm - 6:45pm, Mon/Wed</td>
              <td>MP012</td>
              <td><button className='buttonClass'
              onClick={() => {
                // var advisorRecs = '<p>Malware anaylsis is a class that </p><p>Required Pre-requisites: </p> <p>CMSC 341 and one additional 400-level CMSC course with a grade of ‘C’ or better. </p>';
                if (eventServicePlugin.get(2) === undefined) {
                  eventServicePlugin.add({
                    id:2,
                    title: 'CMSC 449',
                    start: '2025-04-07 17:30',
                    end: '2025-04-07 18:45',
                  })
                  eventServicePlugin.add({
                    id:2,
                    title: 'CMSC 449',
                    start: '2025-04-09 17:30',
                    end: '2025-04-09 18:45',
                  })
                }
              }}>Add Class</button></td>
              <td><button className='buttonClass' onClick={() => {
                if (eventServicePlugin.get(2) !== undefined) {
                eventServicePlugin.remove(2)
                eventServicePlugin.remove(2)
              }}}>Remove Class</button></td>
            </tr>
            <tr>
              <td>Algorithms</td>
              <td>CMSC441</td>
              <td>Run time analysis of algorithms used on different data structures</td>
              <td>10am - 11:15am, Mon/Wed</td>
              <td>ITE233</td>
              <td><button className='buttonClass'
                            onClick={() => {
                              if (eventServicePlugin.get(3) === undefined) {
                                eventServicePlugin.add({
                                  id:3,
                                  title: 'CMSC 441',
                                  start: '2025-04-07 10:00',
                                  end: '2025-04-07 11:15',
                                })
                                eventServicePlugin.add({
                                  id:3,
                                  title: 'CMSC 441',
                                  start: '2025-04-09 10:00',
                                  end: '2025-04-09 11:15',
                                })
                              }}}
              >Add Class</button></td>
              <td><button className='buttonClass'
              onClick={() => {
                if (eventServicePlugin.get(3) !== undefined) {
                eventServicePlugin.remove(3)
                eventServicePlugin.remove(3)
              }}}
              >Remove Class</button></td>
            </tr>
            <tr>
              <td>Mobile Computing</td>
              <td>CMSC491</td>
              <td>Develop android apps using android studio in java</td>
              <td>4pm - 5:15pm, Mon/Wed</td>
              <td>MP012</td>
              <td><button className='buttonClass'
              onClick={() => {
                if (eventServicePlugin.get(4) === undefined) {
                  eventServicePlugin.add({
                    id:4,
                    title: 'CMSC 491',
                    start: '2025-04-07 16:00',
                    end: '2025-04-07 17:15',
                  })
                  eventServicePlugin.add({
                    id:4,
                    title: 'CMSC 491',
                    start: '2025-04-09 16:00',
                    end: '2025-04-09 17:15',
                  })
                }}}
                >Add Class</button></td>
                <td><button className='buttonClass' onClick={() => {
                if (eventServicePlugin.get(4) !== undefined) {
                eventServicePlugin.remove(4)
                eventServicePlugin.remove(4)
              }}}>Remove Class</button></td>
            </tr>
          </tbody>
        </table>
        </div> */}
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
    <div dangerouslySetInnerHTML={{__html: advisorRecs}} className='advisorRec'/>
    </>
  );
  
}

export default App;


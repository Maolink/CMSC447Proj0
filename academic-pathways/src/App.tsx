import './App.css';
import React, {useState, useEffect} from 'react'; 
import CourseLister from './components/courseLister';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import LandingPage from './LandingPage';
import api from './api'


const eventServicePlugin = createEventsServicePlugin();

const courseColumns: string[] = [
  "course_id",
  "name",
  "description",
  "meeting_times",
  "room",
];

interface Course {
  id: number;
  course_id: string;
  name: string;
  meeting_times: Record<string, string>; 
  room: string;
}

const SEMESTERS = [
  'Freshman Fall',
  'Freshman Spring',
  'Sophomore Fall',
  'Sophomore Spring',
  'Junior Fall',
  'Junior Spring',
  'Senior Fall',
  'Senior Spring',
] as const

function App() {
  const [schedules, setSchedules] = useState(1); // this will be used as saving the current semester being worked on.
  const [currentSchedule, setCurrentSchedule] = useState<number | null>(null);
  const [showPlanner, setShowPlanner] = useState(false) 
  const [selectedMajor, setSelectedMajor] = useState('')
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    api.get('schedules/${currentSchedule}/courses').then(res => setCourses(res.data)).catch(err => console.error(err))
  }, [schedules])


  const events = courses.flatMap(course => {
    const mt = course.meeting_times

    return Object.keys(mt).filter(key => key.endsWith("Start")).flatMap(startKey => { // gets start and ending keys, but picks out only starting times
      
      const day = startKey.slice(0, -5)
      const endKey = `${day}End`
      // create key for usage to get the ending time in the meeting time dictionary
      const start = mt[startKey]
      const end = mt[endKey]
      
      if (start != "") {
        return {
          id: `${course.id}-${day}`,
          title: course.course_id,
          start,
          end
        }
      } else {
        return undefined
      }
    })}).flatMap(evt => evt ? [evt] : [])

  const calendar = useCalendarApp({
    plugins: [eventServicePlugin],
    views: [createViewWeek(), createViewMonthGrid()],
    events: events,
    selectedDate: '2025-04-07',
  });

  if (!calendar) return <div>Loading calendar...</div>;


  var advisorRecs = '<p>Advisor recommendations will be here when a class is selected.</p>'

  if (!showPlanner) {
    return <LandingPage onSubmit={(major) => {
      setSelectedMajor(major);
      setShowPlanner(true); 
    }} />;
  }

  return (
      <>
      <div className="topBar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h1 style={{ margin: 0 }}>My Academic Pathway</h1>
        <button
          onClick={() => setShowPlanner(false)}
          style={{
            backgroundColor: '#ffcc00',
            border: 'none',
            padding: '10px 15px',
            fontWeight: 'bold',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Main Page
        </button>
      </div>
      <div className="SemesterTabs" style={{padding: 20}}>
        <p>Choose a semester here:</p>
            {SEMESTERS.map((semester_value, i) => (
              <button key={i} onClick={() => setSchedules(i + 1)} style={{marginRight: 8,padding: '4px 8px', fontWeight: schedules === i + 1 ? 'bold' : 'normal'}}>{semester_value}
            </button>
          ))}
      </div>
      <div className="tableContainer">
        <h1>courses:</h1>
        <CourseLister
          major={selectedMajor}
          currentSchedule={schedules}
          columns={courseColumns}
        />
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
    <div dangerouslySetInnerHTML={{__html: advisorRecs}} className='advisorRec'/>
    </>
  );
  
}

export default App;

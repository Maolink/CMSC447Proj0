import './App.css';
import React, {useState, useEffect} from 'react'; 
import CourseLister from './components/courseLister';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import LandingPage from './LandingPage';
import api from './api'

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
  credits: string;
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
  const [currentSchedule, setCurrentSchedule] = useState<number>(1);
  const [showPlanner, setShowPlanner] = useState(false) 
  const [selectedMajor, setSelectedMajor] = useState('')
  // const [courses, setCourses] = useState<Course[]>([])
  const [semesterCourses, setSemesterCourses] = useState<Course[]>([])
  const [refresh, setRefresh] = useState(0)
  const [eventServicePlugin] = useState(() => createEventsServicePlugin());

    const calendar = useCalendarApp({
    plugins: [eventServicePlugin],
    views: [createViewWeek(), createViewMonthGrid()],
    events: [],
    selectedDate: '2025-04-07',
  });

  useEffect(() => {
    api.get(`schedules/${currentSchedule}/courses`).then(res => setSemesterCourses(res.data)).catch(err => console.error(err))
    console.log('schedule = %d', currentSchedule)
    console.log('semester courses = %s', JSON.stringify(semesterCourses))
  }, [refresh])

  // this is never getting the users schedule, and is just trying to add it to the calendar from the course 

  useEffect(() => {
    if (!eventServicePlugin.eventsFacade) return;
    console.log("hello")
    eventServicePlugin.getAll().forEach(event => {
      eventServicePlugin.remove(event.id)
    })
    semesterCourses.forEach(course => {
      Object.entries(course.meeting_times).filter(([key]) => 
        key.endsWith('Start')).forEach(([startKey, start]) => {
          if (start !== "") {
            const day = startKey.replace(/Start$/, '')
            const endTime = course.meeting_times[`${day}End`]
            eventServicePlugin.add({
              id: `${course.id}-${day}`,
              title: course.course_id,
              start:course.meeting_times[startKey],
              end: endTime,
              resource: { credits: Number(course.credits)}
            })
            console.log("event was created probably")
          }
        })
    })
  }, [semesterCourses, eventServicePlugin.eventsFacade])

  const handleAddedCourse = () => {
    setRefresh(k => k+1)
  }

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
              <button key={i} onClick={() => {setCurrentSchedule(i + 1) 
              setRefresh(r => r + 1);}}
              style={{marginRight: 8,padding: '4px 8px', fontWeight: currentSchedule === i + 1 ? 'bold' : 'normal'}}>{semester_value}
            </button>
          ))}
      </div>
      <div className="tableContainer">
        <h1>courses:</h1>
        <CourseLister
          major={selectedMajor}
          scheduleUsed={currentSchedule}
          columns={courseColumns}
          onAdded={handleAddedCourse}
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

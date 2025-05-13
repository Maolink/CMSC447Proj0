import './App.css';
import React, {useState, useEffect} from 'react'; 
import CourseLister from './components/courseLister';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { createViewWeek, createViewMonthGrid } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/calendar.css';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import LandingPage from './LandingPage';
import api from './api'
import { createEventModalPlugin } from '@schedule-x/event-modal';

const courseColumns: string[] = [
  "course_id",
  "name",
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
  description: string;
  semester: string;
  advisorRecs: string;
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
  const [semesterCourses, setSemesterCourses] = useState<Course[]>([])

  const [refresh, setRefresh] = useState(0)
  const [eventServicePlugin] = useState(() => createEventsServicePlugin());

    const calendar = useCalendarApp({
    plugins: [eventServicePlugin, createEventModalPlugin()],
    views: [createViewWeek(), createViewMonthGrid()],
    events: [],
    selectedDate: '2025-05-12',
  });

  const backToCalendar = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  useEffect(() => {
    api.get(`schedules/${currentSchedule}/courses`).then(res => setSemesterCourses(res.data)).catch(err => console.error(err))
  }, [refresh])


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
              resource: { credits: Number(course.credits)},
              description: course.description
            })
            console.log("event was created probably")
          }
        })
    })
  }, [semesterCourses, eventServicePlugin.eventsFacade])

  const handleAddedCourse = () => {
    setRefresh(k => k+1)
  }

  const maxCredits = 18

  const fullTime = 12

  const totalCredits = semesterCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0)

  if (!calendar) return <div>Loading calendar...</div>;


  if (!showPlanner) {
    return <LandingPage onSubmit={(major) => {
      setSelectedMajor(major);
      setShowPlanner(true); 
    }} />;
  }

  return (
      <>
      
      <div className="topBar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0px 20px' }}>
        <h1 style={{ margin: 0, color:"#ffb71c"}}>My Academic Pathway</h1>
        <img src="https://styleguide.umbc.edu/wp-content/uploads/sites/113/2021/03/gold-retriever-on-black.jpg" style={{position:"absolute", width: "50px", height:"50px", left:"1120px"}}>
        </img>
        <button onClick={backToCalendar} className="backToCalendar">
          Go Back to your Calendar
        </button>
        <button onClick={() => setShowPlanner(false)} className="backToMainPage">
          Back to Main Page
        </button>
      </div>

      <div className="SemesterTabs">
        <p></p>
            {SEMESTERS.map((semester_value, i) => (
              <button className="semesterButtons" key={i} onClick={() => {setCurrentSchedule(i + 1) 
              setRefresh(r => r + 1);}}
              style={{fontWeight: currentSchedule === i + 1 ? 'bold' : 'normal'}}>{semester_value}
            </button>
          ))}
      </div>
      
      <div className="calendarContainer">
      {calendar ? (
        <ScheduleXCalendar calendarApp={calendar} />
      ) : (
        <p>Loading calendar...</p>
      )}
      </div>

      <div className='advisorRec'> 
        <aside>
          <p>
            <div className="creditLoadTotal" >Credit Load Total: {totalCredits}</div>
            {totalCredits < fullTime ? <p className='warningText'> You're below the full time credit requirement! </p> : <p> You have enough credits to be a full time student. </p>}
            {totalCredits > maxCredits ? <p className='warningText'> You might be taking too many classes. Make sure you know what you're setting yourself up for! </p> : <></>}
          </p>
          <p> </p>
          {semesterCourses.map(course => (
          <div key={course.id} className="course-item">
            <h3>{course.course_id}: {course.name}</h3>
            <p><strong>Semesters Offered:</strong> {course.semester === 'FallSpring' ? 'Offered both semesters' : course.semester}</p>
            {course.advisorRecs && (
              <p><strong>Advisor Recommendations:</strong> {course.advisorRecs}</p>
            )}
          </div>
        ))}
        </aside>
      </div>
      
      
      <div className="tableContainer">
        <h1 className="courseTableHeaderText">Pick a Course:</h1>
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
    </div>
    </>
  );
  
}

export default App;
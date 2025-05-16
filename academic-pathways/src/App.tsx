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
  // code for scrolling back to the calendar, since the calendar is at the top of the webpage
  const backToCalendar = () => {
    window.scrollTo({top: 0, behavior: 'smooth'})
  }
  // updates semesterCourses based on the refresh value that is incremented every time the courseLister adds or removes a new class
  useEffect(() => {
    api.get(`schedules/${currentSchedule}/courses`).then(res => setSemesterCourses(res.data)).catch(err => console.error(err))
  }, [refresh])


  useEffect(() => {
    // if there is an error with the calendar event API the function will stop as a fail-safe
    if (!eventServicePlugin.eventsFacade) return; 

    // this block of code will remove all events so that new events can be added if there is any change in the database
    eventServicePlugin.getAll().forEach(event => {
      eventServicePlugin.remove(event.id)
    })
    // this block of code will take each course in the semesterCourses list and add it to the calendar.
    semesterCourses.forEach(course => {
      //This part of code will parse the dictionary of class times, and create a string that will be the key for the ending meeting time.
      Object.entries(course.meeting_times).filter(([key]) => 
        key.endsWith('Start')).forEach(([startKey, start]) => {
          if (start !== "") {
            // only creates a calendar event if there is a valid start time, if the value of the key doesn't have an empty string
            const day = startKey.replace(/Start$/, '')
            const endTime = course.meeting_times[`${day}End`]
            eventServicePlugin.add({
              id: `${course.id}-${day}`, // create a unique ID for the event based on the day
              title: course.course_id,
              start:course.meeting_times[startKey], // get start time from dictionary
              end: endTime, // get end time from dictionary using the key made for parsing strings
              resource: { credits: Number(course.credits)}, 
              description: course.description // description of the class if you hover over the event
            })
          }
        })
    })
    // these dependencies will run the calendar updater again if there is an update to the event facade so that the check can be ran again if the value changes,
    //and will run the calendar updater again if there is a change in the semester course list
  }, [semesterCourses, eventServicePlugin.eventsFacade])

  // this function will update a refresh variable when the courseLister component notices that an add/remove button is pressed
  const handleAddedCourse = () => {
    setRefresh(k => k+1)
  }
  // constant for credit requirements
  const MAX_CREDITS = 18

  const FULL_TIME_CREDITS = 12

  const totalCredits = semesterCourses.reduce((sum, course) => sum + Number(course.credits || 0), 0) // sums the number of credits in the current semester's courses

  if (!calendar) return <div>Loading calendar...</div>;

  // code for showing the landing page, will pass the major chosen to useState variable
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
        {/* buttons for the top bar of the page, which is fixed to the top of the webpage at all times*/}
        <button onClick={backToCalendar} className="backToCalendar">
          Go Back to your Calendar
        </button>
        <button onClick={() => setShowPlanner(false)} className="backToMainPage">
          Back to Main Page
        </button>
      </div>
      {/* semester tab buttons, all styled in the same way as the other buttons*/}
      <div className="SemesterTabs">
            {SEMESTERS.map((semester_value, i) => ( // create a map of all semester constants. and create a button for each one
              <button className="semesterButtons" key={i} onClick={() => {setCurrentSchedule(i + 1) 
              setRefresh(r => r + 1);}} // update refresh variable for changing which classes are shown in the calendar, and sets the currentSchedule to the schedule picked on the buttons
              style={{fontWeight: currentSchedule === i + 1 ? 'bold' : 'normal'}}>{semester_value}
            </button>
          ))}
      </div>
      {/*this is the calendar component for showing all of the classes the user is taking,
        updated each time a user changes their class list*/}
      <div className="calendarContainer">
      {calendar ? (
        <ScheduleXCalendar calendarApp={calendar} />
      ) : (
        <p>Loading calendar...</p>
      )}
      </div>
      {/*Advisor recommendation bar, with course load, semester offering, and advisor recommendation information for each class in their schedule*/}
      <div className='advisorRec'> 
        <aside>
          <p>
            {/*uses totalCredits function to sum all credits in current semesters class list, and compares that to the constants defined about credit load*/}
            <div className="creditLoadTotal" >Credit Load Total: {totalCredits}</div>
            {totalCredits < FULL_TIME_CREDITS ? <p className='warningText'> You're below the full time credit requirement! </p> : <p> You have enough credits to be a full time student. </p>}
            {totalCredits > MAX_CREDITS ? <p className='warningText'> You might be taking too many classes. Make sure you know what you're setting yourself up for! </p> : <></>}
          </p>
          {/* for each course in the semester course list, show when the class is offered and the advisor recommendations for each*/}
          {semesterCourses.map(course => (
          <div key={course.id} className="course-item">
            <h3>{course.course_id}: {course.name}</h3>
            {/* string is formatted as "FallSpring" for being offered in both semesters, no need to change the string for the fall*/}
            <p><strong>Semesters Offered:</strong> {course.semester === 'FallSpring' ? 'Offered both semesters' : course.semester}</p>
            {course.advisorRecs && (
              <p><strong>Advisor Recommendations:</strong> {course.advisorRecs}</p>
            )}
          </div>
        ))}
        </aside>
      </div>
      {/*course listing component, from the courseLister.tsx file. more information is in that file about this component*/}
      <div className="tableContainer">
        <h1 className="courseTableHeaderText">Pick a Course:</h1>
        <CourseLister
          major={selectedMajor}
          scheduleUsed={currentSchedule}
          attributes={courseColumns}
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
import React, {useState, useEffect, useMemo} from 'react';
import './courseLister.css';
import api from '../api';

interface Course {
    id: number;
    name: string;
    course_id: string;
    description: string;
    enrollment_requirements: string;
    prerequisites: number[];
    meeting_times: Record<string, string>;
    room: string;
    credits: string;
    major: string;
}

type courseListerParams = {
    attributes: string[]
    scheduleUsed: number
    major: string
    onAdded: () => void
}
  // This function will change the meeting time dictionary values into something that is more readable for the user, and display it in the course list
function formatMeetingTimes(meetingTimes: Record<string, string>): string {
  const days = ['Monday','Tuesday','Wednesday','Thursday'];

  // create a map of all meeting times in dictionary
  return days.map(day => {
      // create keys for each entry in dictionary
      const start = meetingTimes[`${day}Start`];

      if (!start) return null; // return null if there is no meeting time

      const end = meetingTimes[`${day}End`] || '';
      
      const startTime = start.split(' ')[1]; 
      const endTime   = end.split  (' ')[1];
      // abbreviate each day for printing purposes
      const dayAbbreviation = day.slice(0,3);
      return `${dayAbbreviation} ${startTime}–${endTime}`;
    })
    .filter(Boolean) // only take days that have a starting/ending time
    .join(', ');
}

export default function CourseLister({attributes, scheduleUsed, major, onAdded} : courseListerParams) {
    const [courses, courseSetter] = useState<Course[]>([]);
    const [changedSchedule, setChangedSchedule] = useState(1); // increments when there is a change to the schedule using the buttons so that the app.tsx can update the calendar
    const [scheduleCoursesMap, setScheduleCoursesMap] = useState<{[scheduleId: number]: Course[]}>({});
    // creates a map with all of the courses and their ids to look up by id, needed dependency to that this changes each time a new course is added so uses a useMemo
    const courseMap = useMemo(() => Object.fromEntries(courses.map(c => [c.id, c])), [courses]) 

    // filter courses by major passed in by App.tsx
  const majorFilter = major || "Computer Science"

    // for pre requisite tracking, create an array of each semester before the semester selected
   useEffect(() => {
    const getPastSemesters = Array.from({length: scheduleUsed}, (_, i) => i + 1)
    getPastSemesters.forEach(id => {
        if (scheduleCoursesMap[id]) return;
    
      // get all courses from these schedules to track prerequisites
    api.get<Course[]>(`/schedules/${id}/courses/`)
         .then((res) => {
          setScheduleCoursesMap((prev) => ({
            ...prev,
            [id]: res.data
          }))
         }).catch(console.error);
    }, [scheduleUsed, changedSchedule]) // dependencies needed for updates on schedule and when a course is added to a schedule
  })

  // Recreates the map of schedules and courses so it's reloaded when you pick any class
  useEffect(() => {
  if (!scheduleUsed) return; // failsafe if there isn't a schedule passed in

    //updates courses in schedules in the current semester and courses past that 
  const courseMapUpdater = async () => {
    const newMap: { [key: number]: Course[] } = {};
    for (let id = 1; id <= scheduleUsed; id++) {
      try {
        const res = await api.get<Course[]>(`/schedules/${id}/courses/`);
        newMap[id] = res.data;
      } catch (e) {
        console.error(e);
      }
    }
    setScheduleCoursesMap(newMap);
  }
  courseMapUpdater();
}, [scheduleUsed, changedSchedule]);

    useEffect(() => {
        api.get('courses/').then(response => {courseSetter(response.data)}).catch(err => console.error(err));
    }, [changedSchedule])
    // need to add list of schedules from the schedule buttons on the bottom of the page
    
    //returns a boolean value if the pre-requisites of a course are met by looking at each previous semester
    function prereqsMet(course: Course): boolean {
        const priorSchedules = Object.entries(scheduleCoursesMap).filter(([key]) => Number(key) < scheduleUsed).map(([, arr]) => arr)
        const takenIds = new Set<number>(
            priorSchedules.flatMap(arr => arr.map(c => c.id))
        )
        return course.prerequisites.every(pr => takenIds.has(pr)); // return true if each prerequisite has the ids of a taken class in the past
    }

    const addToSchedule = (coursePrimaryKey: number): void => {
        setChangedSchedule(changedSchedule + 1);
        api.post(`schedules/${scheduleUsed}/courses/`, {course: coursePrimaryKey}).then(() => {
            onAdded()
            setChangedSchedule(prev => prev + 1)
        }) // onAdded triggers reloading of schedule, passed back up to App.tsx
    }
    const removeFromSchedule = (coursePrimaryKey: number): void => {
        api.delete(`schedules/${scheduleUsed}/courses/`, {data: {course: coursePrimaryKey}}).then(() => onAdded() ) // onAdded triggers reloading of schedule
    }

    const courseList = courses.filter(c => {
        return c.major === majorFilter
    });
    

    return (
        <table className="courseList">
            <thead>
            <tr>
                {attributes.map(attrval => (
                    <th
                        key = {attrval}
                    >
                        {attrval.replace(/_/g, ' ')}    
                    </th>
                    
                ))}
                <th>Prerequisites</th>
                <th>Add Class</th>
                <th>Remove Class</th>
            </tr>
            </thead>
      <tbody>
        {courseList.map(course => {
          const prereqsTaken = prereqsMet(course); // boolean variable for if the current courses prerequisites are met
            // the prerequisites listed out in a coulmn view so that the user can see the prerequisites
            const prereqCourseIDs = course.prerequisites.length ? course.prerequisites.map(id => courseMap[id].course_id ?? `${id}`).join(', ') : 'None';

          return (
            <tr key={course.id}>
              {attributes.map(attrval => (
                <td key={`${course.id}-${attrval}`}>
                  {/* if the row of data we are on are the meeting times, return the formatted meeting times*/}
                  {attrval === 'meeting_times'
                    ? formatMeetingTimes(course.meeting_times)
                    : String((course as any)[attrval])}
                </td>
              ))}
              <td>{prereqCourseIDs}</td>
              <td className='buttonText'>
                <button
                  className="addButton"
                  disabled={!prereqsTaken}
                  onClick={() => addToSchedule(course.id)}
                >
                  {prereqsTaken ? 'Add' : 'Missing Prereqs'}
                </button>
              </td>
              <td className='buttonText'>
                <button
                  className="removeButton"
                  onClick={() => removeFromSchedule(course.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          );
        })}
            </tbody>
        </table>
    );
}
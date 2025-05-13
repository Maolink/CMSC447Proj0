import React, {useState, useEffect, useMemo} from 'react';
import './courseLister.css';
import api from '../api';

type Mt = Record<string,string>;

interface Course {
    id: number;
    name: string;
    course_id: string;
    description: string;
    enrollment_requirements: string;
    prerequisites: number[];
    meeting_times: Mt;
    room: string;
    credits: string;
    major: string;
}

type courseListerParams = {
    columns: string[]
    scheduleUsed: number
    major: string
    onAdded: () => void
}

function formatMeetingTimes(mt: Mt): string {
  const days = ['Monday','Tuesday','Wednesday','Thursday'];

  return days.map(day => {
      const start = mt[`${day}Start`];
      if (!start) return null;
      const end = mt[`${day}End`] || '';
      
      const startTime = start.split(' ')[1]; 
      const endTime   = end.split  (' ')[1];
      
      const dayAbbrev = day.slice(0,3);
      return `${dayAbbrev} ${startTime}–${endTime}`;
    })
    .filter(Boolean)                         // drop any nulls
    .join(', ');
}

export default function CourseLister({columns, scheduleUsed, major, onAdded} : courseListerParams) {
    const [courses, courseSetter] = useState<Course[]>([]);
    const [loading, loadingSetter] = useState(true);
    const [addedToSchedule, setAddedToSchedule] = useState(1);
    const [scheduleCoursesMap, setScheduleCoursesMap] = useState<{[scheduleId: number]: Course[]}>({});
    
    const courseMap = useMemo(() => Object.fromEntries(courses.map(c => [c.id, c])), [courses]) // creates a map with all of the courses and their ids to look up by id

    
    var majorFilter = ""

    if (major === "") {
        majorFilter = "Computer Science"
    } else (majorFilter = major)

   useEffect(() => {
    const semestersToFetch = Array.from({length: scheduleUsed}, (_, i) => i + 1)
    semestersToFetch.forEach(id => {
        if (scheduleCoursesMap[id]) return;
    

    api.get<Course[]>(`/schedules/${id}/courses/`)
         .then((res) => {
          setScheduleCoursesMap((prev) => ({
            ...prev,
            [id]: res.data
          }))
         }).catch(console.error);
    }, [scheduleUsed, addedToSchedule])
  })

  useEffect(() => { // Recreates the map of schedules and courses so it's reloaded when you pick any class
  if (!scheduleUsed) return;

  (async () => {
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
  })();
}, [scheduleUsed, addedToSchedule]);

    useEffect(() => {
        api.get('courses/').then(response => {courseSetter(response.data)}).catch(err => console.error(err));
    }, [addedToSchedule])
    // need to add list of schedules from the schedule buttons on the bottom of the page
    
    function prereqsMet(course: Course): boolean {
        const priorSchedules = Object.entries(scheduleCoursesMap).filter(([key]) => Number(key) < scheduleUsed).map(([, arr]) => arr)
        const takenIds = new Set<number>(
            priorSchedules.flatMap(arr => arr.map(c => c.id))
        )
        return course.prerequisites.every(pr => takenIds.has(pr));
    }

    const addToSchedule = (coursePrimaryKey: number): void => {
        setAddedToSchedule(addedToSchedule + 1);
        api.post(`schedules/${scheduleUsed}/courses/`, {course: coursePrimaryKey}).then(() => {
            onAdded()
            setAddedToSchedule(prev => prev + 1)
        }) // onAdded triggers reloading of schedule
    }
    const removeFromSchedule = (coursePrimaryKey: number): void => {
        api.delete(`schedules/${scheduleUsed}/courses/`, {data: {course: coursePrimaryKey}}).then(() => onAdded() ) // onAdded triggers reloading of schedule
    }

    const courseList = courses.filter(c => {
        return c.major === major
    });

    return (
        <table className="courseList">
            <thead>
            <tr>
                {columns.map(col => (
                    <th
                        key = {col}
                    >
                        {col.replace(/_/g, ' ')}    
                    </th>
                    
                ))}
                <th>Prerequisites</th>
                <th>Add Class</th>
                <th>Remove Class</th>
            </tr>
            </thead>
      <tbody>
        {courseList.map(course => {
          const ok = prereqsMet(course);

            const prereqCourseIDs = course.prerequisites.length ? course.prerequisites.map(id => courseMap[id].course_id ?? `${id}`).join(', ') : 'None';

          return (
            <tr key={course.id}>
              {columns.map(col => (
                <td key={`${course.id}-${col}`}>
                  {col === 'meeting_times'
                    ? formatMeetingTimes(course.meeting_times)
                    : String((course as any)[col])}
                </td>
              ))}
              <td>{prereqCourseIDs}</td>
              <td className='buttonText'>
                <button
                  className="addButton"
                  disabled={!ok}
                  onClick={() => addToSchedule(course.id)}
                >
                  {ok ? 'Add' : 'Missing Prereqs'}
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
    // const createCourse = (courseData) => {
    //     api.post('courses/', courseData).then(response => setCourses())
    // }
}
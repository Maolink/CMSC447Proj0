import React, {useState, useEffect} from 'react';
import './courseLister.css';
import api from '../api';

interface Course {
    id: number;
    name: string;
    course_id: string;
    description: string;
    enrollment_requirements: string;
    meeting_times: string;
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

type Mt = Record<string,string>;

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
    const [courses, courseSetter] = useState<any[]>([]);
    const [loading, loadingSetter] = useState(true);
    
    var majorFilter = ""

    if (major === "") {
        majorFilter = "Computer Science"
    } else (majorFilter = major)

   
    useEffect(() => {
        api.get('courses/').then(response => {courseSetter(response.data)}).catch(err => console.error(err));
    }, [])
    // need to add list of schedules from the schedule buttons on the bottom of the page
    
    const addToSchedule = (coursePrimaryKey: number): void => {
        api.post(`schedules/${scheduleUsed}/courses/`, {course: coursePrimaryKey}).then(() => onAdded()) // onAdded triggers reloading of schedule
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
                <th>Add Class</th>
                <th>Remove Class</th>
            </tr>
            </thead>
            <tbody>
                {courseList.map(course => (
                    <tr key={course.id}>
                    {columns.map(col => (
                    <td key={`${course.id}-${col}`}>
                        {col === 'meeting_times' ? formatMeetingTimes(course.meeting_times) : JSON.stringify(course[col]).replace(/^{|}$|^"|"$/g, '') /* regex will get rid of curly braces and quotation marks at the start and end of the attributes for the database, and format meeting times to look better*/}
                    </td>
                ))}
                <td>
                    <button onClick={() => addToSchedule(course.id)} className="addButton"> Add To Schedule</button>
                </td>
                <td>
                    <button onClick={() => removeFromSchedule(course.id)} className="removeButton">Remove From Schedule</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
    // const createCourse = (courseData) => {
    //     api.post('courses/', courseData).then(response => setCourses())
    // }
}
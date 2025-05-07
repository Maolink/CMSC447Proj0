import React, {useState, useEffect} from 'react';
import api from '../api'

interface Course {
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
    currentSchedule: number
}

export default function CourseLister({columns, currentSchedule} : courseListerParams) {
    const [courses, courseSetter] = useState<any[]>([]);
    const [loading, loadingSetter] = useState(true);


    useEffect(() => {
        api.get('courses/').then(response => {courseSetter(response.data)}).catch(err => console.error(err));
    })
    // need to add list of schedules from the schedule buttons on the bottom of the page
    const addToSchedule = (coursePrimaryKey: number): void => {
        api.post('schedule/${currentSchedule}/courses', {course: coursePrimaryKey}).then()
    }

    return (
        <table>
            <thead>
            <tr>
                {columns.map(col => (
                    <th
                        key = {col}
                        style ={{ border: '1px solid #ccc', padding: '8px', textTransform: 'capitalize'}}
                    >
                        {col.replace(/_/g, ' ')}    
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
                {courses.map((course, i) => (
                    <tr key={i}>
                    {columns.map(col => (
                    <td key={course} style= {{border: '1px solid #eee', padding: '8px'}}>
                        {JSON.stringify(course[col]).replace(/^{|}$|^"|"$/g, '')/* regex will get rid of curly braces and quotation marks at the start and end of the attributes for the database*/}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
    // const createCourse = (courseData) => {
    //     api.post('courses/', courseData).then(response => setCourses())
    // }
}
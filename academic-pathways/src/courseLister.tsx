import React, {useState, useEffect} from 'react';
import api from './api'

export default function courselister() {
    const [courses, courseSetter] = useState([]);
    const [loading, loadingSetter] = useState(true);

    useEffect(() => {
        api.get('courses/').then(response => courseSetter[response.data]).catch(err => console.error(err));

    })

    const createCourse = (courseData) => {
        api.post('courses/', courseData).then(response => setCourses())
    }
}
import React, { useState } from "react"; //used to track form input

const CreateCourseForm = ({ onCourseCreated }) => {//react functional component
    const[formData, setFormData] = useState({ //swallows all userinput for CollegeCourse data fields
        name: "",
        major: "",
        course_id: "",
        credits: "",
        description: "",
        enrollment_requirements: "",
        meeting_times: {},
        room: "",
        prerequisites: [],
    });

    const handleSubmit = async (e) => { //interacts with django API
        e.preventDefault();
        const res = await fetch("http://localhost:8000/api/courses/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        onCourseCreated?.(data); 
    };

    return (//took forever to figure out, each input field updates portion of formData object when user types
        <form onSubmit={handleSubmit}>
          <input placeholder="Course Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input placeholder="Course ID" onChange={(e) => setFormData({ ...formData, course_id: e.target.value })} />
          <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <input placeholder="Enrollment Requirements" onChange={(e) => setFormData({ ...formData, enrollment_requirements: e.target.value })} />
          <input placeholder="Room" onChange={(e) => setFormData({ ...formData, room: e.target.value })} />
          <button type="submit">Create Course</button>
        </form>
      );
};

export default CreateCourseForm;
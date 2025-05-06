export const addCourseToSchedule = async (scheduleId, courseId) => {
    const res = await fetch(`http://localhost:8000/api/schedules/${scheduleId}/`);
    const schedule = await res.json();
  
    const updatedCourses = [...schedule.courses, courseId];
  
    await fetch(`http://localhost:8000/api/schedules/${scheduleId}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...schedule,
        courses: updatedCourses,
      }),
    });
  };
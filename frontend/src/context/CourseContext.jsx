// CourseProvider.jsx
import React, { useState, useEffect, createContext } from 'react';
import * as courseApi from '../api/courseApi';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses();
      setCourses(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (data) => {
    const response = await courseApi.createCourse(data);
    setCourses((prev) => [...prev, response]);
    return response;
  };

  const updateCourse = async (id, data) => {
    const response = await courseApi.updateCourse(id, data);
    setCourses((prev) => prev.map((c) => (c._id === id ? response : c)));
    return response;
  };

  const deleteCourse = async (id) => {
    await courseApi.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CourseContext.Provider value={{ courses, loading, fetchCourses, addCourse, updateCourse, deleteCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

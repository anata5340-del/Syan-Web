"use client";

import { getCourse, getCourses } from "@/backend/services/courses";
import CourseCard from "@/frontend/components/courseCard/CourseCard";
import axios from "axios";
import { useEffect, useState } from "react";

type Course = {
  _id: string;
  name: string;
  isQuiz: boolean;
  image: string;
  color: string;
  updatedAt: string;
  isAccessible: boolean;
  totalEnrolled: number;
  duration: string;
};

// const courses = [
//   { title: 'FCPS', imageUrl: '/assets/img/icon36.png', overlayColor: '#301501', isAccessible: true, totalEnrolled: 2440, duration: '2hrs' },
//   { title: 'MBBS', imageUrl: '/assets/img/icon36.png', overlayColor: '#012E4F', isAccessible: false, totalEnrolled: 2440, duration: '2hrs' },
//   { title: 'BDS', imageUrl: '/assets/img/icon36.png', overlayColor: '#440208', isAccessible: false, totalEnrolled: 2440, duration: '2hrs' },
// ];

const basePath = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export default function Quiz() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const getQuizCourses = () => {
    axios
      .get(`/api/quizes`)
      .then(({ data }) => {
        const coursesList = data?.quizes?.map((course: Course) => ({
          ...course,
          isQuiz: true,
          totalEnrolled: 2440,
          duration: "2hrs",
        }));
        coursesList.sort((a: Course, b: Course) => {
          return (b.isAccessible ? 1 : 0) - (a.isAccessible ? 1 : 0);
        });
        setCourses(coursesList);
      })
      .catch((error) => {
        console.log("getCategories error : ", error);
      });
  };
  useEffect(() => {
    getQuizCourses();
  }, []);

  return (
    <>
      <div>
        <div className="flex justify-center py-5">
          <h2 className="text-3xl font-semibold">Quiz Courses</h2>
        </div>

        <div className="grid grid-cols-3 gap-10 w-full mb-10">
          {courses?.map((course, index) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={course.name}
              isQuiz={course.isQuiz}
              imageUrl={course.image}
              overlayColor={course.color}
              isAccessible={course.isAccessible}
              totalEnrolled={2440}
              duration={course.duration}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'faculty' | 'student';
  name: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    course_name: string;
    faculty: string;
    room: string;
    type: 'theory' | 'lab';
  };
}

export interface StudentTimetable {
  student_id: string;
  student_name: string;
  events: CalendarEvent[];
}

export interface FacultyTimetable {
  faculty_id: string;
  faculty_name: string;
  events: CalendarEvent[];
}

export interface AdminTimetable {
  term_id: string;
  term_name: string;
  generated_at: string;
  timetables: {
    [batch_id: string]: {
      batch_name: string;
      events: CalendarEvent[];
    };
  };
}

export interface AppState {
  currentUser: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  currentView: 'login' | 'dashboard' | 'timetable' | 'upload';
  selectedBatch: string;
  timetableData: StudentTimetable | FacultyTimetable | AdminTimetable | null;
}

export interface Course {
  course_id: string;
  course_code: string;
  course_name: string;
  credits: number;
  branch: string;
  year: number;
  type: 'theory' | 'lab';
}

export interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  branch: string;
  year: number;
  batch: string;
  roll_no: string;
}

export interface Faculty {
  faculty_id: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  specialization: string;
}

export interface Room {
  room_id: string;
  room_code: string;
  room_type: 'lecture_hall' | 'lab';
  capacity: number;
  branch?: string;
}

export interface CollegeStats {
  total_students: number;
  total_faculty: number;
  total_courses: number;
  total_rooms: number;
  branches: {
    [key: string]: {
      students: number;
      faculty: number;
      courses: number;
    };
  };
}

export enum UserRole {
  STUDENT = 'STUDENT',
  SENIOR = 'SENIOR'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum EducationLevel {
  SCHOOL = 'SCHOOL',
  COLLEGE = 'COLLEGE'
}

export enum SeniorStatus {
  EMPLOYED = 'EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED'
}

export interface UserProfile {
  name: string;
  age: number;
  mobile: string;
  email: string;
  gender: Gender;
  role: UserRole;
  educationLevel?: EducationLevel;
  seniorStatus?: SeniorStatus;
}

export interface StudySchedule {
  subject: string;
  topics: {
    name: string;
    startTime: string;
    endTime: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  isExamTomorrow: boolean;
}

export interface MedSchedule {
  disease: string;
  medication: string;
  description: string;
  dosageTime: string;
}

export interface PracticeQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

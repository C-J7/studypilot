# API Endpoints Documentation

## Table of Contents
- [Syllabus Endpoints](#syllabus-endpoints)
- [Study Plan Endpoints](#study-plan-endpoints)

---

## Syllabus Endpoints

### 1. Upload Syllabus

- **Endpoint:** `POST /api/syllabus/upload`
- **Description:** Upload a syllabus PDF and related metadata.
- **Request Type:** `multipart/form-data`
- **Required Parameters:**

  | Key         | Type   | Description                        | Example Value         |
  |-------------|--------|------------------------------------|----------------------|
  | file        | File   | PDF file to upload                 | syllabus.pdf         |
  | title       | Text   | Title of the syllabus              | "Physics 101"        |
  | faculty     | Text   | Faculty name                       | "Science"            |
  | department  | Text   | Department name                    | "Physics"            |
  | semester    | Text   | Semester                           | "Spring 2025"        |
  | userId      | Text   | User ID of uploader                | "testuser"           |

- **Example Request (Postman form-data):**
  ```
  file:        (choose file)
  title:       Physics 101
  faculty:     Science
  department:  Physics
  semester:    Spring 2025
  userId:      testuser
  ```

- **Expected Response (200 OK):**
  ```json
  {
    "id": 1,
    "title": "Physics 101",
    "faculty": "Science",
    "department": "Physics",
    "semester": "Spring 2025",
    "userId": "testuser",
    "topics": ["Kinematics", "Dynamics", ...],
    "createdAt": "2025-05-21T10:00:00"
  }
  ```

---

### 2. Get Syllabi

- **Endpoint:** `GET /api/syllabus`
- **Description:** Retrieve all syllabi, optionally filter by faculty, department, or semester.
- **Query Parameters (optional):**
  - `faculty` (string)
  - `department` (string)
  - `semester` (string)

- **Example Request:**
  ```
  GET /api/syllabus?faculty=Science&department=Physics
  ```

- **Expected Response:**
  ```json
  [
    {
      "id": 1,
      "title": "Physics 101",
      "faculty": "Science",
      "department": "Physics",
      "semester": "Spring 2025",
      "userId": "testuser",
      "topics": ["Kinematics", "Dynamics", ...],
      "createdAt": "2025-05-21T10:00:00"
    },
    ...
  ]
  ```

---

## Study Plan Endpoints

### 1. Generate Study Plan

- **Endpoint:** `POST /api/study-plan/generate`
- **Description:** Generate a study plan based on a syllabus and user preferences.
- **Request Type:** `application/json`
- **Required JSON Body:**

  | Field       | Type   | Description                        | Example Value         |
  |-------------|--------|------------------------------------|----------------------|
  | syllabusId  | Long   | ID of the syllabus                 | 1                    |
  | startDate   | String | Start date (YYYY-MM-DD)            | "2025-06-01"         |
  | endDate     | String | End date (YYYY-MM-DD)              | "2025-06-30"         |
  | userId      | String | User ID                            | "testuser"           |
  | busyHours   | Object | Map of date to busy hour DTO       | See below            |

- **BusyHourDTO Structure:**
  ```json
  {
    "start": "2025-06-05T09:00:00",
    "end": "2025-06-05T12:00:00"
  }
  ```

- **Example JSON Body:**
  ```json
  {
    "syllabusId": 1,
    "startDate": "2025-06-01",
    "endDate": "2025-06-30",
    "userId": "testuser",
    "busyHours": {
      "2025-06-05": {
        "start": "2025-06-05T09:00:00",
        "end": "2025-06-05T12:00:00"
      },
      "2025-06-10": {
        "start": "2025-06-10T14:00:00",
        "end": "2025-06-10T16:00:00"
      }
    }
  }
  ```

- **Expected Response:**
  ```json
  {
    "planId": 42,
    "sessions": [
      {
        "id": 1,
        "topic": "Kinematics",
        "startTime": "2025-06-01T10:00:00",
        "endTime": "2025-06-01T12:00:00",
        "completed": false,
        "reminderSent": false
      },
      ...
    ],
    "startDate": "2025-06-01",
    "endDate": "2025-06-30",
    "userId": "testuser"
  }
  ```

---



## Error Responses

- **400 Bad Request:** Missing or invalid parameters.
- **401 Unauthorized:** If authentication is enabled and not provided.
- **500 Internal Server Error:** Server-side error or exception.

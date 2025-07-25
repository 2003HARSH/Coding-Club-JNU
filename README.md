
# JNU Coding Club Attendance System

## Overview

The **JNU Coding Club Attendance System** is a comprehensive web application designed to simplify attendance management for trainers and students. This application enables trainers to set attendance timings, allows students to mark attendance online, and ensures easy access to attendance records for both parties.

---

## Features

- **Trainer Profile Page**: Trainers can view all students enrolled in the subjects they handle.
- **Session Uniqueness**: If an active session already exists for a subject, another session cannot be started until the previous one ends.
- **Location-Based Attendance**: Students can only mark attendance if they are within the geofenced location of the trainer.
- **Session Code & Subject Code Verification**: Attendance is validated using session and subject codes to ensure integrity.
- **Attendance Timing Management**: Trainers can set specific timings for attendance.
- **Online Attendance Marking**: Students can mark their attendance from anywhere using the application.
- **Attendance Records Access**: Trainers and students can view attendance records seamlessly.
- **Secure Database Storage**: Attendance data is securely stored in a MongoDB database.
- **CI/CD Integration**: A CI/CD pipeline ensures smooth integration and deployment workflows.
- **Containerization**: The application is fully containerized using Docker for consistent deployment.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js,Express.js
- **Database**: MongoDB
- **Version Control**: GitHub
- **Deployment**: Netlify, AWS (future plans to deploy via Amazon ECR/ECS using AWS CodeDeploy)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose

---

## Installation

To set up the project locally, follow these steps:

### Clone the Repository:
```bash
git clone https://github.com/2003HARSH/Coding-Club-JNU.git
cd Coding-Club-JNU
```

### Docker Compose Setup:
Ensure Docker and Docker Compose are installed on your system. Use the following command to run the application:

```bash
docker-compose --env-file ./backend/.env up --build
```

This command will:
- Build and run both frontend and backend Docker containers.
- Expose the frontend on port `3000` and the backend on port `5000`.

---

## Usage

### For Trainers:
- Log in to the admin panel to:
  - Set attendance timings.
  - View attendance records.
  - View students enrolled in their subjects.
  - Prevent multiple sessions from starting for the same subject.

### For Students:
- Register and log in to:
  - Mark attendance online.
  - Mark attendance only if within the required location boundary.
  - Enter valid subject and session codes.
  - View personal attendance records.

---

## Docker Images

### Frontend
Pull the latest Docker image for the frontend:
```bash
docker pull 2003harsh/jnu-coding-studio:frontend
```

Run the frontend container:
```bash
docker run -d -p 3000:3000 2003harsh/jnu-coding-studio:frontend
```

### Backend
Pull the latest Docker image for the backend:
```bash
docker pull 2003harsh/jnu-coding-studio:backend
```

Run the backend container:
```bash
docker run -d -p 5000:5000 -e <MONGODB_URI> 2003harsh/jnu-coding-studio:backend
```

---

## CI/CD and Deployment

- **CI/CD Integration**: The project uses GitHub Actions to automate testing, containerization, and deployment. Any changes pushed to the `main` branch are automatically built and tested.
- **Future Deployment Plans**:
  - Deploy the application to **Amazon Elastic Container Registry (ECR)** and **Amazon Elastic Container Service (ECS)** using **AWS CodeDeploy** for scalable, cloud-based deployment.

---

## Future Plans

1. **Enhanced Deployment**: 
   - Transition to **AWS ECR and ECS** for hosting and managing containerized applications. 
   - Automate deployments with **AWS CodeDeploy** for seamless integration and scaling.
2. **New Features**: Add advanced functionalities such as analytics dashboards for attendance trends and notifications for students.
3. **Mobile Support**: Develop a mobile-friendly version or dedicated mobile app to increase accessibility.

---

## Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add your feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For questions or feedback, feel free to reach out:
- **Email**: harshnkgupta@gmail.com  
- **Email**: jitripathi426@gmail.com  

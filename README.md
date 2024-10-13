# JNU Coding Club Attendance System

## Overview
The JNU Coding Club Attendance System is a web application designed to streamline the attendance marking process for trainers and students. This project enables trainers to set attendance timings, allows students to mark their attendance online, and ensures that attendance records are easily accessible to both parties. Additionally, new students will automatically receive a WhatsApp group invitation upon marking their first attendance.

## Features
- **Attendance Timing Management**: Trainers can set specific timings for attendance.
- **Online Attendance Marking**: Students can mark their attendance from anywhere.
- **Attendance Records Access**: Both trainers and students can view attendance records.
- **Automatic WhatsApp Invitations**: New students receive a WhatsApp group invitation after marking their first attendance.
- **Online Database Storage**: Attendance data is securely stored in a MongoDB database.
- **Tech Stack**:
  - **Frontend**: HTML, CSS, JavaScript
  - **Backend**: Node.js
  - **Database**: MongoDB
  - **Version Control**: GitHub
  - **Deployment**: Netlify, AWS
- **Continuous Integration/Continuous Deployment (CI/CD)**: A CI/CD pipeline is implemented to ensure seamless integration and deployment.
- **Containerization**: The application is containerized using Docker.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   https://github.com/2003HARSH/Coding-Club-JNU.git
   cd Coding-Club-JNU
   ```

2. Set up the backend:
   - Navigate to the backend directory.
   - Install the required dependencies:
     ```bash
     npm install
     ```
   - Configure your environment variables for database connection.

3. Set up the frontend:
   - Navigate to the frontend directory.
   - Install the required dependencies:
     ```bash
     npm install
     ```

4. Run the application:
   - Start the backend server:
     ```bash
     node server.js
     ```
   - Start the frontend application:
     ```bash
     npm start
     ```

5. Access the application:
   Open your web browser and go to `http://localhost:3000`.

## Usage

- **For Trainers**:
  - Log in to the admin panel to set attendance timings and view records.

- **For Students**:
  - Register and log in to mark your attendance and view your records.

## CI/CD and Deployment

This project uses GitHub Actions for CI/CD, ensuring that any changes pushed to the main branch are automatically tested, containerized and deployed to production environment.

## Docker

To run the application in a container, use the following commands:

1. Pull the Docker image from dockerhub:
   ```bash
   docker pull 2003harsh/attendance-system-frontend:latest
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 2003harsh/attendance-system-frontend:latest
   ```

## Contributing

We welcome contributions! If you would like to contribute to the project, please follow these steps:

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Special thanks to the JNU Coding Club for the inspiration and support.
- Thanks to all contributors for their efforts in making this project a success.

## Contact

For questions or feedback, please reach out to [harshnkgupta@gmail.com](mailto:harshnkgupta@gmail.com) OR [jitripathi426@gmail.com](mailto:jitripathi426@gmail.com) 

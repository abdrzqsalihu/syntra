# Syntra
Syntra is a modern audio and video meeting management application designed to make scheduling, joining, and recording meetings effortless. Built with a focus on efficiency, security, and user experience,

## Features
- **Instant Meetings:** Start meetings on the fly with just one click.
- **Join Meetings:** Easily join via invitation links.
- **Schedule Meetings:** Plan and organize meetings ahead of time.
- **View Recordings:** Access and manage past meeting recordings.

## Tech Stack
- **Framework:** Next.js
- **Styling:** Tailwind CSS, Shadcn
- **In-App Video & Audio:** Stream
- **Authentication:** Clerk Auth


## Getting Started

## Installation  

### Prerequisites  
- Node.js installed on your machine.  
- An account with **Stream** and **Clerk Auth** for API configuration.  

### Steps  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/yourusername/syntra.git  
   ```  
2. Navigate to the project directory:  
   ```bash  
   cd syntra  
   ```  
3. Install dependencies:  
   ```bash  
   npm install  
   ```  
4. Configure environment variables:  
   - Create a `.env.local` file in the root directory.  
   - Add the following variables:  
     ```env  
     NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>  
     CLERK_API_KEY=<your-clerk-api-key>  
     STREAM_API_KEY=<your-stream-api-key>  
     STREAM_SECRET=<your-stream-secret>  
     ```  

5. Start the development server:  
   ```bash  
   npm run dev  
   ```  

## Usage  
1. **Start Instant Meetings**: Launch the app and click "New Meeting."  
2. **Join Meetings**: Paste the invitation link into the "Join Meeting" field.  
3. **Schedule Meetings**: Use the "Schedule Meeting" feature to plan ahead.  
4. **View Recordings**: Navigate to "View Recordings" to revisit past meetings.  

## Contributing  
Contributions are welcome! To contribute:  
1. Fork the repository.  
2. Create a feature branch:  
   ```bash  
   git checkout -b feature-name  
   ```  
3. Commit your changes:  
   ```bash  
   git commit -m "Add feature description"  
   ```  
4. Push to your branch:  
   ```bash  
   git push origin feature-name  
   ```  
5. Open a Pull Request.  

## License  
This project is licensed under the [MIT License](LICENSE).  

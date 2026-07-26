# SafeCommute 🚗

Evidence-based WFH request management system.

SafeCommute helps employees request work from home when commuting conditions are unsafe using weather data, GPS location, and evidence photos.

## Live Demo

Frontend:
https://safe-commute-beta.vercel.app

Backend API:
https://safecommute-backend-h192.onrender.com/docs


## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- React Router
- Leaflet Maps

Backend:
- FastAPI
- Python
- SQLAlchemy
- Pydantic

Database/Auth:
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage

External Services:
- OpenWeather API
- Gmail SMTP

Deployment:
- Vercel
- Render


## Features

- Role-based authentication
- Employee WFH request submission
- GPS based location tracking
- Road image evidence upload
- Weather data integration
- Risk scoring algorithm (0-100)
- Manager approval workflow
- Email notifications


## Risk Scoring

The system calculates travel risk using:

- Weather: 40%
- Traffic: 30%
- Flood risk: 20%
- Image evidence: 10%


## Testing

Backend automated tests using:

- pytest
- mocked API calls
- router workflow tests


## Local Setup

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
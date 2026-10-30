# Aspen Class Booker

Act as a senior full-stack web developer.

Build a responsive "Online Class Booking System" web app prototype for an education center website (Aspen Education Malaysia) based on the link (https://aspeneducation.com.my/).

### 🎯 Goal:

Allow parents to easily book trial classes or consultations online, replacing manual booking via WhatsApp/email.

---

### 🧩 Core Features:

1. Booking Form:

- Parent Name

- Phone Number

- Email

- Child Name

- Child Age

- Program Selection (Dropdown: English, Math, Phonics, etc.)

- Preferred Date

- Preferred Time Slot

2. Smart Scheduling:

- Display only available time slots

- Prevent double booking

- Allow admin to define available slots

3. Confirmation System:

- Show success message after submission

- Send email confirmation (simulate or mock API)

- Include booking details in confirmation

4. Admin Panel (Simple):

- View all bookings in a table

- Columns: Name, Child, Program, Date, Time, Contact

- Ability to delete or mark as completed

5. Data Storage:

- Use simple backend (Node.js + Express OR Firebase)

- Store bookings in database (MongoDB or Firebase Firestore)

---

### 🎨 UI/UX Requirements:

- Clean, modern, mobile-friendly design

- Use card-based layout

- Clear CTA: "Book a Trial Class"

- Step-by-step booking experience

- Validation for all fields

---

### ⚙️ Tech Stack (Preferred):

Frontend:

- React.js (with hooks)

- Tailwind CSS

Backend:

- Node.js + Express

Database:

- MongoDB (or Firebase as alternative)

---

### 🔄 User Flow:

1. User opens booking page

2. Selects program

3. Chooses available date & time

4. Fills in details

5. Submits form

6. Receives confirmation message

---

### 🧠 Bonus Features (if possible):

- Calendar view for selecting date

- Email notification integration (e.g., Nodemailer)

- Export bookings to CSV

- WhatsApp redirect after booking

---

### 📦 Output Requirements:

- Provide complete working code (frontend + backend)

- Include folder structure

- Include setup instructions

- Use clean and readable code

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://abc-test-education.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7ab8f0ae-e537-4809-a9dc-a3dd08cdf2c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

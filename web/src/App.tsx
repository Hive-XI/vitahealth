import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ClinicShell } from './components/ClinicShell'
import { PatientShell } from './components/PatientShell'
import { AddMed } from './pages/AddMed'
import { Auth } from './pages/Auth'
import { BookFollowUp } from './pages/BookFollowUp'
import { Caregiver } from './pages/Caregiver'
import { ClinicDashboard } from './pages/ClinicDashboard'
import { Consent } from './pages/Consent'
import { Emergency } from './pages/Emergency'
import { EscalationQueue } from './pages/EscalationQueue'
import { Landing } from './pages/Landing'
import { Labs } from './pages/Labs'
import { Meds } from './pages/Meds'
import { PatientDashboard } from './pages/PatientDashboard'
import { PatientDetail } from './pages/PatientDetail'
import { ProfileSetup } from './pages/ProfileSetup'
import { Settings } from './pages/Settings'
import { SymptomChat } from './pages/SymptomChat'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/app" element={<PatientShell />}>
          <Route index element={<PatientDashboard />} />
          <Route path="chat" element={<SymptomChat />} />
          <Route path="chat/emergency" element={<Emergency />} />
          <Route path="meds" element={<Meds />} />
          <Route path="meds/add" element={<AddMed />} />
          <Route path="labs" element={<Labs />} />
          <Route path="labs/follow-up" element={<BookFollowUp />} />
          <Route path="profile" element={<Settings />} />
          <Route path="caregiver" element={<Caregiver />} />
        </Route>
        <Route path="/clinic" element={<ClinicShell />}>
          <Route index element={<ClinicDashboard />} />
          <Route path="queue" element={<EscalationQueue />} />
          <Route path="patients/:id" element={<PatientDetail />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

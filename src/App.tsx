import { Routes, Route } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import BootGate from './components/BootGate';
import { LocationGate } from './components/LocationPicker';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Book from './pages/Book';
import BookingSuccess from './pages/BookingSuccess';
import CompanyProfile from './pages/CompanyProfile';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';
import Reschedule from './pages/Reschedule';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminServices from './pages/admin/AdminServices';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <LocationProvider>
      <BootGate>
        <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings/:id" element={<AdminBookingDetail />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/reschedule/:token" element={<Reschedule />} />
        <Route
          element={
            <LocationGate>
              <Layout />
            </LocationGate>
          }
        >
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="book" element={<Book />} />
          <Route path="booking/success" element={<BookingSuccess />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="leadership" element={<Leadership />} />
          <Route path="about" element={<CompanyProfile />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        </Routes>
      </BootGate>
    </LocationProvider>
  );
}

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Shared Components
import Header from './assets/components/Header';
import Hero from './assets/components/Hero';
import Services from './assets/components/Services';
import HowItWorks from './assets/components/How It Works';
import About from './assets/components/About';
import Footer from './assets/components/Footer';

// Pages
import Login from './assets/pages/Login';
import SignUp from './assets/pages/SignUp';
import AdminLogin from './assets/pages/AdminLogin';
import ContactForm from './assets/pages/ContactForm';
import AboutUs from './assets/pages/AboutUs';
import ForgotPassword from './assets/pages/forgot-password';
import VerifyEmail from './assets/pages/VerifyEmail';
import Dashboard from './assets/pages/Dashboard';
import Terms from './assets/pages/Terms';
import ProfilePage from './assets/pages/ProfilePage';
import OrderHistory from './assets/pages/OrderHistory';
import Basket from "./assets/pages/Basket";
import Delivery from "./assets/pages/Delivery";  
import DeliveryAddress from "./assets/pages/DeliveryAddress";  
import UploadFiles from "./assets/pages/UploadFiles";  
import Payment from "./assets/pages/Payment";
import Layout from "./assets/pages/Layout";
import TemplateDetail from './assets/pages/TemplateDetail';
import OrderConfirmed from './assets/pages/OrderConfirmed';
import AdminDashboard from './assets/pages/AdminDashboard';
import AdminOrderHistory from './assets/pages/AdminOrderHistory';
import UserList from './assets/pages/UserList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
          <>
            <Header />
            <Hero />
            <Services />
            <HowItWorks />
            <About />
            <Footer />
          </>
        } />

        {/* Contact Page */}
        <Route path="/contact" element={
          <>
            <Header />
            <ContactForm />
            <Footer />
          </>
        } />

        {/* About Us Page */}
        <Route path="/aboutus" element={
          <>
            <Header />
            <AboutUs />
            <Footer />
          </>
        } />

        {/* Terms & Privacy Policy (Separate Routes) */}
        <Route path="/terms" element={
          <>
            <Header />
            <Terms />
          </>
        } />
        <Route path="/privacy" element={
          <>
            <Header />
            <Terms />
          </>
        } />

        <Route path="/upload/:service" element={
          <>
            <Header />
            <UploadFiles />
          </>
        } />
         <Route path="/upload" element={
          <>
            <Header />
            <UploadFiles />
          </>
        } />
        <Route path="/basket" element={
          <>
            <Header />
            <Basket />
          </>
        } />
        <Route path="/delivery" element={
          <>
            <Header />
            <Delivery />
          </>
        } />
        <Route path="/deliveryaddress" element={
          <>
            <Header />
            <DeliveryAddress />
          </>
        } />
        <Route path="/payment" element={
          <>
            <Header />
            <Payment />
          </>
        } />
         <Route path="/confirmation" element={
          <>
            <Header />
            <OrderConfirmed />
          </>
        } />
        <Route path="/layout" element={
          <>
            <Header />
            <Layout />
            <Footer />
          </>
        } />
        <Route path="/upload/layout" element={
          <>
            <Header />
            <Layout />
            <Footer />
          </>
        } />
        <Route path="/template/:templateId" element={
        <>
          <Header />
          <TemplateDetail />
        </>
      } />


        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/service" element={<Services />} /> {/* Route for Services */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/upload/:service" element={<UploadFiles />} />
        <Route path="/upload" element={<UploadFiles />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/deliveryaddress" element={<DeliveryAddress />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<OrderConfirmed />} />
        <Route path="/upload/layout" element={<Layout />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin-orderhistory" element={<AdminOrderHistory />} />
         <Route path="/admin/orders" element={<AdminOrderHistory />} />
        <Route path="/users" element={<UserList />} />

      </Routes>
    </Router>
  );
};

export default App;

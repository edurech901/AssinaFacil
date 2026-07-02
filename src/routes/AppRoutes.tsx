import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login'
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Subscriptions from '../pages/Subscriptions/Subscriptions';
import NewSubscription from '../pages/NewSubscription/NewSubscription';
import EditSubscription from '../pages/EditSubscription/EditSubscription';
import SubscriptionDetails from '../pages/SubscriptionDetails/SubscriptionDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/new" element={<NewSubscription />} />
        <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
        <Route path="/subscriptions/:id/edit" element={<EditSubscription />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
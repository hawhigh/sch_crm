import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { Shell } from './components/layout/Shell';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { CurriculumStudio } from './pages/CurriculumStudio';
import { KnowledgeLibrary } from './pages/KnowledgeLibrary';
import { SchoolsClasses } from './pages/SchoolsClasses';
import { InstitutionalCalendar } from './pages/InstitutionalCalendar';
import { Messenger } from './pages/Messenger';
import { StudentDashboard } from './pages/StudentDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';

const queryClient = new QueryClient();

type AppRole = 'owner' | 'coordinator' | 'supervisor' | 'lector' | 'parent' | 'student';

function App() {
  const { user, logout } = useAuth();
  const role = (user?.role?.toLowerCase() || 'lector') as AppRole;

  if (!user) {
    return <Login />;
  }

  // Role-based root dashboard
  const RoleDashboard = () => {
    if (role === 'owner') return <OwnerDashboard />;
    if (role === 'supervisor') return <SupervisorDashboard />;
    if (role === 'coordinator') return <CoordinatorDashboard />;
    if (role === 'parent') return <ParentDashboard />;
    if (role === 'student') return <StudentDashboard />;
    return <Dashboard />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Shell role={role} onLogout={logout}>
          <Routes>
            <Route path="/" element={<RoleDashboard />} />
            <Route path="/lessons" element={<CurriculumStudio />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/library" element={<KnowledgeLibrary />} />
            <Route path="/schools" element={<SchoolsClasses />} />
            <Route path="/calendar" element={<InstitutionalCalendar />} />
            <Route path="/messages" element={<Messenger />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/settings" element={<RoleDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

// ============================================================
// BCH CRM - User Management Page (Manager Only)
// Create, edit, toggle active status of staff/bdc users
// ============================================================

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'bdc' | 'staff' | 'manager';
  specialty: string;
  is_active: boolean;
}

const ROLES: { value: string; label: string }[] = [
  { value: 'bdc', label: 'BDC Caller' },
  { value: 'staff', label: 'Staff' },
  { value: 'manager', label: 'Manager' },
];

const SPECIALTIES = ['BDC', 'E-cycles', 'Gear Cycles', 'Kids/Budget', '2nd Life', 'Service', 'Premium', 'Manager'];

export function UsersPage() {
  const { showToast } = useUIStore();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', specialty: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, name, role, specialty, is_active')
          .order('name');
        if (data) {
          setUsers(data.map(u => ({ ...u, email: '' })) as AppUser[]);
        }
      } catch { /* ignore */ }
    }
    // Always show hardcoded users as fallback
    if (users.length === 0) {
      setUsers([
        { id: '1', name: 'Ibrahim', email: 'ibrahim@bch.com', role: 'manager', specialty: 'Manager', is_active: true },
        { id: '2', name: 'Anushka', email: 'anushka@bch.com', role: 'bdc', specialty: 'BDC', is_active: true },
        { id: '3', name: 'Suma', email: 'suma@bch.com', role: 'staff', specialty: 'E-cycles', is_active: true },
        { id: '4', name: 'Abhi Gowda', email: 'abhi@bch.com', role: 'staff', specialty: 'Gear Cycles', is_active: true },
        { id: '5', name: 'Nithin', email: 'nithin@bch.com', role: 'staff', specialty: 'Kids/Budget', is_active: true },
        { id: '6', name: 'Baba', email: 'baba@bch.com', role: 'staff', specialty: '2nd Life', is_active: true },
        { id: '7', name: 'Ranjitha', email: 'ranjitha@bch.com', role: 'staff', specialty: 'Service', is_active: true },
        { id: '8', name: 'Sunil', email: 'sunil@bch.com', role: 'staff', specialty: 'Premium', is_active: true },
      ]);
    }
    setIsLoading(false);
  };

  const handleCreateUser = async () => {
    if (!form.name || !form.email || !form.password) {
      showToast('Fill all required fields', 'error');
      return;
    }
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: form.email,
          password: form.password,
          email_confirm: true,
        });
        if (authError) {
          // Try regular signup if admin API not available
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
          });
          if (signupError) throw signupError;
          if (signupData.user) {
            await supabase.from('users').insert({
              id: signupData.user.id,
              name: form.name,
              role: form.role,
              specialty: form.specialty || null,
              is_active: true,
            });
          }
        } else if (authData.user) {
          await supabase.from('users').insert({
            id: authData.user.id,
            name: form.name,
            role: form.role,
            specialty: form.specialty || null,
            is_active: true,
          });
        }
      }
      showToast(`User ${form.name} created!`, 'success');
      setForm({ name: '', email: '', password: '', role: 'staff', specialty: '' });
      setShowForm(false);
      await loadUsers();
    } catch (e) {
      showToast(`Failed: ${(e as Error).message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (user: AppUser) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('users').update({ is_active: !user.is_active }).eq('id', user.id);
      } catch { /* ignore */ }
    }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    showToast(`${user.name} ${user.is_active ? 'deactivated' : 'activated'}`, 'info');
  };

  const roleColor = (role: string) => {
    if (role === 'manager') return 'bg-purple-100 text-purple-700';
    if (role === 'bdc') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Users & Logins</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingUser(null); }}
          className="text-xs font-semibold text-white px-4 py-2 bg-primary-500 rounded-xl active:scale-95"
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Create User Form */}
      {showForm && (
        <Card className="p-4 space-y-3 border-2 border-primary-200">
          <h3 className="text-sm font-bold text-gray-700">New User</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name *</label>
            <input
              type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Full name"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email *</label>
            <input
              type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="name@bch.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Password *</label>
            <input
              type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Set password"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Role</label>
            <select
              value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none appearance-none focus:ring-2 focus:ring-primary-300"
            >
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Specialty</label>
            <select
              value={form.specialty} onChange={e => setForm(p => ({ ...p, specialty: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none appearance-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="">Select...</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button variant="success" size="lg" fullWidth onClick={handleCreateUser} disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create User'}
          </Button>
        </Card>
      )}

      {/* Login credentials reference */}
      <Card className="p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Login Credentials</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">Manager (Ibrahim)</span>
            <span className="text-gray-400 font-mono">ibrahim@bch.com / bch2024mgr</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">BDC (Anushka)</span>
            <span className="text-gray-400 font-mono">anushka@bch.com / bch2024bdc</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">Staff (Suma)</span>
            <span className="text-gray-400 font-mono">suma@bch.com / bch2024staff</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">All staff use password: bch2024staff</p>
        </div>
      </Card>

      {/* User list */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading users...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <Card key={user.id} className={`p-3 ${!user.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor(user.role)}`}>
                        {user.role.toUpperCase()}
                      </span>
                      {user.specialty && (
                        <span className="text-[10px] text-gray-400">{user.specialty}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(user)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg active:scale-95 ${
                    user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

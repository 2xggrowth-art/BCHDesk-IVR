// ============================================================
// BCH CRM - User Management Page (Manager Only)
// Create users, toggle active, assign/change PINs
// ============================================================

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import { updateUserPin, addUser } from '@/store/authStore';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import type { UserRole } from '@/types';

interface AppUser {
  id: string;
  name: string;
  role: 'bdc' | 'staff' | 'manager';
  specialty: string;
  is_active: boolean;
  pin?: string;
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
  const [form, setForm] = useState({ name: '', pin: '', role: 'staff', specialty: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [editingPinUserId, setEditingPinUserId] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('users')
          .select('id, name, role, specialty, is_active')
          .order('name');
        if (data && data.length > 0) {
          setUsers(data.map(u => ({ ...u })) as AppUser[]);
          setIsLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }
    // Hardcoded fallback
    setUsers([
      { id: 'd8513f8d-877f-4c20-b243-6dc839582778', name: 'Ibrahim', role: 'manager', specialty: 'Manager', is_active: true, pin: '0000' },
      { id: 'c1a8c295-447e-498e-9702-52964d6d5352', name: 'Anushka', role: 'bdc', specialty: 'BDC', is_active: true, pin: '1111' },
      { id: 'bae31ae2-994a-469c-8554-e37b161c51e7', name: 'Suma', role: 'staff', specialty: 'E-cycles', is_active: true, pin: '2222' },
      { id: 'a1b2c3d4-1111-2222-3333-444455556666', name: 'Abhi Gowda', role: 'staff', specialty: 'Gear Cycles', is_active: true, pin: '3333' },
      { id: 'a1b2c3d4-2222-3333-4444-555566667777', name: 'Nithin', role: 'staff', specialty: 'Kids/Budget', is_active: true, pin: '4444' },
      { id: 'a1b2c3d4-3333-4444-5555-666677778888', name: 'Baba', role: 'staff', specialty: '2nd Life', is_active: true, pin: '5555' },
      { id: 'a1b2c3d4-4444-5555-6666-777788889999', name: 'Ranjitha', role: 'staff', specialty: 'Service', is_active: true, pin: '6666' },
      { id: 'a1b2c3d4-5555-6666-7777-888899990000', name: 'Sunil', role: 'staff', specialty: 'Premium', is_active: true, pin: '7777' },
    ]);
    setIsLoading(false);
  };

  const handleCreateUser = async () => {
    if (!form.name || !form.pin) {
      showToast('Name and PIN are required', 'error');
      return;
    }
    if (form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) {
      showToast('PIN must be exactly 4 digits', 'error');
      return;
    }
    setIsSaving(true);
    try {
      // Determine allowed apps based on role
      const role = form.role as UserRole;
      const allowedApps = role === 'manager'
        ? ['manager', 'staff', 'bdc', 'all']
        : role === 'bdc'
          ? ['bdc', 'all']
          : role === 'staff'
            ? ['staff', 'bdc', 'all']
            : ['all'];

      // Add user locally (works offline, instant)
      const newUser = addUser(form.name, form.pin, role, form.specialty || null, allowedApps);

      // Also try Supabase in background (fire-and-forget)
      if (isSupabaseConfigured()) {
        supabase.from('users').insert({
          id: newUser.id,
          name: form.name,
          role: form.role,
          specialty: form.specialty || null,
          is_active: true,
        }).then(() => {});
      }

      // Add to local list immediately
      setUsers(prev => [...prev, {
        id: newUser.id,
        name: form.name,
        role: role,
        specialty: form.specialty || '',
        is_active: true,
        pin: form.pin,
      }]);

      showToast(`${form.name} added with PIN!`, 'success');
      setForm({ name: '', pin: '', role: 'staff', specialty: '' });
      setShowForm(false);
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

  const handleChangePin = (userId: string) => {
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      showToast('PIN must be exactly 4 digits', 'error');
      return;
    }
    const updated = updateUserPin(userId, newPin);
    if (updated) {
      // Also update in Supabase if configured
      if (isSupabaseConfigured()) {
        supabase.from('users').update({ pin: newPin }).eq('id', userId).then(() => {});
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, pin: newPin } : u));
      showToast('PIN updated successfully!', 'success');
    } else {
      showToast('Failed to update PIN', 'error');
    }
    setEditingPinUserId(null);
    setNewPin('');
  };

  const roleColor = (role: string) => {
    if (role === 'manager') return 'bg-purple-100 text-purple-700';
    if (role === 'bdc') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Users & PINs</h2>
        <button
          onClick={() => { setShowForm(!showForm); }}
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
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">4-Digit PIN *</label>
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={form.pin} onChange={e => { if (/^\d*$/.test(e.target.value)) setForm(p => ({ ...p, pin: e.target.value })); }}
              placeholder="e.g. 1234"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary-300 tracking-[0.5em] text-center font-bold"
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

      {/* Role Overview */}
      <Card className="p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Role Overview</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">Manager</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor('manager')}`}>MANAGER</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">BDC Caller</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor('bdc')}`}>BDC</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
            <span className="font-medium text-gray-700">Sales Staff</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColor('staff')}`}>STAFF</span>
          </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingPinUserId(editingPinUserId === user.id ? null : user.id); setNewPin(''); }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-600 active:scale-95"
                  >
                    PIN
                  </button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg active:scale-95 ${
                      user.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              {/* PIN Edit Row */}
              {editingPinUserId === user.id && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={e => { if (/^\d*$/.test(e.target.value)) setNewPin(e.target.value); }}
                    placeholder="New 4-digit PIN"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-300 tracking-[0.3em] text-center font-bold"
                  />
                  <button
                    onClick={() => handleChangePin(user.id)}
                    disabled={newPin.length !== 4}
                    className="px-4 py-2 text-xs font-bold text-white bg-primary-500 rounded-xl active:scale-95 disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import DashboardHome from '@/components/DashboardHome';
import ContentManager from '@/components/ContentManager';
import ImageManager from '@/components/ImageManager';
import BookingsManager from '@/components/BookingsManager';
import TextEditor from '@/components/TextEditor';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import bcrypt from 'bcryptjs';
import { getSection, updateSection } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function DashboardApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editorSection, setEditorSection] = useState<string | undefined>(undefined);
  const router = useRouter();

  const handleNavigate = (page: string, section?: string) => {
    setCurrentPage(page);
    if (section) setEditorSection(section);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome onNavigate={handleNavigate} />;
      case 'bookings':
        return <BookingsManager />;
      case 'content':
        return <ContentManager onNavigate={handleNavigate} />;
      case 'images':
        return <ImageManager onDelete={() => {}} />;
      case 'editor':
        return (
          <TextEditor
            section={editorSection}
            onNavigate={handleNavigate}
            onSave={() => handleNavigate('content')}
          />
        );
      case 'settings':
        return <SettingsForm />;
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ef] flex">
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar onMenuToggle={() => {}} onLogout={handleLogout} />
        
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

function SettingsForm() {
  const [data, setData] = useState<any>({ admin: {}, profile: {}, general: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const settings = await getSection('settings');
        setData({
          admin: settings?.admin || {},
          profile: settings?.profile || {},
          general: settings?.general || {},
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      if (password || confirmPassword) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setSaving(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setSaving(false);
          return;
        }
      }
      const next = { ...data };
      const username = String(next.admin?.username || 'susan').trim();
      next.admin = { ...(next.admin || {}), username };
      if (password && password.length >= 6) {
        next.admin = { ...next.admin, passwordHash: await bcrypt.hash(password, 10) };
      }
      await updateSection('settings', next);
      setSuccess('Settings saved');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display text-[#2c1a0a]">Settings</h2>
          <p className="text-sm text-muted-foreground">Manage admin credentials and site settings</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-[#C9A24D] text-[#1c1208] hover:bg-[#b89342]"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">{success}</div>
      )}

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-[#2c1a0a] mb-4">Admin Credentials</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Username"
              id="settings_admin_username"
              value={data.admin?.username || ''}
              onChange={(e) => setData({ ...data, admin: { ...data.admin, username: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label="New Password"
              id="settings_admin_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
            <Input
              type={showConfirm ? 'text' : 'password'}
              label="Confirm New Password"
              id="settings_admin_confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="hover:text-foreground focus:outline-none"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-[#2c1a0a] mb-4">Profile</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Display Name"
              id="settings_profile_displayName"
              value={data.profile?.displayName || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, displayName: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="Contact Email"
              id="settings_profile_email"
              value={data.profile?.email || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, email: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="Phone"
              id="settings_profile_phone"
              value={data.profile?.phone || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, phone: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="WhatsApp"
              id="settings_profile_whatsapp"
              value={data.profile?.whatsapp || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, whatsapp: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="WhatsApp Link"
              id="settings_profile_whatsappLink"
              value={data.profile?.whatsappLink || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, whatsappLink: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="Instagram URL"
              id="settings_profile_instagram"
              value={data.profile?.instagram || ''}
              onChange={(e) => setData({ ...data, profile: { ...data.profile, instagram: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium text-[#2c1a0a] mb-4">General</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Site Title"
              id="settings_general_siteTitle"
              value={data.general?.siteTitle || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, siteTitle: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
            <Input
              label="Timezone"
              id="settings_general_timezone"
              value={data.general?.timezone || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, timezone: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
          </div>
          <div className="mt-6">
            <Textarea
              label="Booking Notes"
              id="settings_general_bookingNote"
              rows={4}
              value={data.general?.bookingNote || ''}
              onChange={(e) => setData({ ...data, general: { ...data.general, bookingNote: e.target.value } })}
              className="bg-white border-[#d6c4a5] focus:ring-[#C9A24D]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

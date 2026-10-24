// Admin: customer accounts — search, their trackers, admin role.
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { dateTime } from '../lib/format';
import { useAsync, Spinner, ErrorBox, Empty, Pill, ConfirmModal } from '../components/ui';

export default function Users() {
  const { user: me } = useAuth();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [changing, setChanging] = useState(null);
  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);
  const { data, error, loading, reload } = useAsync(
    () => api(`/admin/users?limit=100${query ? `&email=${encodeURIComponent(query)}` : ''}`),
    [query]
  );
  const users = data?.data || [];

  return (
    <>
      <div className="page-head"><h1>Users</h1></div>
      <div className="card flush">
        <div className="row" style={{ padding: 12 }}>
          <input placeholder="Search by email" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} aria-label="Search" />
        </div>
        <ErrorBox error={error} />
        {loading && !data ? <Spinner /> : users.length === 0 ? <Empty>No users found.</Empty> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Email</th><th>Name</th><th>Trackers</th><th>Joined</th><th>Role</th><th /></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.name || <span className="muted">—</span>}</td>
                    <td>
                      {u.devices.length === 0 ? <span className="muted">—</span> : u.devices.map((d) => (
                        <div key={d.imei} className="small">
                          <Link to={`/trackers/${d.imei}`} className="mono">{d.imei}</Link> <span className="muted">{d.role}</span>
                        </div>
                      ))}
                    </td>
                    <td className="nowrap small">{dateTime(u.createdAt)}</td>
                    <td>{u.role === 'admin' ? <Pill tone="brand">Admin</Pill> : <Pill>User</Pill>}</td>
                    <td>
                      {u.id !== me.id && (
                        <button className="btn small" onClick={() => setChanging(u)}>{u.role === 'admin' ? 'Remove admin' : 'Make admin'}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {changing && (
        <ConfirmModal
          title={changing.role === 'admin' ? 'Remove admin access' : 'Make admin'}
          message={changing.role === 'admin'
            ? `${changing.email} will lose access to the admin panel.`
            : `${changing.email} will be able to register, edit, release and delete trackers and see all customers.`}
          confirmLabel={changing.role === 'admin' ? 'Remove admin' : 'Make admin'}
          danger={changing.role !== 'admin'}
          onConfirm={async () => {
            await api(`/admin/users/${changing.id}`, { method: 'PATCH', body: { role: changing.role === 'admin' ? 'user' : 'admin' } });
            reload();
          }}
          onClose={() => setChanging(null)}
        />
      )}
    </>
  );
}

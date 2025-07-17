import React from "react";

type User = { id: string; email: string; created_at: string };

const UsersTab = ({ users }: { users: User[] }) => (
  <div className="p-6 lg:p-8 text-center py-16">
    <div className="text-6xl mb-6">👥</div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">User Management</h3>
    <p className="text-slate-600">User analytics and management dashboard coming soon.</p>
    <div className="flex flex-col gap-6">
      {users.map((user) => (
        <div key={user.id} className="bg-white/30 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{user.email}</h3>
            <p className="text-sm text-slate-500">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UsersTab; 
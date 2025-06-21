import React from "react";

type InviteTabProps = {
  newAdminEmail: string;
  setNewAdminEmail: (email: string) => void;
  message: string;
  loading: boolean;
  handleInviteAdmin: (e: React.FormEvent<HTMLFormElement>) => void;
  admins: { id: string; email: string; created_at: string }[];
  onDeleteAdmin: (id: string) => void;
};

const InviteTab = ({ newAdminEmail, setNewAdminEmail, message, loading, handleInviteAdmin, admins, onDeleteAdmin }: InviteTabProps) => (
  <div className="p-6 lg:p-8">
    <div className=" bg-white/30 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">➕</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Invite New Admin</h3>
        <p className="text-slate-600">Send an invitation to add a new admin to your team</p>
      </div>
      <form onSubmit={handleInviteAdmin} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-slate-800"
            placeholder="admin@example.com"
          />
        </div>
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.includes("sent")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Sending Invitation...</span>
            </>
          ) : (
            <>
              <span>Send Invitation</span>
              <span>📤</span>
            </>
          )}
        </button>
      </form>
      <div className="mt-10">
        <h4 className="text-lg font-semibold text-slate-700 mb-4 text-center">Current Admins</h4>
        <div className="space-y-3">
          {admins.length === 0 ? (
            <p className="text-slate-500 text-center">No admins found.</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} className="bg-white/50 rounded-xl p-4 flex flex-col items-start border border-slate-200">
                <div className="flex items-center w-full justify-between">
                  <div>
                    <span className="font-medium text-slate-800">{admin.email}</span>
                    <span className="block text-xs text-slate-500">Joined {new Date(admin.created_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors"
                    onClick={() => onDeleteAdmin(admin.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

export default InviteTab; 
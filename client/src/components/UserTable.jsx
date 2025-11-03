import {
  Users,
  Check,
  X,
  UserCheck,
  UserX,
  Shield,
  User,
  Loader,
  Calendar,
} from "lucide-react";

function UserTable({ users, onStatusChange, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="flex items-center justify-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mr-4" />
          <span className="text-xl font-semibold text-slate-700">Loading users...</span>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
        <div className="mx-auto h-20 w-20 text-slate-300 mb-6">
          <Users className="h-20 w-20" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          No users found
        </h3>
        <p className="text-lg text-slate-500">
          No users match your current search criteria.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-linear-to-r from-indigo-600 to-purple-600">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Verified
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Joined
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Last Login
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {users.map((user) => (
            <tr
              key={user._id}
              className={`hover:bg-indigo-50 transition-all duration-200 ${
                user.status === "active" ? "" : "bg-red-50"
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-slate-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      ID: {user._id.slice(-6)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{user.email}</div>
                <div className="text-sm text-slate-500">
                  {user.phone || "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role === "Admin" ? (
                    <Shield className="h-3 w-3 mr-1" />
                  ) : (
                    <User className="h-3 w-3 mr-1" />
                  )}
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status === "active" ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  {user.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                    user.accountVerified
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {user.accountVerified ? (
                    <UserCheck className="h-3 w-3 mr-1" />
                  ) : (
                    <Calendar className="h-3 w-3 mr-1" />
                  )}
                  {user.accountVerified ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {formatDateTime(user.lastLogin)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() =>
                    onStatusChange(
                      user._id,
                      user.status === "active" ? "inactive" : "active"
                    )
                  }
                  className={`${
                    user.status === "active" ? "btn-danger" : "btn-success"
                  } text-xs flex items-center`}
                  disabled={loading}
                >
                  {user.status === "active" ? (
                    <>
                      <UserX className="h-3 w-3 mr-1" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Activate
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
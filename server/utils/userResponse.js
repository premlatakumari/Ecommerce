export const userResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
    accountVerified: user.accountVerified,
    lastLogin: user.lastLogin,
    avatar: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Bad request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return data.message || 'Requested resource not found.';
      case 422:
        return data.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || `Unexpected error occurred (${status}).`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

export const isAuthError = (error) => {
  return error.response?.status === 401;
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};
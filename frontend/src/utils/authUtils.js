
export const clearAuthStorage = () => {
    const keysToRemove = [
      'accessToken',
      'refreshToken',
      'role',
      'id',
      'msu_email',
      'is_logged_in',
      'last_login'
    ];
  
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  };
  



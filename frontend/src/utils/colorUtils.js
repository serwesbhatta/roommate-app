// Helper function to determine button color based on status
 export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'danger':
      case 'inactive':
        return 'error';
      default:
        return 'primary';
    }
  };
/**
 * Format system role key to Indonesian display label
 * @param {string} roleName
 * @returns {string}
 */
export function formatRoleLabel(roleName) {
  switch (roleName) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'cashier':
      return 'Kasir';
    case 'kitchen':
      return 'Kitchen';
    default:
      return roleName || '-';
  }
}

/**
 * Format timestamp string to Indonesian localized date
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

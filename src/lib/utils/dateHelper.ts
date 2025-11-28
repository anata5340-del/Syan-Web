export function formatDateToDDMMYYYY(date : Date) {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with '0' if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad with '0'
    const year = date.getFullYear(); // Get full year
  
    return `${day}-${month}-${year}`; // Return formatted date
  }
  
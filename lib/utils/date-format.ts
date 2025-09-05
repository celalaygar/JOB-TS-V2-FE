export const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    // Saat dilimi kaymasını önlemek ve sunucudan gelen değerleri kullanmak için
    // 'UTC' metotlarını kullanıyoruz (getUTCFullYear, getUTCMonth vb.).
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // Format: YYYY-MM-DD HH:mm
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};
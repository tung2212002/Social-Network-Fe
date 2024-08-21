function getDeltaTime(datetime) {
    const datetimeNow = new Date();
    const datetimeInput = new Date(datetime);
    const timeAgo = datetimeNow - datetimeInput;
    if (timeAgo < 0) {
        return '';
    }
    const days = Math.floor(timeAgo / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    const hours = Math.floor(timeAgo / (1000 * 60 * 60));
    const minutes = Math.floor(timeAgo / (1000 * 60));

    if (years > 0) {
        return `${years} năm`;
    }
    if (months > 0) {
        return `${months} tháng`;
    }
    if (days > 0) {
        return `${days} ngày`;
    }
    if (hours > 0) {
        return `${hours} giờ`;
    }
    if (minutes > 0) {
        return `${minutes} phút`;
    }
    return 'vừa xong';
}

export default getDeltaTime;

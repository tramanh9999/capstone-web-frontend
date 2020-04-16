class DateTimeUtils{
    static getDate(datetime){
        try {
            return new Date(datetime).toLocaleDateString();
        } catch (error) {
            return 'Chưa xác định';
        }
    }

    static getDateTime(datetime){
        try {
            const d = new Date(datetime);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        } catch (error) {
            return 'Chưa xác định';
        }
    }
}

export default DateTimeUtils;
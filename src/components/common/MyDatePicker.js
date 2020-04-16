import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker
} from '@material-ui/pickers';

const MyDatePicker = (props) => {
    const { date, setDate, label } = props;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label={label}
                value={date}
                onChange={setDate}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
             {/* <DatePicker value={selectedDate} onChange={handleDateChange} /> */}
        </MuiPickersUtilsProvider>
        
    );
};


export default MyDatePicker;

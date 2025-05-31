import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const formatted = ( inputDate : Date) => {
  let day = inputDate.getDay();
  let date = inputDate.getDate();
  let month = inputDate.getMonth();
  let year = inputDate.getFullYear();
  let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let monthsText = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
}

const DateFormat = () => {

  const [date, setDate] = useState(new Date (Date.now ()));
  const [openPicker, setOpenPicker] = useState(false);

  const openDatePicker = () => {
    setOpenPicker(true);
  }

  const onDateSelected = (event: DateTimePickerEvent, value: any ) => {
    setDate(value);
    setOpenPicker(false);
  }

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={openDatePicker}>
          <View>
            <TextInput
              style={styles.input}
              value={formatted(date)}
              placeholder="Event Time"
              editable={false}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </TouchableWithoutFeedback>

        {openPicker &&
          <DateTimePicker
            value={date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            is24Hour={false}
            onChange={onDateSelected}
            style={styles.datePicker}
          />}
      </View>
    );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    fontSize: 20,
    height: 48,
    color: 'black',
    borderBottomWidth: 2,
    borderBottomColor: 'red',
  },
  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
  },
});

export default DateFormat;
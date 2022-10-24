import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableHighlight,
  Platform,
  Animated,
  Keyboard,
  useColorScheme,
  StyleSheet,
} from "react-native";
import Style from "./style";
import Moment from "moment";
import { DateTimePicker, DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { COLORS } from "../../constants";

const FORMATS = {
  date: "YYYY-MM-DD",
  datetime: "YYYY-MM-DD HH:mm",
  time: "HH:mm",
};

const SUPPORTED_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right",
];

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.getDate(),
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      allowPointerEvents: true,
    };

    this.getDate = this.getDate.bind(this);
    this.getDateStr = this.getDateStr.bind(this);
    this.datePicked = this.datePicked.bind(this);
    this.onPressDate = this.onPressDate.bind(this);
    this.onPressCancel = this.onPressCancel.bind(this);
    this.onPressConfirm = this.onPressConfirm.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onPressMask = this.onPressMask.bind(this);
    this.onDatePicked = this.onDatePicked.bind(this);
    this.onTimePicked = this.onTimePicked.bind(this);
    this.onDatetimePicked = this.onDatetimePicked.bind(this);
    this.onDatetimeTimePicked = this.onDatetimeTimePicked.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.setState({ date: this.getDate(nextProps.date) });
    }
  }

  setModalVisible(visible) {
    const { height, duration } = this.props;

    // slide animation
    if (visible) {
      this.setState({ modalVisible: visible });
      return Animated.timing(this.state.animatedHeight, {
        toValue: height,
        duration: duration,
      }).start();
    } else {
      return Animated.timing(this.state.animatedHeight, {
        toValue: 0,
        duration: duration,
      }).start(() => {
        this.setState({ modalVisible: visible });
      });
    }
  }

  onStartShouldSetResponder(e) {
    return true;
  }

  onMoveShouldSetResponder(e) {
    return true;
  }

  onPressMask() {
    if (typeof this.props.onPressMask === "function") {
      this.props.onPressMask();
    } else {
      this.onPressCancel();
    }
  }

  onPressCancel() {
    this.setModalVisible(false);

    if (typeof this.props.onCloseModal === "function") {
      this.props.onCloseModal();
    }
  }

  onPressConfirm() {
    this.datePicked();
    this.setModalVisible(false);

    if (typeof this.props.onCloseModal === "function") {
      this.props.onCloseModal();
    }
  }

  getDate(date = this.props.date) {
    const { mode, minDate, maxDate, format = FORMATS[mode] } = this.props;
    const { backgroundColorStyle } = this.props;
    if (!date) {
      let now = new Date();
      if (minDate) {
        let _minDate = this.getDate(minDate);

        if (now < _minDate) {
          return _minDate;
        }
      }

      if (maxDate) {
        let _maxDate = this.getDate(maxDate);

        if (now > _maxDate) {
          return _maxDate;
        }
      }

      return now;
    }

    if (date instanceof Date) {
      return date;
    }

    return Moment(date, format).toDate();
  }

  getDateStr(date = this.props.date) {
    const { mode, format = FORMATS[mode] } = this.props;

    const dateInstance = date instanceof Date ? date : this.getDate(date);

    if (typeof this.props.getDateStr === "function") {
      return this.props.getDateStr(dateInstance);
    }

    return Moment(dateInstance).format(format);
  }

  datePicked() {
    console.log("I'm HERE")
    if (typeof this.props.onDateChange === "function") {
      this.props.onDateChange(
        this.getDateStr(this.state.date),
        this.state.date
      );
    }
  }

  getTitleElement() {
    const { date, placeholder, customStyles, allowFontScaling } = this.props;

    if (!date && placeholder) {
      return (
        <Text
          allowFontScaling={allowFontScaling}
          style={[Style.placeholderText, customStyles.placeholderText]}
        >
          {placeholder}
        </Text>
      );
    }
    return (
      <Text
        allowFontScaling={allowFontScaling}
        style={[Style.dateText, customStyles.dateText]}
      >
        {this.getDateStr()}
      </Text>
    );
  }

  onDateChange(date) {
    this.setState({
      allowPointerEvents: false,
      date: date,
    });
    const timeoutId = setTimeout(() => {
      this.setState({
        allowPointerEvents: true,
      });
      clearTimeout(timeoutId);
    }, 200);
  }

  onDatePicked({ action, year, month, day }) {
    if (action !== DateTimePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  onTimePicked({ action, hour, minute }) {
    if (action !== DateTimePickerAndroid.dismissedAction) {
      this.setState({
        date: Moment().hour(hour).minute(minute).toDate(),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  onDatetimePicked({ action, year, month, day }) {
    const {
      mode,
      androidMode,
      format = FORMATS[mode],
      is24Hour = !format.match(/h|a/),
    } = this.props;

    if (action !== DateTimePickerAndroid.dismissedAction) {
      let timeMoment = Moment(this.state.date);

      DateTimePickerAndroid.open({
        value: this.state.date,
        hour: timeMoment.hour(),
        minute: timeMoment.minutes(),
        is24Hour: is24Hour,
        mode: androidMode,
      }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
    } else {
      this.onPressCancel();
    }
  }

  onDatetimeTimePicked(year, month, day, { action, hour, minute }) {
    if (action !== DateTimePickerAndroid.dismissedAction) {
      this.setState({
        date: new Date(year, month, day, hour, minute),
      });
      this.datePicked();
    } else {
      this.onPressCancel();
    }
  }

  onPressDate() {
    if (this.props.disabled) {
      return true;
    }

    Keyboard.dismiss();

    // reset state
    this.setState({
      date: this.getDate(),
    });

    if (Platform.OS === "ios") {
      this.setModalVisible(true);
    } else {
      const {
        mode,
        androidMode,
        format = FORMATS[mode],
        minDate,
        maxDate,
        is24Hour = !format.match(/h|a/),
      } = this.props;

      if (mode === "date") {
        DateTimePickerAndroid.open({
          value: this.state.date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
          onChange: () => {
            console.log("HI THERE")
            this.setState({
              date: new Date(year, month, day),
            });
          },
        })
      } else if (mode === "time") {

        let timeMoment = Moment(this.state.date);

        DateTimePickerAndroid.open({
          hour: timeMoment.hour(),
          minute: timeMoment.minutes(),
          is24Hour: is24Hour,
          mode: androidMode,
        }).then(this.onTimePicked);
      } else if (mode === "datetime") {

        DateTimePickerAndroid.open({
          date: this.state.date,
          minDate: minDate && this.getDate(minDate),
          maxDate: maxDate && this.getDate(maxDate),
          mode: androidMode,
        }).then(this.onDatetimePicked);
      }
    }

    if (typeof this.props.onOpenModal === "function") {
      this.props.onOpenModal();
    }
  }

  render() {
    const {
      mode,
      backgroundColorStyle,
      style,
      customStyles,
      disabled,
      minDate,
      maxDate,
      minuteInterval,
      timeZoneOffsetInMinutes,
      cancelBtnText,
      confirmBtnText,
      TouchableComponent,
      testID,
      cancelBtnTestID,
      confirmBtnTestID,
      allowFontScaling,
      locale,
    } = this.props;

    const dateInputStyle = [
      Style.dateInput,
      customStyles.dateInput,
      disabled && Style.disabled,
      disabled && customStyles.disabled,
    ];

    return (
      <TouchableComponent
        style={[Style.dateTouch, style]}
        underlayColor={"transparent"}
        onPress={this.onPressDate}
        testID={testID}
      >
        <View style={[Style.dateTouchBody, customStyles.dateTouchBody]}>
          {!this.props.hideText ? (
            <View style={dateInputStyle}>{this.getTitleElement()}</View>
          ) : (
            <View />
          )}
          {Platform.OS === "ios" && (
            <Modal
              transparent={true}
              animationType="none"
              visible={this.state.modalVisible}
              supportedOrientations={SUPPORTED_ORIENTATIONS}
              onRequestClose={() => {
                this.setModalVisible(false);
              }}
            >
              <View style={{ flex: 1 }}>
                <TouchableComponent
                  style={Style.datePickerMask}
                  activeOpacity={1}
                  underlayColor={"#00000077"}
                  onPress={this.onPressMask}
                >
                  <TouchableComponent
                    underlayColor={"#fff"}
                    style={{ flex: 1 }}
                  >
                    <Animated.View
                      style={[
                        Style.datePickerCon,
                        { height: this.state.animatedHeight },
                        { backgroundColor: backgroundColorStyle },
                        customStyles.datePickerCon,
                      ]}
                    >
                      <View
                        pointerEvents={
                          this.state.allowPointerEvents ? "auto" : "none"
                        }
                      >
                        <DateTimePicker
                          date={this.state.date}
                          mode={mode}
                          minimumDate={minDate && this.getDate(minDate)}
                          maximumDate={maxDate && this.getDate(maxDate)}
                          onDateChange={this.onDateChange}
                          minuteInterval={minuteInterval}
                          timeZoneOffsetInMinutes={
                            timeZoneOffsetInMinutes
                              ? timeZoneOffsetInMinutes
                              : null
                          }
                          style={[Style.datePicker, customStyles.datePicker]}
                          locale={locale}
                        />
                      </View>
                      <TouchableComponent
                        underlayColor={"transparent"}
                        onPress={this.onPressCancel}
                        style={[
                          Style.btnText,
                          Style.btnCancel,
                          customStyles.btnCancel,
                        ]}
                        testID={cancelBtnTestID}
                      >
                        <Text
                          allowFontScaling={allowFontScaling}
                          style={[
                            Style.btnTextText,
                            Style.btnTextCancel,
                            customStyles.btnTextCancel,
                          ]}
                        >
                          {cancelBtnText}
                        </Text>
                      </TouchableComponent>
                      <TouchableComponent
                        underlayColor={"transparent"}
                        onPress={this.onPressConfirm}
                        style={[
                          Style.btnText,
                          Style.btnConfirm,
                          customStyles.btnConfirm,
                        ]}
                        testID={confirmBtnTestID}
                      >
                        <Text
                          allowFontScaling={allowFontScaling}
                          style={[
                            Style.btnTextText,
                            customStyles.btnTextConfirm,
                          ]}
                        >
                          {confirmBtnText}
                        </Text>
                      </TouchableComponent>
                    </Animated.View>
                  </TouchableComponent>
                </TouchableComponent>
              </View>
            </Modal>
          )}
        </View>
      </TouchableComponent>
    );
  }
}

DatePicker.defaultProps = {
  mode: "date",
  androidMode: "default",
  date: "",
  // component height: 216(DatePickerIOS) + 1(borderTop) + 42(marginTop), IOS only
  height: 259,

  // slide animation duration time, default to 300ms, IOS only
  duration: 300,
  confirmBtnText: "确定",
  cancelBtnText: "取消",
  customStyles: {},

  // whether or not show the icon
  showIcon: true,
  disabled: false,
  allowFontScaling: true,
  hideText: false,
  placeholder: "",
  TouchableComponent: TouchableHighlight,
  modalOnResponderTerminationRequest: (e) => true,
};

DatePicker.propTypes = {
  mode: PropTypes.oneOf(["date", "datetime", "time"]),
  androidMode: PropTypes.oneOf(["clock", "calendar", "spinner", "default"]),
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.object,
  ]),
  format: PropTypes.string,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  height: PropTypes.number,
  duration: PropTypes.number,
  confirmBtnText: PropTypes.string,
  cancelBtnText: PropTypes.string,
  iconComponent: PropTypes.element,
  customStyles: PropTypes.object,
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  allowFontScaling: PropTypes.bool,
  onDateChange: PropTypes.func,
  onOpenModal: PropTypes.func,
  onCloseModal: PropTypes.func,
  onPressMask: PropTypes.func,
  placeholder: PropTypes.string,
  modalOnResponderTerminationRequest: PropTypes.func,
  is24Hour: PropTypes.bool,
  getDateStr: PropTypes.func,
  locale: PropTypes.string,
};

export default DatePicker;
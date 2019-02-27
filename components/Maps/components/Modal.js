import React, { PureComponent } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, TouchableOpacity } from "react-native";
import ProgressiveImage from "../../AsyncModules/ImageComponent";

export class Modal extends PureComponent {
  render() {
    const {
      goToEvent,
      onCloseModal,
      eventData,
      formatDate,
      formatAMPM
    } = this.props;
    return (
      <View
        style={{
          width: 300,
          height: 300,
          paddingBottom: 20,
          borderRadius: 10,
          backgroundColor: "#FFF",
          elevation: 5,
          marginBottom: 5,
          marginLeft: 5,
          marginRight:5
        }}
      >
        <View style={{ width: "100%", height: 150 }}>
          <ProgressiveImage
            source={{ uri: eventData.event_photo }}
            style={{
              width: "100%",
              height: 150,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              color: "#05296d",
              fontSize: 16
            }}
          >
            {eventData.event_subject}
          </Text>
          <Text
            style={{
              fontFamily: "Roboto-Regular",
              color: "#05296d",
              fontSize: 14
            }}
          >
            {eventData.group_name},
            <Text
              style={{
                fontFamily: "Roboto-Light",
                color: "#05296d",
                fontSize: 13
              }}
            >
              {" "}
              {eventData.group_address}
            </Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              paddingHorizontal:10
            }}
          >
             <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              {/* <Icon
                name="clock-o"
                style={{ marginRight: 5, color: "#8da6d5" }}
                size={14}
              />  */}
            <Text
                style={{
                  fontFamily: "Roboto-Regular",
                  fontSize: 14,
                  color: "#8da6d5"
                }}
              >Local Time:
                 {/* {formatDate(new Date(eventData.event_date,eventData.event_time))}{" "}
                -{" "}
                {formatAMPM(new Date(eventData.event_date,eventData.event_time
                ))}  */}
                {
                  eventData.event_date_formated
                }
              </Text>
            </View>
            <TouchableOpacity
              onPress={goToEvent}
              style={{
                marginLeft:5,
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: "#416bb9"
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Roboto-Regular",
                  fontSize: 11
                }}
              >
                INFO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{ position: "absolute", top: 5, right: 5 }}
          onPress={onCloseModal}
        >
          <Icon name="times" size={18} style={{ color: "#FFF" }} />
        </TouchableOpacity>
      </View>
    );
  }
}

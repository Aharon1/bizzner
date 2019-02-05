import React, { PureComponent } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Text, TouchableOpacity, } from "react-native";
import ProgressiveImage from "../../AsyncModules/ImageComponent";

export class Modal extends PureComponent {
  render() {
      const {  goToEvent,onCloseModal, eventData, formatDate, formatAMPM} = this.props
    return (
      <View
        style={{
          width: 290,
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
            source={{ uri: eventData.event_photo}}
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
            paddingHorizontal: 15,
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
            {eventData.group_name },
            <Text
              style={{
                fontFamily: "Roboto-Light",
                color: "#05296d",
                fontSize: 13
              }}
            >
              {" "}
              {eventData.group_address }
            </Text>
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Icon
                name="clock-o"
                style={{ marginRight: 5, color: "#8da6d5" }}
                size={14}
              />
              <Text
                style={{
                  fontFamily: "Roboto-Regular",
                  fontSize: 14,
                  color: "#8da6d5"
                }}
              >
                {formatDate(eventData.event_date,eventData.event_time)}{" "}
                -{" "}
                {formatAMPM(eventData.event_date,eventData.event_time
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={goToEvent}
              style={{
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 15,
                backgroundColor: "#416bb9"
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "Roboto-Regular",
                  fontSize: 13
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

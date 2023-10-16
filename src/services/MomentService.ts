import { momentAPI } from "../constants/server";
import { Event, Interest } from "../constants";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
import { confirmButtonStyles } from "react-native-modal-datetime-picker";
import { 
  MomentResponse, 
  EventMomentResponse,
  MomentHomeResponse,
  Moment,
  EventMoment,
  MomentHome, 
} from "../constants/types";
import {
  eventResponseToEvent,
  eventResponseToEvents,
  userResponseToUser,
  momentHomeResponseToMomentHome
} from "../helpers/converters";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/******************************************************
 * getMomentsHome
 *
 * Gets an event based on its ID
 */
export async function getMomentsHome(
  userID: string,
  userAccessToken: string
): Promise<MomentHome> {
  console.log("useraccesstoken is" + userAccessToken);
  const response = await fetch(momentAPI + `/moments/home/user_id/${userID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch(() => {
    return undefined;
  });

  const momentHome: MomentHomeResponse = await responseHandler<MomentHomeResponse>(
    response,
    "Could not get event",
    true
  );

  const convertedMomentHome: MomentHome = momentHomeResponseToMomentHome(momentHome);

  return convertedMomentHome;
}
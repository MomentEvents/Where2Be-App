import { User } from "../../../constants";
import ProfileViewer from "../../../components/ProfileViewer/ProfileViewer";
import { UserContext } from "../../../contexts/UserContext";
import { useContext } from "react";

const MyProfileScreen = ({ route }) => {
  const {userToken} = useContext(UserContext)
  return <ProfileViewer userID={userToken.UserID} showSettings={true}/>;
};

export default MyProfileScreen;
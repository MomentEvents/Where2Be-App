import { User } from "../../../constants";
import ProfileViewer from "../../../components/ProfileViewer/ProfileViewer";

type ProfileDetailsRouteParams = {
  user: User;
};
const ProfileDetailsScreen = ({ route }) => {
  const { user }: ProfileDetailsRouteParams = route.params;

  return <ProfileViewer userID={user.UserID} />;
};

export default ProfileDetailsScreen;
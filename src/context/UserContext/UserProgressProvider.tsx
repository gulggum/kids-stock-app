import { CharacterProvider } from "./CharacterContext";
import { ItemProvider } from "./ItemContext";
import { ProfileProvider } from "./ProfileContext";
import { UserProvider } from "./UserContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <UserProvider>
      <ItemProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </ItemProvider>
    </UserProvider>
  );
};

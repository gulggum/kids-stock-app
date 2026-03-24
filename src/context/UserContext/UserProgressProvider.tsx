import { CharacterProvider } from "./CharacterContext";
import { ItemProvider } from "./ItemContext";
import { ProfileProvider } from "./ProfileContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CharacterProvider>
      <ItemProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </ItemProvider>
    </CharacterProvider>
  );
};

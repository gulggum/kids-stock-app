import { CharacterProvider } from "./CharacterContext";
import { ItemProvider } from "./ItemContext";
import { BadgeProvider } from "./BadgeContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CharacterProvider>
      <ItemProvider>
        <BadgeProvider>{children}</BadgeProvider>
      </ItemProvider>
    </CharacterProvider>
  );
};

import { CharacterProvider } from "./CharacterContext";
import { ItemProvider } from "./ItemContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CharacterProvider>
      <ItemProvider>{children}</ItemProvider>
    </CharacterProvider>
  );
};

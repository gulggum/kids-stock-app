import { ItemProvider } from "./ItemContext";
import { UserProvider } from "./UserContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <UserProvider>
      <ItemProvider>{children}</ItemProvider>
    </UserProvider>
  );
};

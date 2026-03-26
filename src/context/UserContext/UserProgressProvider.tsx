import { SkinItemProvider } from "./SkinItemContext";
import { UserProvider } from "./UserContext";

export const UserProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <UserProvider>
      <SkinItemProvider>{children}</SkinItemProvider>
    </UserProvider>
  );
};

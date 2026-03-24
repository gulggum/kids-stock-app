//프로필용(이미지, 아바타)
import { createContext, useContext } from "react";
import { useCharacterProfile } from "../../hooks/useCharacterProfile";

const ProfileContext = createContext<any>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const profile = useCharacterProfile();

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};

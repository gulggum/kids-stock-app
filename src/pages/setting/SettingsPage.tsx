import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  LogOut,
  ChevronRight,
  Bell,
  Palette,
  ShieldCheck,
  LayoutDashboard,
  MessageCircle,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useModal } from "../../context/UIContext/ModalContext";
import { useToast } from "../../context/UIContext/ToastContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();

  const handleLogout = () => {
    openModal({
      type: "CONFIRM",
      title: "로그아웃",
      message: "정말 로그아웃 할까요?",
      confirmText: "로그아웃",
      cancelText: "취소",
      onConfirm: async () => {
        closeModal();
        await signOut();
        navigate("/login");
      },
      onCancel: closeModal,
    });
  };

  const handleComingSoon = (feature: string) => {
    createToast(`${feature}은 준비 중이에요 🛠`);
  };

  const settingGroups = [
    {
      title: "계정",
      items: [
        {
          icon: <User size={18} />,
          label: "닉네임 변경",
          description: "나의 닉네임을 바꿔요",
          onClick: () => handleComingSoon("닉네임 변경"),
          color: "#2E8EDB",
        },
        {
          icon: <Lock size={18} />,
          label: "비밀번호 변경",
          description: "비밀번호를 새로 설정해요",
          onClick: () => handleComingSoon("비밀번호 변경"),
          color: "#9B59B6",
        },
      ],
    },
    {
      title: "앱 설정",
      items: [
        {
          icon: <Bell size={18} />,
          label: "알림 설정",
          description: "알림을 켜고 꺼요",
          onClick: () => handleComingSoon("알림 설정"),
          color: "#F39C12",
        },
        {
          icon: <Palette size={18} />,
          label: "테마 변경",
          description: "앱 색상을 바꿔요",
          onClick: () => handleComingSoon("테마 변경"),
          color: "#6BCB3D",
        },
      ],
    },
    {
      title: "기타",
      items: [
        {
          icon: <MessageCircle size={18} />,
          label: "문의하기",
          description: "불편한 점이나 궁금한 점을 남겨요",
          onClick: () => navigate("/inquiry"),
          color: "#FF8FA3",
        },
        {
          icon: <ShieldCheck size={18} />,
          label: "개인정보 처리방침",
          description: "개인정보 보호 정책을 확인해요",
          onClick: () => handleComingSoon("개인정보 처리방침"),
          color: "#5F7FA6",
        },
      ],
    },
  ];

  return (
    <PageWrapper>
      {/* 헤더 */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <HeaderTitle>설정</HeaderTitle>
        <div style={{ width: 36 }} />
      </Header>

      {/* 프로필 요약 */}
      <ProfileCard>
        <Avatar>{user.nickname[0]}</Avatar>
        <ProfileInfo>
          <ProfileNickname>{user.nickname}</ProfileNickname>
          <ProfileRole>
            {user.role === "admin" ? "👑 관리자" : "🌱 일반 유저"}
          </ProfileRole>
        </ProfileInfo>
      </ProfileCard>

      {/* ✅ 관리자 메뉴 — admin만 보임 */}
      {user.role === "admin" && (
        <>
          <SectionTitle>관리자</SectionTitle>
          <SectionCard>
            <SettingItem $last onClick={() => navigate("/admin")}>
              <IconWrapper style={{ background: "#FFF0E618" }}>
                <span style={{ color: "#E67E22" }}>
                  <LayoutDashboard size={18} />
                </span>
              </IconWrapper>
              <ItemText>
                <ItemLabel>관리자 페이지</ItemLabel>
                <ItemDesc>뉴스 등록, 통계, 랭킹 관리</ItemDesc>
              </ItemText>
              <ChevronRight size={16} color="#ccc" />
            </SettingItem>
          </SectionCard>
        </>
      )}

      {/* 설정 목록 */}
      {settingGroups.map((group) => (
        <Section key={group.title}>
          <SectionTitle>{group.title}</SectionTitle>
          <SectionCard>
            {group.items.map((item, idx) => (
              <SettingItem
                key={item.label}
                onClick={item.onClick}
                $last={idx === group.items.length - 1}
              >
                <IconWrapper style={{ background: `${item.color}18` }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </IconWrapper>
                <ItemText>
                  <ItemLabel>{item.label}</ItemLabel>
                  <ItemDesc>{item.description}</ItemDesc>
                </ItemText>
                <ChevronRight size={16} color="#ccc" />
              </SettingItem>
            ))}
          </SectionCard>
        </Section>
      ))}

      {/* 로그아웃 */}
      <LogoutButton onClick={handleLogout}>
        <LogOut size={18} />
        로그아웃
      </LogoutButton>

      <Version>KidsStock v1.0.0</Version>
    </PageWrapper>
  );
};

export default SettingsPage;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  padding-bottom: 40px;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  margin: 0;
`;

const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 22px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileNickname = styled.p`
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ProfileRole = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 4px;
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

const SettingItem = styled.button<{ $last: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: ${({ $last, theme }) =>
    $last ? "none" : `1px solid ${theme.colors.background}`};
  transition: 0.15s;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
  &:active {
    transform: scale(0.99);
  }
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ItemText = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const ItemDesc = styled.p`
  font-size: 12px;
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.5px solid #e74c3c;
  background: white;
  color: #e74c3c;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 8px;

  &:hover {
    background: #fff0f0;
  }
`;

const Version = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 8px;
`;

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </BackButton>
        <Title>개인정보처리방침</Title>
        <div style={{ width: 36 }} />
      </Header>

      <ContentCard>
        <SectionBlock>
          <SectionTitle>1. 수집하는 정보</SectionTitle>
          <Text>
            앱 이용을 위해 이메일, 닉네임, 프로필 이미지, 게임 기록, 문의내용
            등의 정보를 수집할 수 있습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>2. 정보 사용 목적</SectionTitle>
          <Text>
            회원 식별, 게임 기록 저장, 랭킹 제공, 문의 응답, 서비스 개선을 위해
            정보를 사용합니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>3. 정보 보관 기간</SectionTitle>
          <Text>
            회원 탈퇴 전까지 정보를 보관하며, 탈퇴 요청 시 관련 데이터는 삭제될
            수 있습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>4. 제3자 제공</SectionTitle>
          <Text>
            수집된 개인정보는 외부에 판매하거나 제공하지 않습니다. 단, 서비스
            운영을 위해 Supabase 등 외부 서비스를 사용할 수 있습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>5. 문의</SectionTitle>
          <Text>
            개인정보 관련 문의는 앱 내 문의하기 기능을 통해 요청할 수 있습니다.
          </Text>
        </SectionBlock>

        <UpdateText>최종 수정일: 2026.04.15</UpdateText>
      </ContentCard>
    </Container>
  );
}
const Container = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.card};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 22px 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  word-break: keep-all;
`;
const UpdateText = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`;

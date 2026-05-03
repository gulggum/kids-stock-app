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
            회원 탈퇴 전까지 정보를 보관하며, 탈퇴 요청 시 관련 데이터는 지체
            없이 삭제됩니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>4. 제3자 제공</SectionTitle>
          <Text>
            수집된 개인정보는 외부에 판매하거나 제공하지 않습니다. 단, 서비스
            운영을 위해 Supabase 등 외부 서비스를 이용할 수 있으며, 이 경우 관련
            법령을 준수합니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>5. 자동 수집 정보</SectionTitle>
          <Text>
            서비스 이용 과정에서 오류 확인 및 서비스 개선을 위해 비식별화된 이용
            정보가 자동으로 수집될 수 있습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>6. 아동 개인정보 보호</SectionTitle>
          <Text>
            본 앱은 아동(만 13세 미만)을 포함한 이용자를 대상으로 제공됩니다.
            아동의 개인정보는 서비스 제공에 필요한 최소한의 범위에서만 수집되며,
            민감한 정보는 수집하지 않습니다.
            <br />
            관련 법령을 준수하여 안전하게 보호됩니다.
            <br />
            보호자는 언제든지 아동의 개인정보에 대해 열람, 수정 또는 삭제를
            요청할 수 있습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>7. 서비스 특성 안내</SectionTitle>
          <Text>
            본 앱은 실제 금전이 오가지 않는 가상의 주식 체험 서비스입니다. 투자
            권유 또는 금융 거래를 목적으로 하지 않습니다.
          </Text>
        </SectionBlock>

        <SectionBlock>
          <SectionTitle>8. 계정 및 데이터 삭제 요청</SectionTitle>
          <Text>
            계정 삭제 또는 개인정보 삭제를 원하시면 앱 내 문의하기 기능 또는
            아래 이메일로 요청해 주세요. <br />
            요청 후 영업일 기준 7일 이내에 처리됩니다.
            <br />
            삭제 시 게임 기록, 보유 자산, 닉네임 등 모든 관련 데이터가 함께
            삭제됩니다. <br />
            👉 이메일: devhy5174@gmail.com
          </Text>
        </SectionBlock>

        <UpdateText>최종 수정일: 2026.05.04</UpdateText>
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

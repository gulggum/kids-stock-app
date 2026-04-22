import { useEffect, useState } from "react";
import styled from "styled-components";
import { supabase } from "../../utils/supabase";

const AdminPremiumVotes = () => {
  const [votes, setVotes] = useState({ yes: 0, no: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("premium_interest");

      if (!data) return;

      const yes = data.filter((d) => d.premium_interest === true).length;
      const no = data.filter((d) => d.premium_interest === false).length;
      const total = data.filter((d) => d.premium_interest !== null).length;

      setVotes({ yes, no, total });
      setLoading(false);
    };
    fetch();
  }, []);

  const yesRatio = votes.total > 0 ? votes.yes / votes.total : 0;
  const noRatio = votes.total > 0 ? votes.no / votes.total : 0;

  return (
    <Container>
      <SectionTitle>💎 프리미엄 구독 관심 투표</SectionTitle>

      {loading ? (
        <LoadingText>불러오는 중...</LoadingText>
      ) : (
        <SectionCard>
          <TotalText>총 {votes.total}명 투표</TotalText>

          <VoteRow>
            <VoteLabel>👍 관심 있어요</VoteLabel>
            <BarTrack>
              <BarFill $ratio={yesRatio} $color="#6BCB3D" />
            </BarTrack>
            <VoteCount>
              {votes.yes}명 ({Math.round(yesRatio * 100)}%)
            </VoteCount>
          </VoteRow>

          <VoteRow>
            <VoteLabel>👎 관심 없어요</VoteLabel>
            <BarTrack>
              <BarFill $ratio={noRatio} $color="#e53935" />
            </BarTrack>
            <VoteCount>
              {votes.no}명 ({Math.round(noRatio * 100)}%)
            </VoteCount>
          </VoteRow>
        </SectionCard>
      )}
    </Container>
  );
};

export default AdminPremiumVotes;

const Container = styled.div`
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TotalText = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
`;

const VoteRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VoteLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  width: 100px;
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $ratio: number; $color: string }>`
  height: 100%;
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  background: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const VoteCount = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.muted};
  width: 70px;
  text-align: right;
  flex-shrink: 0;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.muted};
`;

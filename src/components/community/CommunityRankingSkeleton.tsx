import styled, { keyframes } from "styled-components";

/**
 * 랭킹 로딩 스켈레톤
 * shimmer 애니메이션으로 로딩 중임을 표시
 */
const CommunityRankingSkeleton = () => {
  return (
    <Wrapper>
      {/* 탭 */}
      <TabRow>
        <SkBox style={{ height: 36, borderRadius: 10 }} />
        <SkBox style={{ height: 36, borderRadius: 10 }} />
      </TabRow>

      {/* TOP 3 */}
      <TopRow>
        {[0, 1, 2].map((i) => (
          <TopCard key={i}>
            <SkCircle size={24} />
            <SkCircle size={44} />
            <SkBox style={{ width: 56, height: 13 }} />
            <SkBox style={{ width: 36, height: 13 }} />
          </TopCard>
        ))}
      </TopRow>

      {/* 리스트 */}
      {[0, 1, 2].map((i) => (
        <ListRow key={i}>
          <SkCircle size={24} />
          <SkBox style={{ width: 40, height: 40, borderRadius: 10 }} />
          <InfoCol>
            <SkBox style={{ width: 70, height: 13 }} />
            <SkBox style={{ width: 40, height: 11 }} />
          </InfoCol>
          <SkBox style={{ width: 36, height: 16 }} />
        </ListRow>
      ))}
    </Wrapper>
  );
};

export default CommunityRankingSkeleton;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
`;

const SkBox = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s infinite;
  border-radius: 6px;
  flex: 1;
`;

const SkCircle = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surface} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.surface} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s infinite;
  flex-shrink: 0;
`;

const TopRow = styled.div`
  display: flex;
  gap: 10px;
`;

const TopCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ListRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
`;

const InfoCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

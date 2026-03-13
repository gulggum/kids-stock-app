import styled from "styled-components";

const AdminStats = () => {
  return (
    <Container>
      <Title>서비스 통계</Title>

      <Grid>
        <Card>
          <Label>총 유저</Label>
          <Value>128명</Value>
        </Card>

        <Card>
          <Label>오늘 거래</Label>
          <Value>54건</Value>
        </Card>

        <Card>
          <Label>뉴스 조회</Label>
          <Value>342회</Value>
        </Card>
      </Grid>
    </Container>
  );
};

export default AdminStats;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const Card = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.card};
`;

const Label = styled.p`
  font-size: 13px;
`;

const Value = styled.h2`
  font-size: 22px;
`;

import styled from "styled-components";

const AdminItems = () => {
  return (
    <Container>
      <Title>아이템 관리</Title>

      <Grid>
        <ItemCard>
          <Name>🎩 모자</Name>
          <Price>500 포인트</Price>
        </ItemCard>

        <ItemCard>
          <Name>👓 안경</Name>
          <Price>300 포인트</Price>
        </ItemCard>
      </Grid>
    </Container>
  );
};

export default AdminItems;

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

const ItemCard = styled.div`
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Name = styled.h3``;

const Price = styled.p`
  font-size: 14px;
`;

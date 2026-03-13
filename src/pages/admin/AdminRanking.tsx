import styled from "styled-components";

const AdminRanking = () => {
  return (
    <Container>
      <Title>투자 랭킹</Title>

      <Table>
        <thead>
          <tr>
            <th>순위</th>
            <th>유저</th>
            <th>자산</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>투자왕</td>
            <td>1,200,000원</td>
          </tr>
          <tr>
            <td>2</td>
            <td>주식천재</td>
            <td>980,000원</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminRanking;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
  }
`;

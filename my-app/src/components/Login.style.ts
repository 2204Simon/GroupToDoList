import styled from 'styled-components'

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
`

export const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const LoginInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  width: 200px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
`

export const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #34495e;
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 40px;

  &:hover {
    background-color: #2c3e50;
  }
`

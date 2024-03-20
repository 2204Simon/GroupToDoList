import { useState } from 'react'
import styled from 'styled-components'

const SidebarWrapper = styled.div<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? '25vw' : '0')};
  transition: 0.3s;
  overflow: hidden;
  margin-right: 40px;
  background: #b3dee5;
  box-shadow: #000000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.18); // Ändern Sie die Randfarbe in ein weicheres Grau
  height: 95vh;
`

const Block = styled.div`
  padding: 20px;
  border-bottom: 3px solid #fae6b1; // Ändern Sie die Randfarbe in ein weicheres Grau
`

const LogoutButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: #000000; // Ändern Sie die Hintergrundfarbe in ein weicheres Grau
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
`

const CloseButton = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
`

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  return (
    <SidebarWrapper isOpen={isOpen}>
      {/* <CloseButton onClick={toggleSidebar}>
        <XCircle size={24} />
      </CloseButton> */}
      <Block>
        <h2>Allgemeine Daten</h2>
        {/* Hier können Sie Ihre allgemeinen Daten einfügen */}
      </Block>
      <Block>
        <h2>To-Do-Listen</h2>
        {/* Hier können Sie Ihre To-Do-Liste einfügen */}
      </Block>
      <LogoutButton
        onClick={() => {
          /* Hier können Sie Ihre Ausloggen-Funktion einfügen */
        }}
      >
        Ausloggen
      </LogoutButton>
    </SidebarWrapper>
  )
}

export default Sidebar

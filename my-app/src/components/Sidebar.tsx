import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useEffect } from 'react'
import PouchDB from 'pouchdb-browser'
import { useCookies } from 'react-cookie'
import { TodoListPouchListing } from '../types/types'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom';

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
  background: #e21818; 
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
`
const LoggedInButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: #225d23; // Ändern Sie die Hintergrundfarbe in ein weicheres Grau
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
`

const CloseButton = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
`

const StyledLink = styled(Link)`
  color: #333; // Ändern Sie die Textfarbe in ein dunkleres Grau
  text-decoration: none; // Entfernt die Unterstreichung
  &:hover {
    color: #666; // Ändert die Farbe beim Überfahren mit der Maus
  }
`

const testTodoIds = ['1', '2']

const Sidebar = () => {
  const { isLoggedIn, setLoggedIn } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies(['database'])
  const navigate = useNavigate();


  const [todoListNames, setTodoListNames] = useState<
    Array<TodoListPouchListing>
  >([])
  useEffect(() => {
    const loadTodoListNames = async (
      cookies: any,
      setCookie: any,
    ): Promise<Array<TodoListPouchListing>> => {
      const remoteDB = new PouchDB(`http://localhost:5984/${cookies.database}`)
      remoteDB.info().then((info) => {
        console.log('info', info)
      })
      const localDB = new PouchDB(cookies.database)
      localDB
        .sync(remoteDB, {
          live: true,
          retry: true,
        })
        .then((sync) => {
          console.log('sync', sync)
        })
        .catch((error) => {
          console.log('error', error)
        })

      const response = await localDB.allDocs({
        include_docs: true,
      })
      console.log('response', response)

      const todoListNames = response.rows.map((row: any) => ({
        dbName: row.doc.dbName,
        title: row.doc.title,
        _id: row.doc._id,
      }))
      return todoListNames
    }

    const fetchGroupNames = async () => {
      const groupNames = await loadTodoListNames(cookies, setCookie)
      setTodoListNames(groupNames)
      console.log(groupNames, 'groupNames')
    }

    fetchGroupNames()
  }, [cookies, setCookie])

  const [isOpen, setIsOpen] = useState(true)
  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }
  return (
    <SidebarWrapper isOpen={isOpen}>
      {/* <CloseButton onClick={toggleSidebar}>
        <XCircle size={24} />
      </CloseButton> */}

      <h1>Menü</h1>

      <Block>
        <StyledLink to="/home">Home</StyledLink>
      </Block>
      
      <Block>
        <h1>To-Do-Listen</h1>
        <div>
  {todoListNames
    .filter((todoListName) => todoListName.title !== undefined)
    .map((todoListName) => (
      <div key={todoListName._id}>
        <StyledLink to={`/todoList/${todoListName._id}`}>
          To-Do-Liste {todoListName.title}
        </StyledLink>
      </div>
    ))}
</div>
        {/* Hier können Sie Ihre To-Do-Liste einfügen */}
      </Block>
      {isLoggedIn ? (
        <LogoutButton onClick={() => setLoggedIn(false)}>Ausloggen</LogoutButton>
      ) : (
        <LoggedInButton onClick={() => navigate('/login')}>Einloggen</LoggedInButton>
      )}
      
    </SidebarWrapper>
  )
}

export default Sidebar

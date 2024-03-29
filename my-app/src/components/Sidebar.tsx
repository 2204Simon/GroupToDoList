import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useEffect } from 'react'
import PouchDB from 'pouchdb-browser'
import { useCookies } from 'react-cookie'
import { TodoListPouchListing } from '../types/types'
import { AuthContext } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const SidebarWrapper = styled.div<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? '25vw' : '0')};
  transition: 0.3s;
  overflow: hidden;
  margin-right: 40px;
  color: #ecf0f1; // Ändern Sie die Textfarbe in #ecf0f1
  background: #34495e; // Ändern Sie die Hintergrundfarbe in #34495e
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.18);
  height: 95vh;
`

const Block = styled.div`
  padding: 20px;
  border-bottom: 1px solid #2c3e50; // Ändern Sie die Randfarbe in ein dunkleres Blau
`

const LogoutButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: #c0392b; 
  color: #ecf0f1; 


`

const LoggedInButton = styled.button`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: #27ae60; 
  color: #ecf0f1; 
`

const CloseButton = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  color: #ecf0f1; 
`

const StyledLink = styled(Link)`
  color: #ecf0f1; 
  text-decoration: none;
  font-weight: bold; // Fügt Fettdruck hinzu
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // Fügt Textschatten hinzu
  padding: 5px; // Fügt Polsterung hinzu
  background-color: rgba(0, 0, 0, 0.1); // Fügt eine Hintergrundfarbe hinzu
  border-radius: 5px; // Rundet die Ecken ab
  &:hover {
    color: #bdc3c7; 
    background-color: rgba(0, 0, 0, 0.2); // Ändert die Hintergrundfarbe beim Überfahren mit der Maus
  }
`

const testTodoIds = ['1', '2']

const Sidebar = () => {
  const [cookies, setCookie] = useCookies(['database'])
  const navigate = useNavigate()

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

      <Block>
        <h1>Navigationsmenü</h1>
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

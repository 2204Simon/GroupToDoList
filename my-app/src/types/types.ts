export interface Todo {
  _id: string
  title: string
  description: string
  completed: boolean
}

export interface GroupTodoList {
  _id: string
  title: string
  todos: Todo[]
}

export interface ToDoListsProps {
  todos: any[]
  newTodo: any
  setNewTodo: (todo: any) => void
  addTodo: (event: React.FormEvent) => void
  deleteTodo: (id: string) => void
}

export interface TodoListProps {
  todos: Todo[]
}

export interface TodoListItemProps {
  todo: Todo
}

export type User = {
  userId?: string
  username: string
  password: string
  email: string
  groupTodoLists?: [{_id: string, role: string}]
}
// ;[
//   {
//     user: [
//       { userId: 'string', password: 'string', email: 'string' },
//       { userId: 'string', password: 'string', email: 'string' },
//     ],

//     groupTodoList: [
//       {
//         groupListId: 'string',
//         createdAt: 'string',
//         updatedAt: 'string',
//         title: 'string',
//         description: 'string',
//         deleted: 'boolean',
//         rights: [
//           {
//             admins: [{ userId: 'exampleUser', favorite: 'boolean' }],
//           },
//           { editor: [{ userId: 'exampleUser', favorite: 'boolean' }] },
//           { reader: [{ userId: 'exampleUser', favorite: 'boolean' }] },
//         ],
//       },

//       {
//         todos: [
//           {
//             todoId: 'string',
//           },
//         ],

//         todo: [
//           {
//             todoId: 'string',
//             title: 'string',
//             description: 'string',
//             completed: 'boolean',
//             deleted: 'boolean',
//             deadline: 'Date',
//             createdAt: 'string',
//             updatedAt: 'string',
//             label: {
//               labelId: 'string',
//               name: 'string',
//               color: 'string',
//               userId: 'string',
//             },
//           },
//         ],
//       },
//     ],
//   },
// ]

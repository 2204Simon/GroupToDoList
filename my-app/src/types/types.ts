export interface Todo {
  _id: string
  title: string
  description: string
  completed: boolean
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
}
;[
  {
    user: [
      { userId: 'string', password: 'string', email: 'string' },
      { userId: 'string', password: 'string', email: 'string' },
    ],

    groupTodoList: [
      {
        groupListId: 'string',
        createdAt: 'string',
        updatedAt: 'string',
        title: 'string',
        description: 'string',
        deleted: 'boolean',
        rights: [
          {
            admins: [{ userId: 'exampleUser', favorite: 'boolean' }],
          },
          { editor: [{ userId: 'exampleUser', favorite: 'boolean' }] },
          { reader: [{ userId: 'exampleUser', favorite: 'boolean' }] },
        ],
      },

      {
        todos: [
          {
            todoId: 'string',
          },
        ],

        todo: [
          {
            todoId: 'string',
            title: 'string',
            description: 'string',
            completed: 'boolean',
            deleted: 'boolean',
            deadline: 'Date',
            createdAt: 'string',
            updatedAt: 'string',
            label: {
              labelId: 'string',
              name: 'string',
              color: 'string',
              userId: 'string',
            },
          },
        ],
      },
    ],
  },
]

# global-state

* A global state management module for React.
* Eliminates the need for `Context` and `Provider`.


## Usage

**useTodoList.ts**
```useTodoList.ts
import {useGlobalState} from '@higoshi/global-state';

const symbol = Symbol('TodoList');

export const useTodoList = () => {
  return useGlobalState<string[]>(symbol, []);
};

```

**page.tsx**
```page.tsx
'use client';
import React from 'react';
import {useTodoList} from './useTodoList';

export default function() {
  const [todoList, setTodoList] = useTodoList();

  const clickHandler = () => {
    setTodoList(oldTodoList => {
      return [...oldTodoList, Math.random() + ''];
    });
  };

  return (
    <>
      <ul>
        {todoList.map((todo, index) => {
          return <li key={index}>{todo}</li>;
        })}
      </ul>
      <button onClick={clickHandler}>Add</button>
    </>
  );
};
```

# global-state

* React用のグローバルステート管理モジュールです。
* `Context` や `Provider` を不要とします。


## 使い方

**useTodoList.ts**
```useTodoList.ts
import {useGlobalState} from 'global-state';

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

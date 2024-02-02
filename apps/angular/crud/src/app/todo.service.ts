import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { randText } from '@ngneat/falso';
import { BehaviorSubject } from 'rxjs';
import { ToDo } from './todo.model';

@Injectable({
  providedIn: 'root',
})
export class ToDoService {
  todoList: ToDo[] = [];

  todos = new BehaviorSubject<ToDo[]>([]);
  public currentToDos = this.todos.asObservable();

  constructor(private http: HttpClient) {}

  private emitChange = () => {
    this.todos.next(this.todoList);
  };

  initialize = () => {
    this.http
      .get<ToDo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this.todoList = todos;
        this.emitChange();
      });
  };

  update(todo: ToDo) {
    this.http
      .put<ToDo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          body: todo.body,
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe((todoUpdated: ToDo) => {
        this.todoList = this.todoList.map((t) =>
          t.id === todoUpdated.id ? todoUpdated : t,
        );
        this.emitChange();
      });
  }

  delete(todoId: number) {
    this.http
      .delete<ToDo>(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .subscribe(() => {
        this.todoList = this.todoList.filter((t) => t.id !== todoId);
        this.emitChange();
      });
  }
}

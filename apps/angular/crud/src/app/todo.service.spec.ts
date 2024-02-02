import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { ToDo } from './todo.model';
import { ToDoService } from './todo.service';

describe('ToDoService', () => {
  let service: ToDoService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ToDoService],
    });
    service = TestBed.inject(ToDoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize todoList', inject(
    [HttpTestingController, ToDoService],
    (httpMock: HttpTestingController, todoService: ToDoService) => {
      const mockToDos = [
        { id: 1, userId: 1, title: 'Todo 1', body: 'Body 1' },
        { id: 2, userId: 1, title: 'Todo 2', body: 'Body 2' },
      ];

      todoService.initialize();

      const req = httpMock.expectOne(
        'https://jsonplaceholder.typicode.com/todos',
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockToDos);

      todoService.currentToDos.subscribe((todos) => {
        expect(todos).toEqual(mockToDos);
      });
    },
  ));

  it('should update a todo', inject(
    [HttpTestingController, ToDoService],
    (httpMock: HttpTestingController, todoService: ToDoService) => {
      const mockTodo: ToDo = {
        id: 1,
        userId: 1,
        title: 'Updated Todo',
        body: 'Updated Body',
      };

      todoService.update(mockTodo);

      const req = httpMock.expectOne(
        `https://jsonplaceholder.typicode.com/todos/${mockTodo.id}`,
      );
      expect(req.request.method).toEqual('PUT');
      req.flush(mockTodo);

      todoService.currentToDos.subscribe((todos) => {
        const updatedTodo = todos.find((t) => t.id === mockTodo.id);
        expect(updatedTodo).toBeTruthy();
        expect(updatedTodo?.title).toEqual('Updated Todo');
        expect(updatedTodo?.body).toEqual('Updated Body');
      });
    },
  ));

  it('should delete a todo', inject(
    [HttpTestingController, ToDoService],
    (httpMock: HttpTestingController, todoService: ToDoService) => {
      const todoIdToDelete = 1;

      todoService.delete(todoIdToDelete);

      const req = httpMock.expectOne(
        `https://jsonplaceholder.typicode.com/todos/${todoIdToDelete}`,
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush({});

      todoService.currentToDos.subscribe((todos) => {
        expect(todos.some((t) => t.id === todoIdToDelete)).toBeFalsy();
      });
    },
  ));
});

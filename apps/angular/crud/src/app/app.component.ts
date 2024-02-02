import { CommonModule } from '@angular/common';
import { Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { GlobalErrorHandler } from './global-error-handler.service';
import { ToDo } from './todo.model';
import { ToDoService } from './todo.service';

@Component({
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    <div *ngIf="loading">
      <mat-spinner></mat-spinner>
    </div>

    <div class="row" *ngFor="let todo of todos">
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
      <button (click)="remove(todo.id)">Delete</button>
      <div *ngIf="isRowLoading(todo.id)">
        <mat-spinner [diameter]="20"></mat-spinner>
      </div>
    </div>
  `,
  styles: [],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class AppComponent implements OnInit, OnDestroy {
  loading = true;
  rowLoading = -1;
  todos!: ToDo[];
  destroyed = new Subject<void>();

  constructor(private todoService: ToDoService) {}

  ngOnDestroy(): void {
    this.destroyed.next();
  }

  ngOnInit(): void {
    this.todoService.currentToDos
      .pipe(takeUntil(this.destroyed))
      .subscribe((todos) => {
        this.todos! = todos;
        this.loading = false;
        this.rowLoading = -1;
      });
    this.loading = true;
    this.rowLoading = -1;
    this.todoService.initialize();
  }

  update(todo: ToDo) {
    this.rowLoading = todo.id;
    this.todoService.update(todo);
  }

  remove(todoId: number) {
    this.rowLoading = todoId;
    this.todoService.delete(todoId);
  }

  isRowLoading(todoId: number) {
    return todoId === this.rowLoading;
  }
}

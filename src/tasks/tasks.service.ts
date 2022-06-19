import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  private tasks: Task[] = [];
  getTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilters(filterDto: GetTasksFilterDto) {
    const { status, search } = filterDto;
    let tasks = this.getTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search),
      );
    }
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;
  }
  deleteTask(id: string): Task[] {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks;
  }
  updateTaskStatus(id: string, status: TaskStatus): any {
    // const task = this.getTaskById(id);
    // task.status = status;
    // return task;
  }
}

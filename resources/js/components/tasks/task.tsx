import { Task, TaskData } from "@/types/task";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, usePage, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { cn } from "@/lib/utils"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { SharedData } from "@/types";
import { TaskStatus } from "@/enums/TaskStatus";

dayjs.extend(relativeTime);

export default function TaskSingle({ task }: { task: TaskData; }) {

  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <div className="p-6 flex space-x-2">
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-gray-800"> {task.user.name} </span>
              <small className="ml-2 text-sm text-gray-600"> {dayjs(task.created_at).fromNow()} </small>
              {
                task.created_at !== task.updated_at && (
                  <small className="text-sm text-gray-600"> &middot; edited</small>
                )}
            </div>
            {task.user.id === auth.user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                  <DropdownMenuItem asChild>
                    <Link href={`/tasks/${task.id}`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link className="w-full" method="delete" href={route('tasks.destroy', task.id)} as="button">Delete</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>

          <div className="mt-4 flex items-center gap-4">
            <Link className="text-lg text-gray-900 underline decoration-sky-500" href={`/tasks/${task.id}`}>{task.title}</Link>

            <span className={cn('px-4 py-2 text-sm text-white rounded-md shadow-sm',
              {
                'bg-orange-500': task.status == TaskStatus.TO_DO,
                'bg-lime-500': task.status == TaskStatus.IN_PROGRESS,
                'bg-sky-500': task.status == TaskStatus.DONE
              })}> {(task.status).replaceAll("-", " ").toUpperCase()} </span>

          </div>
        </div >
      </div >
    </>
  );
}

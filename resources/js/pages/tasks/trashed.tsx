import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/tasks/layout';
import { Task } from '@/types/task';
import TaskCreate from '@/components/tasks/create';
import TasksBin from '@/components/tasks/tasksBin';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tasks Deleted',
    href: '/tasks/trashed',
  },
];

export default function TasksTrashed({ tasks }: { tasks: Task[]; }) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Deleted Tasks" />

      <SettingsLayout>
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            <div className="bg-white shadow sm:rounded-lg">
              <div className="divide-y p-4 sm:p-8">
                {tasks.length > 0 ? (tasks.map(task =>
                  <TasksBin key={task.id}
                    task={task}
                  />

                )) : ("Empty Bin!")}
              </div>
            </div>

          </div>
        </div>
      </SettingsLayout >
    </AppLayout >
  );
}

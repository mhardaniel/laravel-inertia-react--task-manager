import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/tasks/layout';
import { Task, TaskData } from '@/types/task';
import TaskCreate from '@/components/tasks/create';
import TaskSingle from '@/components/tasks/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Update Task',
    href: '/tasks',
  },
];

type TaskForm = {
  parent_id: number;
  title: string;
  content: string;
  status: string;
};

export default function TaskView({ task, parent_url }: { task: TaskData; parent_url?: string }) {
  const { auth } = usePage<SharedData>().props;

  const { data, setData, put, errors, processing, recentlySuccessful } = useForm<Required<TaskForm>>({
    title: task.title,
    content: task.content || '',
    status: task.status,
    parent_id: task ? task.id : '',
    published: task.published || 0,
  });

  const { post, data: uploadData, setData: uploadSetData, progress: uploadProgress } = useForm({
    images: [],
  });


  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('tasks.update', task.id));
  };

  function attachImages(e) {
    e.preventDefault();

    router.post(`/tasks/${task.id}/attach`, {
      _method: 'patch',
      images: uploadData.images,
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Update Task" />

      <SettingsLayout>
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            <div className="py-4">
              {
                !task.parent_id ? (

                  <h2 className="font-semibold text-xl leading-tight">
                    Task</h2>
                ) : (
                  <h2 className="font-semibold text-xl leading-tight">
                    Sub-Task</h2>
                )}

            </div>

            <div>
              <form className="space-y-6" onSubmit={submit}>
                {parent_url && (

                  <div>
                    <Label htmlFor="parent"> Parent task </Label>
                    <Link className="block w-full px-4 py-2 text-left text-sm leading-5 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200 transition duration-150 ease-in-out" href={`/tasks/${task.parent_id}`}>{parent_url}</Link>
                  </div>

                )}

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    autoFocus
                    autoComplete="title"
                    placeholder="Type your task here..."
                  />
                  <InputError className="mt-2" message={errors.title} />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea className='h-50' id="content" placeholder="Type your content here." value={data.content} onChange={(e) => setData('content', e.target.value)} />
                  <InputError message={errors.content} className="mt-2" />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select required name="status" id="status" value={data.status} onValueChange={(val) => setData('status', val)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-do">TO DO</SelectItem>
                      <SelectItem value="in-progress">IN PROGRESS</SelectItem>
                      <SelectItem value="done">DONE</SelectItem>
                    </SelectContent>
                  </Select>


                  <InputError message={errors.status} className="mt-2" />
                </div>
                {
                  task.user.id === auth.user.id && (


                    <div className="flex items-center gap-4">
                      <Button disabled={processing}>Save</Button>

                      <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                      >
                        <p className="text-sm text-neutral-600">Saved</p>
                      </Transition>

                      {
                        task.published > 0 && (

                          <Link className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150" href={route('tasks.save-as-draft', task.id)} method="patch">Save as draft</Link>

                        )
                      }


                      <Link className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        href={route('tasks.destroy', task.id)} method="delete" as="button" type="button">Delete</Link>
                    </div>

                  )}

              </form >

            </div>

            <div className="p-4 sm:p-8 shadow sm:rounded-lg">
              <p>Images: </p>

              <form onSubmit={attachImages} encType="multipart/form-data">
                <input className='p-4 border' type="file" onChange={e => uploadSetData('images', e.target.files)} multiple accept="image/jpg, image/jpeg, image/png" />

                {uploadProgress && (
                  <progress value={uploadProgress.percentage} max="100">
                    {uploadProgress.percentage}%
                  </progress>
                )}
                <Button className="ml-4">Attach</Button>
              </form>

              {
                task.images && (

                  <table className="mt-5 w-2/4 text-sm">
                    <thead>
                      <tr>
                        <th className="w-1/2 font-semibold  text-left">Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        task.images.split('|').map(
                          (taskImg, index) =>
                            <tr key={index}>
                              <td>
                                <a target="_blank" href={`/images/${taskImg}`} className="text-blue-600 visited:text-purple-600">
                                  {taskImg}
                                </a>
                              </td>
                            </tr>

                        )
                      }
                    </tbody>
                  </table>

                )
              }


            </div>

            {
              !task.parent_id && (
                <div className="p-4 sm:p-8 shadow sm:rounded-lg">
                  <p className="text-black">Sub-tasks: </p>

                  <div className='my-5'>
                    <TaskCreate task={task} />
                  </div>

                  <div className="p-4 bg-white sm:p-8 shadow sm:rounded-lg">

                    {task.sub_tasks.length > 0 ? (task.sub_tasks.map(subTask =>
                      <TaskSingle key={subTask.id}
                        task={subTask}
                      />

                    )) : ("No sub tasks here yet..")}
                  </div>

                </div>

              )
            }

          </div>
        </div>
      </SettingsLayout >
    </AppLayout >
  );
}

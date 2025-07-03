import { Task, TaskData } from "@/types/task";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";

type TaskForm = {
  parent_id: number;
  title: string;
  content: string;
  status: string;
};

export default function TaskCreate({ task }: { task?: TaskData; }) {

  const { data, setData, post, errors, processing, recentlySuccessful, reset } = useForm<Required<TaskForm>>({
    title: '',
    parent_id: task ? task.id : '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('tasks.store'), {
      onSuccess: () => reset()
    });
  };

  return (

    <form className="space-y-6" onSubmit={submit}>
      <div>
        {task && (
          <input
            type="hidden"
            value={data.parent_id}
          />
        )}
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          className="mt-1 block w-full"
          value={data.title}
          onChange={(e) => setData('title', e.target.value)}
          required
          autoComplete="title"
          placeholder={task ? "Type your sub-task here..." : "Type your task here..."}
        />
        <InputError className="mt-2" message={errors.title} />
      </div>

      <Button className="mt-4" disabled={processing}>Create</Button>

    </form >

  );
}

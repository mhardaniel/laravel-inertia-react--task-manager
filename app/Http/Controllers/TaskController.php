<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Http\Requests\AttachImagesRequest;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $sortByDate = $request->input('sortByDate');
        $sortByTitle = $request->input('sortByTitle');
        $filterByTitle = $request->input('filterByTitle', '');
        $filterByStatus = $request->input('filterByStatus', '');
        $limitPerPage = $request->input('limitPerPage');

        $query = Task::with('user:id,name')->where('parent_id', null)->where('user_id', $request->user()->id);

        if ($filterByTitle) {
            $query = $query->where('title', 'like', "%{$filterByTitle}%");
        }

        if ($filterByStatus) {
            $query = $query->where('status', $filterByStatus);
        }

        if ($sortByDate) {
            $query = $query->orderBy('created_at', $sortByDate);
        }

        if ($sortByTitle) {
            $query = $query->orderBy('title', $sortByTitle);
        }

        return Inertia::render('tasks/index', [
            'tasks' => $query->paginate($limitPerPage),
            'sortByDate' => $sortByDate,
            'filterByTitle' => $filterByTitle,
            'filterByStatus' => $filterByStatus,
            'sortByTitle' => $sortByTitle,
            'limitPerPage' => $limitPerPage,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->safe()->only(['title']));
        $parentId = $request->input('parent_id');

        if ($parentId) {
            $task->parent_id = $parentId;
            $task->save();
        }

        return redirect(route('tasks.show', $task->id));
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task): Response
    {
        Gate::authorize('view', $task);

        $data = [
            'task' => $task->load('user:id,name', 'subTasks.user'),
        ];

        $subTaskTotal = $task->subTasks->count();
        $subTaskDoneStatusTotal = $task->subTasks->where('status', TaskStatus::DONE)->count();

        if ($subTaskTotal == $subTaskDoneStatusTotal) {
            $task->status = TaskStatus::DONE;
            $task->save();
        }

        if ($task->parent_id) {
            $data['parent_url'] = route('tasks.show', $task->parent_id);
        }

        return Inertia::render('tasks/view', $data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validated = $request->validated();

        $task->title = $validated['title'];
        $task->content = $validated['content'];
        $task->status = $validated['status'];
        $task->save();

        return redirect(route('tasks.show', $task->id));
    }

    public function saveAsDraft(Request $request, Task $task)
    {
        Gate::authorize('update', $task);

        $task->published = 0;
        $task->save();

        return redirect(route('tasks.show', $task->id));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return redirect(route('tasks.index'));
    }

    public function forceDestroy(Task $task)
    {
        Gate::authorize('forceDelete', $task);

        $task->forceDelete();

        return redirect(route('tasks.trashed'));
    }

    public function attach(AttachImagesRequest $request, Task $task)
    {
        $images = [];
        if ($files = $request->file('images')) {
            foreach ($files as $file) {
                $name = Str::random(10).'.'.$file->getClientOriginalExtension();
                $file->move('images', $name);
                $images[] = $name;
            }
        }

        $task->images = implode('|', array_merge(explode('|', $task->images), $images));
        $task->save();

        return redirect(route('tasks.show', $task->id));
    }

    public function trashed(Request $request): Response
    {
        $data = [
            'tasks' => Task::onlyTrashed()->with('user:id,name')->orderBy('created_at', 'desc')->where('user_id', $request->user()->id)->get(),
        ];

        return Inertia::render('tasks/trashed', $data);
    }
}

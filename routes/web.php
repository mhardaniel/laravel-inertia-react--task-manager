<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->controller(TaskController::class)->prefix('tasks')->name('tasks.')->group(function () {
    Route::delete('/trashed/{task}', 'forceDestroy')->withTrashed()->name('forceDestroy');
    Route::get('/trashed', 'trashed')->name('trashed');
    Route::patch('/{task}/attach', 'attach')->name('attach');
    Route::patch('/{task}/save-as-draft', 'saveAsDraft')->name('save-as-draft');
});

Route::apiResource('tasks', TaskController::class)
    ->middleware(['auth', 'verified']);

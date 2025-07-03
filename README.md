![Image](https://github.com/user-attachments/assets/d817f5c7-3368-4e50-acea-d01ab173d593)

![Image](https://github.com/user-attachments/assets/67598acc-bee1-4f0f-8bac-9cdd28b7f176)

## Requirements

-   Docker Desktop
-   WSL

## Tech Stacks used

-   Laravel
-   Inertia JS (React JS)
-   CSS (Tailwind)
-   Database (SQlite)
-   Sail

## Running

1. open your terminal
2. ```git clone git@github.com:mhardaniel/laravel-inertia-react--task-manager.git```
3. ```cd laravel-inertia-react--task-manager```
4. ```cp .env.example .env```
5. ```php artisan key:generate```
6. ```./vendor/bin/sail up -d```
7. ```./vendor/bin/sail npm run dev```
8. ```php artisan migrate```
9. you can access the api routes at: http://localhost:8000

## API Routes
|METHOD | ROUTE | SRC |
| --- | --- | --- |
|GET |tasks | tasks.index › TaskController@index
|POST      |      tasks | tasks.store › TaskController@store
|GET |        tasks/trashed | tasks.trashed › TaskController@trashed
|DELETE     |     tasks/trashed/{task} | tasks.forceDestroy › TaskController@forceDestroy
|GET|        tasks/{task} | tasks.show › TaskController@show
|PUT|       tasks/{task} | tasks.update › TaskController@update
|DELETE     |     tasks/{task} | tasks.destroy › TaskController@destroy
|PATCH      |     tasks/{task}/attach | tasks.attach › TaskController@attach
|PATCH    |       tasks/{task}/save-as-draft | tasks.save-as-draft › TaskController@saveAsDraf

## Pruning

Tasks that are moved to trash can be deleted permanently either manually or within 30
days.

-   ```php artisan model:prune --pretend```

### Thank you, Regards

mhardaniel

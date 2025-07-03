import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/tasks/layout';
import { PagLink, Task } from '@/types/task';
import TaskCreate from '@/components/tasks/create';
import TaskSingle from '@/components/tasks/task';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Pagination } from "react-headless-pagination";
import { cn } from "@/lib/utils"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tasks List',
    href: '/tasks',
  },
];

export default function Tasks({ tasks, sortByDate, filterByTitle, filterByStatus, sortByTitle, limitPerPage }: { tasks: Task; sortByDate: string; filterByTitle: string; filterByStatus: string; sortByTitle: string; limitPerPage: number; }) {
  const { auth } = usePage<SharedData>().props;
  const [page, setPage] = React.useState<number>(tasks.current_page - 1);

  const { data: filterByData, setData: setFilterByData, post, processing: filterByProcessing } = useForm({
    filterByTitle: filterByTitle || '',
    filterByStatus: filterByStatus || '',
    sortByDate: sortByDate || '',
    sortByTitle: sortByTitle || '',
    limitPerPage: limitPerPage || '',
  });

  const handlePageChange = (page: number) => {
    setPage(page);

    router.get('/tasks', { ...filterByData, page: page + 1 })
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="List Tasks" />

      <SettingsLayout>
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

            <div className="py-4">

              <TaskCreate />

            </div>

            <form action="" method="get" id="filter">

              <div className="flex flex-wrap gap-4">

                <div className="flex w-1/2 items-center">
                  <Input
                    name="filterByTitle" type="text" value={filterByData.filterByTitle} autoFocus placeholder="Search task by title..." onChange={(e) => setFilterByData('filterByTitle', e.target.value)} />
                </div>

                <div className="flex gap-2 items-center">

                  <Label htmlFor="filterByStatus">Status</Label>
                  <Select name="filterByStatus" id="filterByStatus" value={filterByData.filterByStatus} onValueChange={(val) => setFilterByData('filterByStatus', val)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-do">TO DO</SelectItem>
                      <SelectItem value="in-progress">IN PROGRESS</SelectItem>
                      <SelectItem value="done">DONE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                <div className="flex gap-2 items-center">

                  <Label htmlFor="sortByDate">Date:</Label>
                  <Select name="sortByDate" id="sortByDate" value={filterByData.sortByDate} onValueChange={(val) => setFilterByData('sortByDate', val)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Desc</SelectItem>
                      <SelectItem value="asc">Asc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">

                  <Label htmlFor="sortByTitle">Title:</Label>
                  <Select name="sortByTitle" id="sortByTitle" value={filterByData.sortByTitle} onValueChange={(val) => setFilterByData('sortByTitle', val)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Desc</SelectItem>
                      <SelectItem value="asc">Asc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">

                  <Label htmlFor="limitPerPage">Limit:</Label>
                  <Select name="limitPerPage" id="limitPerPage" value={`${filterByData.limitPerPage}`} onValueChange={(val) => setFilterByData('limitPerPage', val)} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-center">
                  <Link disabled={filterByProcessing} href="/tasks" data={filterByData} preserveState>Filter</Link>

                  {(filterByTitle || filterByStatus) && (

                    <Link className="inline-block px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 transition duration-150 ease-in-out" href={"/tasks"}>Clear</Link>

                  )}
                </div>

                <div className="flex gap-2 items-center ml-auto">

                  <Link className="px-4 py-2 rounded-md bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40" href={"/tasks/trashed"}>Trashed &#128465;</Link>

                </div>
              </div>

            </form>

            <div className="bg-white shadow sm:rounded-lg">
              <div className="divide-y p-4 sm:p-8">
                {tasks.data.length > 0 ? (tasks.data.map(task =>
                  <TaskSingle key={task.id}
                    task={task}
                  />

                )) : ("No tasks here yet..")}


                <Pagination
                  totalPages={tasks.last_page}
                  currentPage={page}
                  setCurrentPage={handlePageChange}
                  className="flex items-center w-full h-10 text-sm select-none"
                  truncableText="..."
                  truncableClassName="w-10 px-0.5 text-center"
                >
                  <Pagination.PrevButton as={<button />} className={cn(
                    "flex items-center mr-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200",
                    {
                      "cursor-pointer": page !== 0,
                      "opacity-50": page === 0,
                    }
                  )}><ChevronLeftIcon />
                    Previous</Pagination.PrevButton>

                  <nav className="flex justify-center flex-grow">
                    <ul className="flex items-center">
                      <Pagination.PageButton
                        activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-black"
                        inactiveClassName="text-gray-500"
                        className={
                          "flex items-center justify-center hover:text-primary-600 focus:font-bold focus:text-primary-600 focus:outline-none h-10 w-10 rounded-full cursor-pointer"
                        }
                      />
                    </ul>
                  </nav>

                  <Pagination.NextButton className={cn(
                    "flex items-center mr-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-200",
                    {
                      "cursor-pointer": page !== tasks.last_page - 1,
                      "opacity-50": page === tasks.last_page - 1,
                    },
                  )}>Next  <ChevronRightIcon /></Pagination.NextButton>
                </Pagination>


              </div>
            </div>

          </div>
        </div>
      </SettingsLayout >
    </AppLayout >
  );
}

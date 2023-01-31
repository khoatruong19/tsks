import Head from 'next/head'
import React from 'react'
import MainLayout from '../components/layout/MainLayout'
import Loader from '../components/others/Loader'
import TodoTaskCard from '../components/task/TodoTaskCard'
import { trpc } from '../utils/trpc'

const FlagsCompleted = () => {

  const {data, isLoading} = trpc.task.getDoneFlagTasksInThisWeek.useQuery()

  return (
    <>
    <Head>
      <title>Goal tasks completed</title>
    </Head>
    <MainLayout>
      <div className="h-[calc(100vh_-_65px)] w-full overflow-hidden">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="mx-auto h-[100%] w-full max-w-3xl overflow-y-scroll  px-2 pb-10 scrollbar-hide md:px-0">
            <div className="pt-10">
              <div className="mb-6 flex flex-col gap-5 md:gap-12">
                  <h3 className="text-3xl font-bold text-white">Goal tasks completed</h3>
              </div>
              <div className='flex flex-col gap-1'>
                {data && data.map(task => (
                    <TodoTaskCard show key={task.id} task={task} deleteTask={() => {}} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  </>
  )
}

export default FlagsCompleted
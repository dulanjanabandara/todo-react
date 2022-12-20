import React, { FC, ReactElement } from 'react';
import { Grid, Box, Alert, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';

import { TaskCounter } from '../taskCounter/taskCounter';
import { Task } from '../task/task';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';
import { Status } from '../createTaskForm/enums/Status';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { countTasks } from './helpers/countTasks';

export const TaskArea: FC = (): ReactElement => {
  const { error, isLoading, data, refetch } = useQuery(['tasks'], async () => {
    return await sendApiRequest<ITaskApi[]>(
      'http://localhost:3200/tasks',
      'GET',
    );
  });

  const updateTaskMutation = useMutation((data: IUpdateTask) =>
    sendApiRequest('http://localhost:3200/tasks', 'PUT', data),
  );

  function onStatusChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked ? Status.inProgress : Status.todo,
    });
  }

  function markCompleteHandler(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({ id, status: Status.completed });
  }

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status of Your Tasks As On, {format(new Date(), 'PPPP')}</h2>
      </Box>
      <Grid container display="flex" justifyContent="center">
        <Grid
          item
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter
            status={Status.todo}
            count={data ? countTasks(data, Status.todo) : undefined}
          />
          <TaskCounter
            status={Status.inProgress}
            count={data ? countTasks(data, Status.inProgress) : undefined}
          />
          <TaskCounter
            status={Status.completed}
            count={data ? countTasks(data, Status.completed) : undefined}
          />
        </Grid>
        <Grid item display="flex" flexDirection="column" xs={10} md={8}>
          <>
            {error && (
              <Alert severity="error">
                There was an error fetching your data!
              </Alert>
            )}
            {!error && Array.isArray(data) && data.length === 0 && (
              <Alert severity="warning">
                You do not have any tasks yet. Start by creating some tasks.
              </Alert>
            )}

            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((dataItem, index) => {
                return dataItem.status === Status.todo ||
                  dataItem.status === Status.inProgress ? (
                  <Task
                    key={index + dataItem.priority}
                    id={dataItem.id}
                    title={dataItem.title}
                    date={new Date(dataItem.date)}
                    description={dataItem.description}
                    status={dataItem.status}
                    priority={dataItem.priority}
                    onStatusChange={onStatusChangeHandler}
                    onClick={markCompleteHandler}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

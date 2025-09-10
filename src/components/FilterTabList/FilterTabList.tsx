import type { ToDoStatus } from '../../types/types';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useAppSelector } from '../../store/redux';
import { selectFilter, setFilter } from '../../store/Todos/filter.slice';
import { todosApi } from '../../store/Todos/api';
import { useDispatch } from 'react-redux';

const FilterTabList = () => {
  const dispatch = useDispatch();
  const { data } = todosApi.useGetTodosQuery('all', {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
  });
  const todoInfo = data?.info ?? {
    all: 0,
    completed: 0,
    inWork: 0,
  };

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: `Все (${todoInfo.all})`,
    },
    {
      key: 'inWork',
      label: `В работе (${todoInfo.inWork})`,
    },
    {
      key: 'completed',
      label: `Сделано (${todoInfo.completed})`,
    },
  ];

  const filter = useAppSelector((state) => selectFilter(state).filter);

  // antd передаёт стрингу, поэтому кастую к ToDoStatus и делаю тайп гард
  const handleChange = (key: ToDoStatus) => {
    if (key === 'all' || key === 'inWork' || key === 'completed') {
      dispatch(setFilter({ filter: key }));
    }
  };

  return (
    <Tabs
      defaultActiveKey='all'
      activeKey={filter}
      items={items}
      onChange={(activeKey) => handleChange(activeKey as ToDoStatus)}
      centered={true}
      indicator={{ size: 0 }}
      size='large'
    />
  );
};
export default FilterTabList;

import type { TodoInfo, ToDoStatus } from '../../types/todo';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './FilterTabList.module.scss';

type FilterTabListProps = {
	filter: ToDoStatus;
	setFilter: (arg: ToDoStatus) => void;
	todoInfo: TodoInfo;
};

export default function FilterTabList({
	filter,
	setFilter,
	todoInfo,
}: FilterTabListProps) {
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

	const onChange = (key: string) => {
		if (key === 'all' || key === 'inWork' || key === 'completed') {
			setFilter(key);
		}
	};

	return (
		<div className={styles.filterTabList}>
			<Tabs
				defaultActiveKey="all"
				activeKey={filter}
				items={items}
				onChange={onChange}
				centered={true}
				indicator={{ size: 0 }}
				size="large"
			/>
		</div>
	);
}

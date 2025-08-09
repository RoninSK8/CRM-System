import type { TodoInfo, toDoStatus } from '../../lib/types';
import styles from './FilterTabList.module.scss';

type FilterTabListProps = {
	filter: toDoStatus;
	setFilter: (arg: toDoStatus) => void;
	todoInfo: TodoInfo;
};

export default function FilterTabList({
	filter,
	setFilter,
	todoInfo,
}: FilterTabListProps) {
	const handleClick = (
		e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
		status: toDoStatus
	) => {
		e.preventDefault();
		setFilter(status);
	};

	return (
		<div className={styles.filterTabList}>
			<a
				href="#"
				className={`${filter === 'all' ? styles.tabActive : ''}`}
				key={'all'}
				onClick={(e) => handleClick(e, 'all')}
			>
				{`Все (${todoInfo.all})`}
			</a>
			<a
				href="#"
				className={`${filter === 'inWork' ? styles.tabActive : ''}`}
				key={'inWork'}
				onClick={(e) => handleClick(e, 'inWork')}
			>
				{`В работе (${todoInfo.inWork})`}
			</a>
			<a
				href="#"
				className={`${filter === 'completed' ? styles.tabActive : ''}`}
				key={'completed'}
				onClick={(e) => handleClick(e, 'completed')}
			>
				{`Сделано (${todoInfo.completed})`}
			</a>
		</div>
	);
}

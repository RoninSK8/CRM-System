import React from 'react';
import styles from './IconButton.module.scss';
type ButtonColorVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	colorVariant?: ButtonColorVariant;
	icon: React.ReactNode;
}

const IconButton = ({
	colorVariant = 'primary',
	icon,
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			className={`${styles.iconButton} ${styles[colorVariant]}`}
		>
			{icon}
			{/* {icon && (
				<img
					src={`/icons/${icon}.svg`}
					className={styles.icon}
					width="24"
					height="24"
					alt="icon"
				></img>
			)} */}
		</button>
	);
};

export default IconButton;

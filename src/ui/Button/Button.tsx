import React from 'react';
import styles from './Button.module.scss';
type ButtonColorVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	colorVariant?: ButtonColorVariant;
	icon?: string;
}

const Button = ({
	children,
	colorVariant = 'primary',
	icon,
	...props
}: ButtonProps) => {
	return (
		<button {...props} className={`${styles.button} ${styles[colorVariant]}`}>
			{children}
			{icon && (
				<img
					src={`/icons/${icon}.svg`}
					className={styles.icon}
					width="24"
					height="24"
					alt="icon"
				></img>
			)}
		</button>
	);
};

export default Button;

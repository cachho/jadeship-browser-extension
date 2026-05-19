export function getToolbarDisplayState(isCollapsed: boolean) {
	const isBodyHidden = isCollapsed;
	return { isBodyHidden };
}

export function getConvertErrorMessage(statusCode: number, statusName: string) {
	return `Failed to get converted links (Error ${statusCode}: ${statusName})`;
}

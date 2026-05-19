export function getToolbarDisplayState(
  isCollapsed: boolean,
  convertError: string | null
) {
  const isErrorState = Boolean(convertError);
  const isBodyHidden = isCollapsed && !isErrorState;
  return { isErrorState, isBodyHidden };
}

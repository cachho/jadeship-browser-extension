export const Button = (href: string, newTab?: boolean) => {
  const button = document.createElement('a');
  button.style.margin = '8px';
  button.style.border = '2px solid';
  button.style.padding = '8px';
  button.style.borderColor = '#FFFFFF';
  button.style.background = 'linear-gradient(90deg, #c659d9 0%, #F679d9 100%)';
  button.style.color = '#FFFFFF';
  button.style.textDecoration = 'none';
  if (newTab) {
    button.target = '_blank';
    button.rel = 'noreferrer';
  }

  button.href = href;
  return button;
};

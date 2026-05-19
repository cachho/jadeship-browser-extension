export const Button = (href: string, newTab?: boolean) => {
	const button = document.createElement("a");

	button.className = "btn";

	if (newTab) {
		button.target = "_blank";
		button.rel = "noreferrer";
	}
	button.href = href;

	button.innerHTML = `
    <span class="btn-text">Action Link</span>
    <div class="btn-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  `;

	return button;
};

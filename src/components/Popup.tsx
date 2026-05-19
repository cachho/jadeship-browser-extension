/* eslint-disable no-return-assign */
import type React from "react";
import { useEffect, useState } from "react";

import { Config } from "../Config";
import { agents, agentsWithRaw } from "../lib/cn-links";
import { getStorage, isChromeStorage } from "../lib/storage";
import type { AgentWithRaw, Settings } from "../models";
import { defaultSettings, settingNames } from "../models/Settings";

const GlassCard = ({
	title,
	children,
	delay = "0ms",
	badge,
}: {
	title?: string;
	children: React.ReactNode;
	delay?: string;
	badge?: string;
}) => (
	<div
		className="glass-card-outer animate-enter"
		style={{ animationDelay: delay, marginBottom: "16px" }}
	>
		<div className="glass-card-inner">
			{title && (
				<div
					className="glass-card-eyebrow"
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "14px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
						<div className="glass-card-eyebrow-dot" />
						<h3 className="glass-card-title" style={{ margin: 0 }}>
							{title}
						</h3>
					</div>
					{badge && (
						<span
							style={{
								fontSize: "10px",
								color: "rgba(255, 255, 255, 0.4)",
								backgroundColor: "rgba(255, 255, 255, 0.05)",
								padding: "2px 6px",
								borderRadius: "4px",
								textTransform: "uppercase",
								letterSpacing: "0.05em",
							}}
						>
							{badge}
						</span>
					)}
				</div>
			)}
			{children}
		</div>
	</div>
);

const HiddenToggle = ({
	checked,
	onChange,
	label,
	description,
	disabled = false,
}: {
	checked: boolean;
	onChange: () => void;
	label: string;
	description?: string;
	disabled?: boolean;
}) => (
	<label
		className="haptic-toggle"
		style={{
			opacity: disabled ? 0.5 : 1,
			pointerEvents: disabled ? "none" : "auto",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			cursor: "pointer",
			width: "100%",
			margin: "8px 0",
		}}
	>
		<div
			className="toggle-text-group"
			style={{ display: "flex", flexDirection: "column", gap: "2px" }}
		>
			<span
				className="toggle-label"
				style={{
					fontSize: "14px",
					fontWeight: 500,
					color: "rgba(255, 255, 255, 0.95)",
				}}
			>
				{label}
			</span>
			{description && (
				<span
					className="toggle-desc"
					style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.45)" }}
				>
					{description}
				</span>
			)}
		</div>
		<div
			className="toggle-switch"
			style={{ position: "relative", width: "44px", height: "24px" }}
		>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				disabled={disabled}
				style={{ opacity: 0, width: 0, height: 0 }}
			/>
			<div className="toggle-track" />
			<div className="toggle-knob" />
		</div>
	</label>
);

const Popup = () => {
	const [settings, setSettings] = useState<Settings>(defaultSettings);
	const storage = getStorage();
	const sortedAgents = agents.slice().sort((a, b) => a.localeCompare(b));

	function setValues(updatedSettings: Partial<Settings>) {
		setSettings((prevSettings) => ({
			...prevSettings,
			...updatedSettings,
			isDefault: false,
		}));
	}

	function loadFromLocalStorage() {
		if (isChromeStorage(storage)) {
			storage.local.get(settingNames, (data) => {
				setValues(data as Partial<Settings>);
			});
		} else if (storage && !isChromeStorage(storage)) {
			storage.local.get(settingNames).then((data) => {
				setValues(data as Partial<Settings>);
			});
		}
	}

	function saveToLocalStorage() {
		storage?.local.set(settings);
	}

	// biome-ignore lint: Dependency list is correct
	useEffect(() => {
		if (settings.isDefault === true) {
			loadFromLocalStorage();
			setSettings({ ...settings, isDefault: false });
		} else {
			saveToLocalStorage();
		}
	}, [settings]);

	const toggleAllAction =
		!settings.taobaoLink ||
		!settings.weidianLink ||
		!settings.s1688Link ||
		!settings.tmallLink ||
		!settings.agentLink ||
		!settings.thirdPartyLink;

	const handleChangeMyAgent = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newMyAgent = e.target.value as AgentWithRaw;
		if (!agentsWithRaw.includes(newMyAgent)) {
			console.error("Invalid agent");
			return;
		}
		const newAgentsInToolbar = new Set(settings.agentsInToolbar);
		if (newMyAgent !== "raw" && !newAgentsInToolbar.has(newMyAgent)) {
			newAgentsInToolbar.add(newMyAgent);
		}
		setSettings({
			...settings,
			myAgent: newMyAgent,
			agentsInToolbar: Array.from(newAgentsInToolbar),
		});
	};

	return (
		<div
			className="popup"
			style={{
				width: "420px",
				maxHeight: "600px",
				overflowY: "auto",
				boxSizing: "border-box",
			}}
		>
			{/* Header */}
			<header
				className="header animate-enter"
				style={{ animationDelay: "0ms", padding: "20px 20px 10px 20px" }}
			>
				<h1
					className="title"
					style={{
						margin: "0 0 4px 0",
						fontSize: "24px",
						fontWeight: 800,
						letterSpacing: "-0.03em",
					}}
				>
					JadeShip
				</h1>
				<p
					className="subtitle"
					style={{
						margin: 0,
						fontSize: "12px",
						color: "rgba(255, 255, 255, 0.4)",
						textTransform: "uppercase",
						letterSpacing: "0.05em",
					}}
				>
					Shopping Agent Extension
				</p>
			</header>

			<div className="content" style={{ padding: "0 20px 20px 20px" }}>
				<GlassCard title="My Shopping Agent" delay="50ms">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<div className="custom-select-wrapper">
							<select
								onChange={handleChangeMyAgent}
								value={settings.myAgent}
								className="custom-select"
							>
								{[...sortedAgents, "raw"].map((agent) => (
									<option
										value={agent}
										key={`agent-${agent}`}
										style={{ backgroundColor: "#0a0a0c", color: "#fff" }}
									>
										{agent[0].toUpperCase() + agent.substring(1)}
									</option>
								))}
							</select>
							<div className="custom-select-icon">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<title>Arrow Down</title>
									<path d="M6 9l6 6 6-6" />
								</svg>
							</div>
						</div>

						<div style={{ paddingLeft: "2px" }}>
							<a
								href={Config.social.bestAgent}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#34d399",
									textDecoration: "none",
									fontSize: "12px",
									fontWeight: 500,
									display: "inline-flex",
									alignItems: "center",
									gap: "4px",
								}}
							>
								Find the best agent for you →
							</a>
						</div>
					</div>
				</GlassCard>

				<GlassCard title="Settings" delay="100ms" badge="Scope">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<HiddenToggle
							label="Toggle all links conversion"
							checked={!toggleAllAction}
							onChange={() =>
								toggleAllAction
									? setSettings({
											...settings,
											taobaoLink: true,
											weidianLink: true,
											s1688Link: true,
											tmallLink: true,
											agentLink: true,
											thirdPartyLink: true,
										})
									: setSettings({
											...settings,
											taobaoLink: false,
											weidianLink: false,
											s1688Link: false,
											tmallLink: false,
											agentLink: false,
											thirdPartyLink: false,
										})
							}
						/>

						<div
							style={{
								height: "1px",
								backgroundColor: "rgba(255, 255, 255, 0.06)",
								margin: "4px 0",
							}}
						/>

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "12px 16px",
							}}
						>
							{[
								{ key: "taobaoLink", label: "Taobao Links" },
								{ key: "weidianLink", label: "Weidian Links" },
								{ key: "s1688Link", label: "1688 Links" },
								{ key: "tmallLink", label: "Tmall Links" },
								{ key: "agentLink", label: "Agent Links" },
								{ key: "thirdPartyLink", label: "Third Party Links" },
							].map(({ key, label }) => (
								<label
									key={key}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
										cursor: "pointer",
									}}
								>
									<input
										type="checkbox"
										checked={settings[key as keyof Settings] as boolean}
										onChange={() =>
											setSettings({
												...settings,
												[key]: !settings[key as keyof Settings],
											})
										}
										style={{
											accentColor: "#10b981",
											width: "14px",
											height: "14px",
											cursor: "pointer",
										}}
									/>
									<span
										style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)" }}
									>
										{label}
									</span>
								</label>
							))}
						</div>
					</div>
				</GlassCard>

				<GlassCard
					title="Toolbar Configuration"
					delay="150ms"
					badge="Requires Reload"
				>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<HiddenToggle
							label="Show toolbar"
							description="Floating toolbar with all your shopping agents"
							checked={settings.showToolbar}
							onChange={() =>
								setSettings({ ...settings, showToolbar: !settings.showToolbar })
							}
						/>

						<HiddenToggle
							label="Sticky toolbar position"
							checked={settings.stickyToolbar}
							onChange={() =>
								setSettings({
									...settings,
									stickyToolbar: !settings.stickyToolbar,
								})
							}
						/>

						{settings.showToolbar && (
							<>
								<div
									style={{
										height: "1px",
										backgroundColor: "rgba(255, 255, 255, 0.06)",
										margin: "4px 0",
									}}
								/>
								<div
									style={{
										fontSize: "12px",
										color: "rgba(255, 255, 255, 0.4)",
										fontWeight: 600,
										textTransform: "uppercase",
										letterSpacing: "0.03em",
									}}
								>
									Agents in toolbar:
								</div>

								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr 1fr",
										gap: "6px",
									}}
								>
									{sortedAgents.map((agent) => {
										const checked = settings.agentsInToolbar.includes(agent);
										const disabled = settings.myAgent === agent;
										function swap() {
											const newSet = new Set(settings.agentsInToolbar);
											if (checked) {
												newSet.delete(agent);
											} else {
												newSet.add(agent);
											}
											setSettings({
												...settings,
												agentsInToolbar: Array.from(newSet),
											});
										}
										return (
											// biome-ignore lint: No need to have a keyboard action for this
											<div
												key={`toolbar-includes-${agent}`}
												onClick={() => !disabled && swap()}
												style={{
													display: "flex",
													alignItems: "center",
													gap: "8px",
													padding: "8px 10px",
													backgroundColor: checked
														? "rgba(16, 185, 129, 0.06)"
														: "rgba(255, 255, 255, 0.01)",
													border: `0.5px solid ${
														checked
															? "rgba(16, 185, 129, 0.25)"
															: "rgba(255, 255, 255, 0.06)"
													}`,
													borderRadius: "8px",
													opacity: disabled ? 0.4 : 1,
													cursor: disabled ? "not-allowed" : "pointer",
												}}
											>
												<input
													type="checkbox"
													checked={checked}
													disabled={disabled}
													readOnly
													style={{
														width: "12px",
														height: "12px",
														accentColor: "#10b981",
														pointerEvents: "none",
													}}
												/>
												<span
													style={{
														fontSize: "12px",
														fontWeight: "500",
														color: checked
															? "#a7f3d0"
															: "rgba(255,255,255,0.7)",
													}}
												>
													{agent[0].toUpperCase() + agent.substring(1)}
												</span>
											</div>
										);
									})}
								</div>

								{settings.agentsInToolbar.length > 6 && (
									<div
										style={{
											padding: "8px 12px",
											backgroundColor: "rgba(239, 68, 68, 0.08)",
											border: "0.5px solid rgba(239, 68, 68, 0.2)",
											borderRadius: "8px",
											fontSize: "11px",
											color: "#f87171",
										}}
									>
										⚠️ Selecting too many agents might cause visibility issues on
										smaller screens.
									</div>
								)}
							</>
						)}
					</div>
				</GlassCard>

				<GlassCard title="Online Operational Features" delay="200ms">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "10px" }}
					>
						<HiddenToggle
							label="Enable QC Photos"
							description="Fetch quality check data dynamically"
							checked={settings.onlineFeaturesQcPhotos}
							onChange={() =>
								setSettings({
									...settings,
									onlineFeaturesQcPhotos: !settings.onlineFeaturesQcPhotos,
								})
							}
						/>
						<HiddenToggle
							label="Online Features"
							checked={settings.onlineFeatures}
							onChange={() =>
								setSettings({
									...settings,
									onlineFeatures: !settings.onlineFeatures,
								})
							}
						/>

						<div
							style={{
								padding: "10px 12px",
								backgroundColor: "rgba(59, 130, 246, 0.06)",
								border: "0.5px solid rgba(59, 130, 246, 0.15)",
								borderRadius: "8px",
								fontSize: "11px",
								lineHeight: "1.4",
								color: "rgba(147, 197, 253, 0.85)",
							}}
						>
							<p style={{ margin: "0 0 4px 0" }}>
								Online and QC features are powered by {Config.name} and
								partners. By enabling you agree to the{" "}
								<a
									href={Config.legal.main.tos}
									target="_blank"
									rel="noreferrer"
									style={{ color: "#60a5fa", textDecoration: "none" }}
								>
									Terms of Service
								</a>{" "}
								and{" "}
								<a
									href={Config.legal.main.privacy}
									target="_blank"
									rel="noreferrer"
									style={{ color: "#60a5fa", textDecoration: "none" }}
								>
									Privacy Policy
								</a>
								.
							</p>
						</div>
					</div>
				</GlassCard>

				<GlassCard title="Display" delay="250ms">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<div
							style={{ display: "flex", flexDirection: "column", gap: "4px" }}
						>
							<div
								style={{
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "rgba(255,255,255,0.4)",
									fontWeight: 600,
									paddingBottom: "2px",
								}}
							>
								Logos Controls
							</div>
							<HiddenToggle
								label="Show agent logo"
								checked={settings.logoAgent}
								onChange={() =>
									setSettings({ ...settings, logoAgent: !settings.logoAgent })
								}
							/>
							<HiddenToggle
								label="Show platform logo"
								checked={settings.logoPlatform}
								onChange={() =>
									setSettings({
										...settings,
										logoPlatform: !settings.logoPlatform,
									})
								}
							/>
						</div>

						<div
							style={{
								height: "1px",
								backgroundColor: "rgba(255, 255, 255, 0.06)",
							}}
						/>

						<div
							style={{ display: "flex", flexDirection: "column", gap: "6px" }}
						>
							<div
								style={{
									fontSize: "11px",
									textTransform: "uppercase",
									letterSpacing: "0.05em",
									color: "rgba(255,255,255,0.4)",
									fontWeight: 600,
									paddingBottom: "4px",
								}}
							>
								Content Elements
							</div>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									gap: "10px 14px",
								}}
							>
								{[
									{ key: "showThumbnail", label: "Show thumbnail" },
									{ key: "showPrice", label: "Show price" },
									{ key: "showAmountSold", label: "Show sales amount" },
									{ key: "showPos", label: "Show position" },
									{ key: "showTitle", label: "Show title" },
								].map(({ key, label }) => (
									<label
										key={key}
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
											cursor: "pointer",
										}}
									>
										<input
											type="checkbox"
											checked={settings[key as keyof Settings] as boolean}
											onChange={() =>
												setSettings({
													...settings,
													[key]: !settings[key as keyof Settings],
												})
											}
											style={{
												accentColor: "#10b981",
												width: "14px",
												height: "14px",
											}}
										/>
										<span
											style={{
												fontSize: "12px",
												color: "rgba(255,255,255,0.75)",
											}}
										>
											{label}
										</span>
									</label>
								))}
							</div>
						</div>

						<div
							style={{
								height: "1px",
								backgroundColor: "rgba(255, 255, 255, 0.06)",
							}}
						/>

						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "4px 0",
							}}
						>
							<div style={{ display: "flex", flexDirection: "column" }}>
								<span
									style={{
										fontSize: "13px",
										fontWeight: "500",
										color: "rgba(255,255,255,0.95)",
									}}
								>
									Max title length
								</span>
								<span
									style={{
										fontSize: "11px",
										color: "rgba(255, 255, 255, 0.4)",
										marginTop: "1px",
									}}
								>
									Set to 0 for unlimited length
								</span>
							</div>
							<input
								type="number"
								min="0"
								value={parseInt(settings.displayTitleLength, 10) || 0}
								onChange={(e) =>
									setSettings({
										...settings,
										displayTitleLength: e.target.value,
									})
								}
								style={{
									width: "64px",
									backgroundColor: "rgba(255, 255, 255, 0.03)",
									border: "1px solid rgba(255, 255, 255, 0.08)",
									color: "white",
									textAlign: "center",
									borderRadius: "6px",
									padding: "6px 8px",
									fontSize: "13px",
									outline: "none",
								}}
							/>
						</div>

						<HiddenToggle
							label="Overwrite title"
							checked={settings.displayOverwriteTitle}
							onChange={() =>
								setSettings({
									...settings,
									displayOverwriteTitle: !settings.displayOverwriteTitle,
								})
							}
						/>
					</div>
				</GlassCard>

				<GlassCard title="Support" delay="300ms">
					<div
						style={{ display: "flex", flexDirection: "column", gap: "12px" }}
					>
						<HiddenToggle
							label="Enable affiliate program"
							checked={settings.affiliateProgram}
							onChange={() =>
								setSettings({
									...settings,
									affiliateProgram: !settings.affiliateProgram,
								})
							}
						/>

						<div
							style={{
								padding: "12px",
								backgroundColor: "rgba(16, 185, 129, 0.05)",
								border: "0.5px solid rgba(16, 185, 129, 0.15)",
								borderRadius: "8px",
								fontSize: "12px",
								lineHeight: "1.4",
								color: "rgba(52, 211, 153, 0.9)",
							}}
						>
							💚 <strong>Support free software:</strong> Affiliate links are
							automatically added to agent URLs at no cost to you. This supports
							transparency, freedom of choice, and competition between agents.
							You can opt out anytime.
						</div>
					</div>
				</GlassCard>
			</div>
		</div>
	);
};

export default Popup;

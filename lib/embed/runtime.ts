export type EmbedConfig = {
  token: string;
  containerId: string;
};

export function mountEmbed(cfg: EmbedConfig) {
  const el = document.getElementById(cfg.containerId);
  if (!el) throw new Error("container not found");

  el.innerHTML = `
    <div style="font-family: ui-sans-serif; padding: 12px; border: 1px solid #ddd; border-radius: 12px;">
      <div style="font-weight: 800;">SnapLogic Embed</div>
      <div style="opacity: .7; font-size: 12px;">token: ${cfg.token}</div>
    </div>
  `;
}

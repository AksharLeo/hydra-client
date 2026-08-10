import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { SettingsDebrid } from "./settings-debrid";
import { SettingsRetroAchievements } from "./settings-retroachievements";
import { SelectField, TextField, Button } from "@renderer/components";
import { settingsContext } from "@renderer/context";
import { useAppSelector } from "@renderer/hooks";

export function SettingsContextIntegrations() {
  const { t } = useTranslation("settings");
  const { updateUserPreferences } = useContext(settingsContext);
  const userPreferences = useAppSelector(
    (state) => state.userPreferences.value
  );

  const [needsRestart, setNeedsRestart] = useState(false);
  const [form, setForm] = useState({
    serverType: "official" as "official" | "local" | "custom",
    customBackendUrl: "",
  });

  useEffect(() => {
    if (!userPreferences) return;
    setForm({
      serverType: userPreferences.serverType ?? "official",
      customBackendUrl: userPreferences.customBackendUrl ?? "",
    });
  }, [userPreferences]);

  const handleChange = (values: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...values }));
    updateUserPreferences(values);
  };

  const handleSignOut = () => {
    window.electron.signOut().then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="settings-context-panel">
      <div className="settings-context-panel__group">
        <SettingsRetroAchievements />
      </div>

      <hr className="settings-context-panel__divider" />

      <div className="settings-context-panel__group">
        <h3>{t("debrid_services")}</h3>
        <SettingsDebrid />
      </div>

      <hr className="settings-context-panel__divider" />

      <div className="settings-context-panel__group">
        <h3>Server Connection</h3>
        <p>Choose which server Hydra connects to for game data and accounts.</p>

        <SelectField
          label="Server Type"
          value={form.serverType}
          onChange={(e) => {
            const val = e.target.value as "official" | "local" | "custom";
            handleChange({ serverType: val });
            setNeedsRestart(true);
          }}
          options={[
            {
              key: "official",
              value: "official",
              label: "Official Hydra Server",
            },
            { key: "local", value: "local", label: "Local Server (localhost)" },
            { key: "custom", value: "custom", label: "Custom Server" },
          ]}
        />

        {form.serverType === "custom" && (
          <TextField
            label="Custom Server URL"
            placeholder="http://your-server.com"
            value={form.customBackendUrl}
            onChange={(e) => {
              handleChange({ customBackendUrl: e.target.value });
            }}
            onBlur={() => {
              setNeedsRestart(true);
            }}
          />
        )}

        {needsRestart && (
          <Button
            theme="primary"
            onClick={() => handleSignOut()}
            style={{ marginTop: 16 }}
          >
            Apply Server Changes & Refresh
          </Button>
        )}
      </div>
    </div>
  );
}

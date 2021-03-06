import {
  AlertVariant,
  Breadcrumb,
  BreadcrumbItem,
  ButtonVariant,
  DropdownItem,
  DropdownSeparator,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import type UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
//import { LocalizationTab } from "./LocalizationTab";
import { useWhoAmI } from "../context/whoami/WhoAmI";
import { toUpperCase } from "../util";
import { RealmSettingsEmailTab } from "./EmailTab";
import { EventsTab } from "./event-config/EventsTab";
import { RealmSettingsGeneralTab } from "./GeneralTab";
import { KeysListTab } from "./KeysListTab";
import { KeysProvidersTab } from "./KeysProvidersTab";
import { RealmSettingsLoginTab } from "./LoginTab";
import { PartialImportDialog } from "./PartialImport";
import { SecurityDefences } from "./security-defences/SecurityDefences";
import { RealmSettingsSessionsTab } from "./SessionsTab";
import { RealmSettingsThemesTab } from "./ThemesTab";

type RealmSettingsHeaderProps = {
  onChange: (value: boolean) => void;
  value: boolean;
  save: () => void;
  realmName: string;
};

export const EditProviderCrumb = () => {
  const { t } = useTranslation("realm-settings");
  const { realm } = useRealm();

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem to={`#/${realm}/realm-settings/keys`}>
          {t("keys")}
        </BreadcrumbItem>
        <BreadcrumbItem>{t("providers")}</BreadcrumbItem>
        <BreadcrumbItem isActive>{t("editProvider")}</BreadcrumbItem>
      </Breadcrumb>
    </>
  );
};

const RealmSettingsHeader = ({
  save,
  onChange,
  value,
  realmName,
}: RealmSettingsHeaderProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const history = useHistory();
  const { refresh } = useRealm();
  const [partialImportOpen, setPartialImportOpen] = useState(false);

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "realm-settings:disableConfirmTitle",
    messageKey: "realm-settings:disableConfirm",
    continueButtonLabel: "common:disable",
    onConfirm: () => {
      onChange(!value);
      save();
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "realm-settings:deleteConfirmTitle",
    messageKey: "realm-settings:deleteConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.realms.del({ realm: realmName });
        addAlert(t("deletedSuccess"), AlertVariant.success);
        history.push("/master/");
        refresh();
      } catch (error) {
        addAlert(t("deleteError", { error }), AlertVariant.danger);
      }
    },
  });

  return (
    <>
      <DisableConfirm />
      <DeleteConfirm />
      <PartialImportDialog
        open={partialImportOpen}
        toggleDialog={() => setPartialImportOpen(!partialImportOpen)}
      />
      <ViewHeader
        titleKey={toUpperCase(realmName)}
        divider={false}
        dropdownItems={[
          <DropdownItem
            key="import"
            data-testid="openPartialImportModal"
            onClick={() => {
              setPartialImportOpen(true);
            }}
          >
            {t("partialImport")}
          </DropdownItem>,
          <DropdownItem key="export">{t("partialExport")}</DropdownItem>,
          <DropdownSeparator key="separator" />,
          <DropdownItem key="delete" onClick={toggleDeleteDialog}>
            {t("common:delete")}
          </DropdownItem>,
        ]}
        isEnabled={value}
        onToggle={(value) => {
          if (!value) {
            toggleDisableDialog();
          } else {
            onChange(value);
            save();
          }
        }}
      />
    </>
  );
};

export const RealmSettingsSection = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const form = useForm({ mode: "onChange" });
  const { control, getValues, setValue, reset: resetForm } = form;
  const [key, setKey] = useState(0);
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [activeTab, setActiveTab] = useState(0);
  const [realmComponents, setRealmComponents] =
    useState<ComponentRepresentation[]>();
  const [currentUser, setCurrentUser] = useState<UserRepresentation>();
  const { whoAmI } = useWhoAmI();

  const kpComponentTypes =
    useServerInfo().componentTypes!["org.keycloak.keys.KeyProvider"];

  useFetch(
    async () => {
      const realm = await adminClient.realms.findOne({ realm: realmName });
      const realmComponents = await adminClient.components.find({
        type: "org.keycloak.keys.KeyProvider",
        realm: realmName,
      });
      const user = await adminClient.users.findOne({ id: whoAmI.getUserId()! });

      return { user, realm, realmComponents };
    },
    ({ user, realm, realmComponents }) => {
      setRealmComponents(realmComponents);
      setCurrentUser(user);
      setRealm(realm);
    },
    [key]
  );

  const refresh = () => {
    setKey(new Date().getTime());
  };

  useEffect(() => {
    if (realm) {
      Object.entries(realm).map((entry) => setValue(entry[0], entry[1]));
      resetForm({ ...realm });
    }
  }, [realm, resetForm]);

  const save = async (realm: RealmRepresentation) => {
    try {
      await adminClient.realms.update({ realm: realmName }, realm);
      setRealm(realm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t("saveError", { error: error.response?.data?.errorMessage || error }),
        AlertVariant.danger
      );
    }
  };

  return (
    <>
      <Controller
        name="enabled"
        control={control}
        defaultValue={true}
        render={({ onChange, value }) => (
          <RealmSettingsHeader
            value={value}
            onChange={onChange}
            realmName={realmName}
            save={() => save(getValues())}
          />
        )}
      />
      <PageSection variant="light" className="pf-u-p-0">
        <FormProvider {...form}>
          <KeycloakTabs isBox>
            <Tab
              eventKey="general"
              title={<TabTitleText>{t("general")}</TabTitleText>}
              data-testid="rs-general-tab"
              aria-label="general-tab"
            >
              <RealmSettingsGeneralTab
                save={save}
                reset={() => resetForm(realm!)}
              />
            </Tab>
            <Tab
              eventKey="login"
              title={<TabTitleText>{t("login")}</TabTitleText>}
              data-testid="rs-login-tab"
              aria-label="login-tab"
            >
              <RealmSettingsLoginTab save={save} realm={realm!} />
            </Tab>
            <Tab
              eventKey="email"
              title={<TabTitleText>{t("email")}</TabTitleText>}
              data-testid="rs-email-tab"
              aria-label="email-tab"
            >
              {realm && (
                <RealmSettingsEmailTab user={currentUser!} realm={realm} />
              )}
            </Tab>
            <Tab
              eventKey="themes"
              title={<TabTitleText>{t("themes")}</TabTitleText>}
              data-testid="rs-themes-tab"
              aria-label="themes-tab"
            >
              <RealmSettingsThemesTab
                save={save}
                reset={() => resetForm(realm!)}
                realm={realm!}
              />
            </Tab>
            <Tab
              eventKey="keys"
              title={<TabTitleText>{t("realm-settings:keys")}</TabTitleText>}
              data-testid="rs-keys-tab"
              aria-label="keys-tab"
            >
              {realmComponents && (
                <Tabs
                  activeKey={activeTab}
                  onSelect={(_, key) => setActiveTab(key as number)}
                >
                  <Tab
                    id="keysList"
                    eventKey={0}
                    data-testid="rs-keys-list-tab"
                    aria-label="keys-list-subtab"
                    title={<TabTitleText>{t("keysList")}</TabTitleText>}
                  >
                    <KeysListTab realmComponents={realmComponents} />
                  </Tab>
                  <Tab
                    id="providers"
                    data-testid="rs-providers-tab"
                    aria-label="rs-providers-tab"
                    eventKey={1}
                    title={<TabTitleText>{t("providers")}</TabTitleText>}
                  >
                    <KeysProvidersTab
                      realmComponents={realmComponents}
                      keyProviderComponentTypes={kpComponentTypes}
                      refresh={refresh}
                    />
                  </Tab>
                </Tabs>
              )}
            </Tab>
            <Tab
              eventKey="events"
              title={<TabTitleText>{t("events")}</TabTitleText>}
              data-testid="rs-realm-events-tab"
              aria-label="realm-events-tab"
            >
              <EventsTab />
            </Tab>

            {/*     <Tab
              id="localization"
              eventKey="localization"
              data-testid="rs-localization-tab"
              title={<TabTitleText>{t("localization")}</TabTitleText>}
            >
              {realm && (
                <LocalizationTab
                  key={key}
                  refresh={refresh}
                  save={save}
                  reset={() => resetForm(realm)}
                  realm={realm}
                />
              )}
              </Tab> */}
            <Tab
              id="securityDefences"
              eventKey="securityDefences"
              title={<TabTitleText>{t("securityDefences")}</TabTitleText>}
            >
              {realm && (
                <SecurityDefences save={save} reset={() => resetForm(realm)} />
              )}
            </Tab>
            <Tab
              id="sessions"
              eventKey="sessions"
              data-testid="rs-sessions-tab"
              aria-label="sessions-tab"
              title={
                <TabTitleText>{t("realm-settings:sessions")}</TabTitleText>
              }
            >
              <RealmSettingsSessionsTab key={key} realm={realm} />
            </Tab>
          </KeycloakTabs>
        </FormProvider>
      </PageSection>
    </>
  );
};

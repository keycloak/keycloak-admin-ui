import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";

import { mapRoles, RoleMapping } from "../components/role-mapping/RoleMapping";
import { useAdminClient } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";

const toRole = (roleName: string) => ({ role: { name: roleName } });

export const UserRegistration = () => {
  const { t } = useTranslation("realm-settings");
  const [activeTab, setActiveTab] = useState(10);

  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();

  const loader = async () => {
    const realm = await adminClient.realms.findOne({ realm: realmName });
    const assignedRoles = realm.defaultRoles!.map(toRole);

    const clients = await adminClient.clients.find();
    const clientRoles = (
      await Promise.all(
        clients.map(async (client) => {
          const clientAssignedRoles = (client.defaultRoles || []).map(
            (name) => ({ ...toRole(name), client })
          );
          return mapRoles(clientAssignedRoles, [], true);
        })
      )
    ).flat();

    return [...mapRoles(assignedRoles, [], true), ...clientRoles];
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as number)}
    >
      <Tab
        id="setup"
        eventKey={10}
        title={<TabTitleText>{t("defaultRoles")}</TabTitleText>}
      >
        <RoleMapping
          name="hello"
          id="12"
          type="service-account"
          loader={loader}
          save={() => Promise.resolve()}
          onHideRolesToggle={() => {}}
        />
      </Tab>
      <Tab
        id="evaluate"
        eventKey={20}
        title={<TabTitleText>{t("defaultGroups")}</TabTitleText>}
      >
        {/* <EvaluateScopes clientId={clientId} protocol={client!.protocol!} /> */}
      </Tab>
    </Tabs>
  );
};

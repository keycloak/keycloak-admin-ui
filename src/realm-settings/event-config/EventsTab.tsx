import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  Title,
  ToolbarItem,
} from "@patternfly/react-core";
import { IFormatterValueType } from "@patternfly/react-table";

import type { RealmEventsConfigRepresentation } from "keycloak-admin/lib/defs/realmEventsConfigRepresentation";
import { FormAccess } from "../../components/form-access/FormAccess";
import { KeycloakDataTable } from "../../components/table-toolbar/KeycloakDataTable";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useAlerts } from "../../components/alert/Alerts";
import { useFetch, useAdminClient } from "../../context/auth/AdminClient";
import { EventConfigForm, EventsType } from "./EventConfigForm";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";

export const EventsTab = () => {
  const { t } = useTranslation("realm-settings");
  const form = useForm();
  const { setValue, handleSubmit, watch } = form;

  const [activeTab, setActiveTab] = useState("user");
  const [events, setEvents] = useState<RealmEventsConfigRepresentation>();
  const [type, setType] = useState<EventsType>();

  const DescriptionCell = (event: { eventType: string }) => (
    <>{t(`eventTypes.${event.eventType}.description`)}</>
  );

  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { realm } = useRealm();

  const setState = (eventConfig?: RealmEventsConfigRepresentation) => {
    setEvents(eventConfig);
    Object.entries(eventConfig || {}).forEach((entry) =>
      setValue(entry[0], entry[1])
    );
  };

  const clear = async (type: EventsType) => {
    setType(type);
    toggleDeleteDialog();
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "realm-settings:deleteEvents",
    messageKey: "realm-settings:deleteEventsConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        switch (type) {
          case "admin":
            await adminClient.realms.clearAdminEvents({ realm });
            break;
          case "user":
            await adminClient.realms.clearEvents({ realm });
            break;
        }
        addAlert(t(`${type}-events-cleared`), AlertVariant.success);
      } catch (error) {
        addAlert(
          t(`${type}-events-cleared-error`, {
            error: error.response?.data?.errorMessage || error,
          }),
          AlertVariant.danger
        );
      }
    },
  });

  useFetch(
    () => adminClient.realms.getConfigEvents({ realm }),
    (eventConfig) => setState(eventConfig),
    []
  );

  const save = async (eventConfig: RealmEventsConfigRepresentation) => {
    try {
      await adminClient.realms.updateConfigEvents({ realm }, eventConfig);
      setState(eventConfig);
      addAlert(t("eventConfigSuccessfully"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t("eventConfigError", {
          error: error.response?.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };
  const eventsEnabled: boolean = watch("eventsEnabled");
  return (
    <>
      <DeleteConfirm />
      <Tabs
        activeKey={activeTab}
        onSelect={(_, key) => setActiveTab(key as string)}
      >
        <Tab
          eventKey="user"
          title={<TabTitleText>{t("userEventsSettings")}</TabTitleText>}
          data-testid="rs-events-tab"
        >
          <PageSection>
            <Title headingLevel="h4" size="xl">
              {t("userEventsConfig")}
            </Title>
          </PageSection>
          <PageSection>
            <FormAccess
              role="manage-events"
              isHorizontal
              onSubmit={handleSubmit(save)}
            >
              <EventConfigForm
                type="user"
                form={form}
                reset={() => setState(events)}
                clear={() => clear("user")}
              />
            </FormAccess>
          </PageSection>
          {eventsEnabled && (
            <PageSection>
              <KeycloakDataTable
                ariaLabelKey="userEventsRegistered"
                searchPlaceholderKey="realm-settings:searchEventType"
                loader={() =>
                  Promise.resolve(
                    events!.enabledEventTypes!.map((eventType) => {
                      return { eventType };
                    })
                  )
                }
                toolbarItem={
                  <ToolbarItem>
                    <Button id="addTypes" onClick={() => {}}>
                      {t("addTypes")}
                    </Button>
                  </ToolbarItem>
                }
                actions={[
                  {
                    title: t("common:delete"),
                    onRowClick: () => {},
                  },
                ]}
                columns={[
                  {
                    name: "eventType",
                    displayKey: "realm-settings:eventType",
                    cellFormatters: [
                      (data?: IFormatterValueType) =>
                        t(`eventTypes.${data}.name`),
                    ],
                  },
                  {
                    name: "description",
                    displayKey: "description",
                    cellRenderer: DescriptionCell,
                  },
                ]}
              />
            </PageSection>
          )}
        </Tab>
        <Tab
          eventKey="admin"
          title={<TabTitleText>{t("adminEventsSettings")}</TabTitleText>}
          data-testid="rs-events-tab"
        >
          <PageSection>
            <Title headingLevel="h4" size="xl">
              {t("adminEventsConfig")}
            </Title>
          </PageSection>
          <PageSection>
            <FormAccess
              role="manage-events"
              isHorizontal
              onSubmit={handleSubmit(save)}
            >
              <EventConfigForm
                type="admin"
                form={form}
                reset={() => setState(events)}
                clear={() => clear("admin")}
              />
            </FormAccess>
          </PageSection>
        </Tab>
      </Tabs>
    </>
  );
};

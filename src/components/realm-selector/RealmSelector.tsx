import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Button,
  Divider,
  SplitItem,
  Split,
  ContextSelector,
  ContextSelectorItem,
} from "@patternfly/react-core";
import { CheckIcon } from "@patternfly/react-icons";

import { Realm } from "../../realm/models/Realm";
import { RealmContext } from "../realm-context/RealmContext";

import "./realm-selector.css";

type RealmSelectorProps = {
  realmList: Realm[];
};

export const RealmSelector = ({ realmList }: RealmSelectorProps) => {
  const { realm, setRealm } = useContext(RealmContext);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState(realmList);
  const history = useHistory();

  const toUpperCase = (realmName: string) =>
    realmName.charAt(0).toUpperCase() + realmName.slice(1);

  const RealmText = ({ value }: { value: string }) => (
    <Split>
      <SplitItem isFilled>{toUpperCase(value)}</SplitItem>
      <SplitItem>{value === realm && <CheckIcon />}</SplitItem>
    </Split>
  );

  const AddRealm = () => (
    <Button isBlock onClick={() => history.push("/add-realm")}>
      Create Realm
    </Button>
  );

  const onFilter = () => {
    const filtered =
      search === ""
        ? realmList
        : realmList.filter(
            (r) => r.realm.toLowerCase().indexOf(search.toLowerCase()) !== -1
          );
    setFilteredItems(filtered || []);
  };

  const dropdownItems = realmList.map((r) => (
    <DropdownItem
      key={r.id}
      onClick={() => {
        setRealm(r.realm);
        setOpen(!open);
      }}
    >
      <RealmText value={r.realm} />
    </DropdownItem>
  ));

  return (
    <>
      {realmList.length > 5 && (
        <ContextSelector
          isOpen={open}
          screenReaderLabel={toUpperCase(realm)}
          onToggle={() => setOpen(!open)}
          onSelect={(_, r) => {
            setRealm(((r as unknown) as any).props.value);
            setOpen(!open);
          }}
          searchInputValue={search}
          onSearchInputChange={(value) => setSearch(value)}
          onSearchButtonClick={() => onFilter()}
          className="keycloak__realm_selector__dropdown"
        >
          {filteredItems.map((item) => (
            <ContextSelectorItem key={item.id}>
              <RealmText value={item.realm} />
            </ContextSelectorItem>
          ))}
          <ContextSelectorItem>
            <AddRealm />
          </ContextSelectorItem>
        </ContextSelector>
      )}
      {realmList.length <= 5 && (
        <Dropdown
          id="realm-select"
          className="keycloak__realm_selector__dropdown"
          isOpen={open}
          toggle={
            <DropdownToggle
              id="realm-select-toggle"
              onToggle={() => setOpen(!open)}
              className=".keycloak__realm_selector_dropdown__toggle"
            >
              {toUpperCase(realm)}
            </DropdownToggle>
          }
          dropdownItems={[
            ...dropdownItems,
            <Divider key="divider"/>,
            <DropdownItem component="div" key="add">
              <AddRealm />
            </DropdownItem>,
          ]}
        />
      )}
    </>
  );
};

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";

export type ExpandableExecution = AuthenticationExecutionInfoRepresentation & {
  executionList: ExpandableExecution[];
  isCollapsed: boolean;
};

export class IndexChange {
  oldIndex: number;
  newIndex: number;

  constructor(oldIndex: number, newIndex: number) {
    this.oldIndex = oldIndex;
    this.newIndex = newIndex;
  }
}

export class LevelChange extends IndexChange {
  parent?: ExpandableExecution;

  constructor(
    oldIndex: number,
    newIndex: number,
    parent?: ExpandableExecution
  ) {
    super(oldIndex, newIndex);
    this.parent = parent;
  }
}

export class ExecutionList {
  private list: ExpandableExecution[];
  expandableList: ExpandableExecution[];

  constructor(list: AuthenticationExecutionInfoRepresentation[]) {
    this.list = list as ExpandableExecution[];
    this.expandableList = this.transformToExpandableList(0, 0, {
      executionList: [],
      isCollapsed: false,
    }).executionList;
  }

  private transformToExpandableList(
    level: number,
    currIndex: number,
    execution: ExpandableExecution
  ) {
    for (let index = currIndex; index < this.list.length; index++) {
      const ex = this.list[index];
      const nextRowLevel = this.list[index + 1]?.level || 0;

      if (ex.level === level && nextRowLevel <= level) {
        execution.executionList.push(ex);
      } else if (ex.level === level && nextRowLevel > level) {
        const expandable = this.transformToExpandableList(
          nextRowLevel,
          index + 1,
          {
            ...ex,
            executionList: [],
            isCollapsed: false,
          }
        );
        execution.executionList.push(expandable);
      }
    }
    return execution;
  }

  order(list?: ExpandableExecution[]) {
    let result: ExpandableExecution[] = [];
    for (const row of list || this.list) {
      result.push(row);
      if (row.executionList && !row.isCollapsed) {
        result = result.concat(this.order(row.executionList));
      }
    }
    return result;
  }

  findExecution(
    id: string,
    list?: ExpandableExecution[]
  ): ExpandableExecution | undefined {
    let found = (list || this.expandableList).find((ex) => ex.id === id);
    if (!found) {
      for (const ex of list || this.expandableList) {
        if (ex.executionList) {
          found = this.findExecution(id, ex.executionList);
          if (found) {
            return found;
          }
        }
      }
    }
    return found;
  }

  private getParentNodesIndex() {
    const result = [];
    for (let index = 0; index < this.list.length; index++) {
      const ex = this.list[index];
      if (
        index + 1 < this.list.length &&
        this.list[index + 1].level! > ex.level!
      ) {
        result.push(index);
      }
    }
    return result;
  }

  getChange(
    changed: AuthenticationExecutionInfoRepresentation,
    order: string[]
  ) {
    const currentOrder = this.order();
    const newLocIndex = order.findIndex((id) => id === changed.id);
    const oldLocation =
      currentOrder[currentOrder.findIndex((ex) => ex.id === changed.id)];
    const newLocation = currentOrder[newLocIndex];

    const parents = this.getParentNodesIndex();

    if (newLocation.level !== oldLocation.level) {
      for (const index of parents.reverse()) {
        if (index < newLocIndex) {
          return new LevelChange(
            this.findExecution(this.list[index].id!)!.executionList.length,
            newLocation.index!,
            this.list[index]
          );
        }
      }
      return new LevelChange(this.expandableList.length, newLocation.index!);
    }

    return new IndexChange(oldLocation.index!, newLocation.index!);
  }

  clone() {
    const newList = new ExecutionList([]);
    newList.list = this.list;
    newList.expandableList = this.expandableList;
    return newList;
  }
}

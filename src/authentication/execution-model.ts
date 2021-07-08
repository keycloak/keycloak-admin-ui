import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";

export type ExpandableExecution = AuthenticationExecutionInfoRepresentation & {
  executionList: ExpandableExecution[];
  isCollapsed: boolean;
};

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

  clone() {
    return new ExecutionList(this.expandableList);
  }
}
